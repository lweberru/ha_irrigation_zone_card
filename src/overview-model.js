import { numeric } from './model.js';
import { languageCodes } from './i18n/index.js';

export const overviewEntityKeys = ['automation_entity', 'main_valve_entity', 'calculate_entity', 'update_weather_entity', 'precipitation_switch_entity', 'precipitation_threshold_entity'];
const globalRoles = {
  calculate_entity:['button','smart_irrigation_calculate_all'],
  update_weather_entity:['button','smart_irrigation_update_weather'],
  precipitation_switch_entity:['switch','smart_irrigation_skip_irrigation_on_precipitation'],
  precipitation_threshold_entity:['number','smart_irrigation_precipitation_threshold'],
};
export function validateOverviewConfig(config) {
  if (!config || typeof config !== 'object') throw new Error('Invalid overview configuration.');
  for (const key of overviewEntityKeys) {
    if (config[key] !== undefined && config[key] !== '' && (typeof config[key] !== 'string' || !/^[a-z_]+\.[a-z0-9_]+$/.test(config[key]))) throw new Error(`${key}: invalid entity ID`);
    if (!config[key]) continue;
    const domains = key === 'automation_entity' ? ['automation'] : key === 'main_valve_entity' ? ['switch','valve'] : [globalRoles[key][0]];
    if (!domains.includes(config[key].split('.')[0])) throw new Error(`${key}: expected ${domains.join(' or ')}.`);
  }
  if (config.language !== undefined && !languageCodes.includes(config.language)) throw new Error(`language must be one of: ${languageCodes.join(', ')}.`);
  for (const key of ['name','icon']) if (config[key] !== undefined && typeof config[key] !== 'string') throw new Error(`${key} must be a string.`);
  if (config.show_actions !== undefined && typeof config.show_actions !== 'boolean') throw new Error('show_actions must be a boolean.');
  return {show_actions:true,...config};
}
export function resolveOverview(config, discovery) {
  const result = {...config};
  for (const [key,[domain,uniqueId]] of Object.entries(globalRoles)) {
    if (result[key]) continue;
    const entries = (discovery?.registry || []).filter(entry=>entry.platform === 'smart_irrigation' && entry.unique_id === uniqueId && !entry.disabled_by && entry.entity_id?.startsWith(domain + '.'));
    if (entries.length === 1) result[key] = entries[0].entity_id;
  }
  return result;
}
export function overviewModel(config, states, system, discovery) {
  const info = system?.info;
  const settings = system?.config;
  const allChecks = Array.isArray(info?.skip_preview?.checks) ? info.skip_preview.checks : [];
  const checks = allChecks.filter(check=>check.enabled === true);
  const rain = allChecks.find(check=>check.id === 'precipitation');
  const forecast = numeric(rain?.forecast_mm);
  const threshold = numeric(rain?.threshold_mm);
  const duration = numeric(info?.next_irrigation_duration);
  const zoneCount = Array.isArray(discovery?.zones) && !discovery?.error ? discovery.zones.length : null;
  const needed = Array.isArray(info?.next_irrigation_zones) ? info.next_irrigation_zones.length : null;
  const automation = states[config.automation_entity]?.state;
  const running = Array.isArray(settings?.active_valve_runs) && settings.active_valve_runs.length > 0;
  let status = 'unknown';
  if (system?.error || !info || !settings) status = 'unknown';
  else if (running) status = 'running';
  else if (automation === 'off') status = 'paused';
  else if (config.automation_entity && automation !== 'on') status = 'unknown';
  else if (info.skip_preview?.should_skip === true) status = 'blocked';
  else if (duration === 0) status = 'noDemand';
  else if (duration > 0) status = info.start_trigger_armed === true ? 'scheduled' : 'demand';
  return {info,settings,checks,rain,forecast,threshold,duration,zoneCount,needed,automation,running,status,
    rainFill:forecast !== null && threshold > 0 ? Math.min(100,forecast / threshold * 100) : null,
    estimated:info?.durations_estimated === true,
    valveState:states[config.main_valve_entity]?.state,
    stale:Array.isArray(info?.stale_zones) && info.stale_zones.length > 0,
  };
}
export function overviewAction(config, states, key) {
  const entity = config[key];
  const state = states[entity]?.state;
  if (!entity || state === undefined || state === 'unavailable') return null;
  if (['calculate_entity','update_weather_entity'].includes(key) && entity.startsWith('button.')) return {domain:'button',service:'press',entity};
  if (key === 'automation_entity' && entity.startsWith('automation.') && ['on','off'].includes(state)) return {domain:'automation',service:state === 'on' ? 'turn_off' : 'turn_on',entity};
  if (key === 'precipitation_switch_entity' && entity.startsWith('switch.') && ['on','off'].includes(state)) return {domain:'switch',service:state === 'on' ? 'turn_off' : 'turn_on',entity};
  return null;
}
