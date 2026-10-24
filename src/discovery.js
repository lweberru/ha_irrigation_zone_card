import { entityKeys } from './model.js';

export const hasZone = config => config?.zone !== undefined && config.zone !== '';
const roles = { entity:'duration', irrigation_needed_entity:'irrigation_needed', bucket_entity:'live_bucket', water_used_entity:'water_used', et_entity:'et_value', problem_entity:'problem' };

// Match integration-owned unique IDs, never entity-name prefixes or translated labels.
export function resolveZone(config, discovery) {
  if (!hasZone(config)) return config;
  const zone = discovery?.zones?.find(zone => String(zone.id) === String(config.zone));
  const result = { ...config };
  if (!zone) return { ...result, _discoveryIssue:discovery?.error ? 'discoveryFailed' : discovery ? 'zoneMissing' : 'loading' };
  result.name = config.name || zone.name;
  result._etExpected = true;
  result._problemExpected = true;
  const registry = discovery.registry || [];
  for (const [key, role] of Object.entries(roles)) {
    if (config[key]) continue;
    const candidates = registry.filter(entry => entry.platform === 'smart_irrigation' && !entry.disabled_by &&
      entry.unique_id === `smart_irrigation_${zone.id}_${role}` && entry.entity_id?.startsWith(['irrigation_needed_entity','problem_entity'].includes(key) ? 'binary_sensor.' : 'sensor.'));
    // Ambiguity is surfaced as a missing role; never silently choose another zone.
    if (candidates.length === 1) result[key] = candidates[0].entity_id;
  }
  if (!config.moisture_entity && /^sensor\.[a-z0-9_]+$/.test(zone.soil_moisture_sensor || '')) result.moisture_entity = zone.soil_moisture_sensor;
  if (!config.valve_entity && /^(switch|valve)\.[a-z0-9_]+$/.test(zone.linked_entity || '')) result.valve_entity = zone.linked_entity;
  const users = discovery.zones.filter(item => item.linked_entity === result.valve_entity);
  result._sharedValve = result.valve_entity && users.length > 1 ? users.length : 0;
  result._autoMissing = Object.keys(roles).filter(key => !['et_entity','problem_entity'].includes(key) && !result[key]);
  if (discovery.error) result._discoveryIssue = 'discoveryFailed';
  return result;
}

// One shared reader per HA connection, regardless of how many cards/editors are open.
const readers = new WeakMap();
export function watchDiscovery(hass, callback) {
  const key = hass.connection || hass;
  let reader = readers.get(key);
  if (!reader) {
    reader = { listeners:new Set(), snapshot:null, pending:false, again:false, cleanups:[] };
    readers.set(key, reader);
  }
  reader.hass = hass;
  reader.listeners.add(callback);
  if (reader.snapshot) callback(reader.snapshot);
  const refresh = async () => {
    if (reader.pending) { reader.again = true; return; }
    reader.pending = true;
    const results = await Promise.allSettled([
      Promise.resolve().then(()=>reader.hass.callWS({type:'smart_irrigation/zones'})),
      Promise.resolve().then(()=>reader.hass.callWS({type:'config/entity_registry/list'})),
    ]);
    reader.snapshot = {
      zones:results[0].status === 'fulfilled' && Array.isArray(results[0].value) ? results[0].value : [],
      registry:results[1].status === 'fulfilled' && Array.isArray(results[1].value) ? results[1].value : [],
      error:results.some(result => result.status === 'rejected' || !Array.isArray(result.value)),
    };
    reader.pending = false;
    for (const listener of reader.listeners) listener(reader.snapshot);
    if (reader.again && reader.listeners.size) { reader.again = false; void refresh(); }
  };
  if (reader.listeners.size === 1) {
    const connection = hass.connection;
    const subscribe = promise => Promise.resolve(promise).then(unsubscribe => {
      if (reader.listeners.size) reader.cleanups.push(unsubscribe); else unsubscribe();
    }).catch(() => {}); // Older integrations may not support change subscriptions.
    if (connection?.subscribeEvents) subscribe(connection.subscribeEvents(refresh,'entity_registry_updated'));
    if (connection?.subscribeMessage) subscribe(connection.subscribeMessage(refresh,{type:'smart_irrigation_config_updated'}));
    if (connection?.addEventListener) {
      connection.addEventListener('ready',refresh);
      reader.cleanups.push(()=>connection.removeEventListener('ready',refresh));
    }
    void refresh();
  }
  return () => {
    reader.listeners.delete(callback);
    if (!reader.listeners.size) { reader.cleanups.splice(0).forEach(cleanup=>cleanup()); readers.delete(key); }
  };
}

export function sameEntities(a, b) {
  return entityKeys.every(key => a?.[key] === b?.[key]);
}
