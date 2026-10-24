import { numeric } from './model.js';

// Keep configured rules separate from the backend's latest skip preview. A missing
// preview is never treated as permission to irrigate, and no dates are guessed.
export function zoneRules(config, discovery, system) {
  if (config.show_rules === false || config.zone === undefined || config.zone === '') return null;
  const zone = discovery?.zones?.find(item => String(item.id) === String(config.zone));
  if (!zone) return null;
  const ownDays = numeric(zone.days_between_irrigation);
  const rawChecks = system?.info?.skip_preview?.checks;
  const checks = Array.isArray(rawChecks) ? rawChecks : null;
  const dayCheck = checks?.find(item => item.id === 'days_between');
  const soilCheck = checks?.find(item => item.id === 'soil_moisture');
  const soil = soilCheck?.zones?.find(item => String(item.zone_id) === String(zone.id));
  const unit = system?.config?.stored_units || system?.config?.units;
  const held = [];
  if (dayCheck?.enabled === true && dayCheck.available === true && dayCheck.zones_held?.some(item => String(item?.zone_id ?? item?.id ?? item) === String(zone.id))) held.push('intervalHeld');
  if (soilCheck?.enabled === true && soilCheck.available === true && soil?.held === true) held.push('moistureHeld');
  const globalHolds = checks?.filter(item => !['days_between','soil_moisture'].includes(item.id) && item.enabled === true && item.available === true && item.skip === true) || [];
  if (globalHolds.length) held.push('globalHeld');
  return {
    threshold:numeric(zone.irrigation_threshold), unit:unit === 'metric' ? 'mm' : unit === 'imperial' ? 'in' : null,
    days:ownDays ?? numeric(system?.config?.days_between_irrigation), inherited:ownDays === null,
    moisture:zone.soil_moisture_sensor ? numeric(zone.soil_moisture_threshold) : null,
    hasMoisture:!!zone.soil_moisture_sensor,
    maxSeconds:numeric(zone.maximum_duration), held,
    checksKnown:!!checks?.length && !system?.error && checks.every(item => item.enabled !== true || item.available === true),
  };
}

export const ruleLabels = {
  de:{title:'Bewässerungsregeln',threshold:'Defizitschwelle',thresholdHint:'Konfigurierte Startschwelle · kein Zielwert der Wasserbilanz',interval:'Mindestabstand',day:'Tag',days:'Tage',own:'Zone',global:'Global',moisture:'Bodenfeuchte-Sperre',noSensor:'Kein Sensor',at:'ab',limit:'Laufzeitlimit',unlimited:'Ohne Limit',intervalHeld:'Mindestabstand noch nicht erreicht',moistureHeld:'Bodenfeuchte hält die Zone zurück',globalHeld:'Zentrale Schutzprüfung hält den Start zurück',unknown:'Aktuelle Schutzprüfung nicht verfügbar',source:'Konfigurierte Werte · Änderungen in Smart Irrigation'},
  en:{title:'Irrigation rules',threshold:'Deficit threshold',thresholdHint:'Configured start threshold · not a water balance target',interval:'Minimum interval',day:'day',days:'days',own:'Zone',global:'Global',moisture:'Soil moisture hold',noSensor:'No sensor',at:'from',limit:'Runtime limit',unlimited:'No limit',intervalHeld:'Minimum interval not yet reached',moistureHeld:'Soil moisture is holding this zone',globalHeld:'A central protection check is holding the start',unknown:'Current protection preview unavailable',source:'Configured values · edit in Smart Irrigation'},
};
