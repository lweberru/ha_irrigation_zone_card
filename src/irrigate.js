// Native integration buttons own the run, its duration and accounting. Never
// replace a missing native action with an automation trigger or a raw valve call.
import { numeric } from './model.js';
import { resolveZone } from './discovery.js';

export function irrigateAction(config, states, system, discovery) {
  const entity = config.irrigate_entity;
  const state = states[entity]?.state;
  return config.show_irrigate === true && !irrigateIssue(config, states, system, discovery) &&
    /^button\.[a-z0-9_]+$/.test(entity || '') && state !== undefined && state !== 'unavailable'
    ? {domain:'button',service:'press',entity} : null;
}
export function irrigateIssue(config, states, system, discovery) {
  const enabled = system?.config?.direct_valve_control_enabled;
  if (typeof enabled !== 'boolean') return 'statusUnknown';
  if (!enabled) return 'enableNative';
  if (!config.irrigate_entity) return 'missingButton';
  if (!states[config.irrigate_entity] || states[config.irrigate_entity].state === 'unavailable') return 'buttonUnavailable';
  if (config.entity && numeric(states[config.entity]?.state) !== null && numeric(states[config.entity]?.state) <= 0) return 'noDemand';
  if (!config.entity && !discovery?.error && Array.isArray(discovery?.zones)) {
    // Use committed per-zone durations, not the next-start preview: its rain
    // adjustments and estimates are not what the native manual button runs.
    const zones = discovery.zones.filter(zone=>zone.linked_entity && zone.state !== 'disabled');
    if (zones.length && zones.every(zone=>{
      const entity = resolveZone({zone:zone.id},discovery).entity;
      const duration = numeric(entity ? states[entity]?.state : zone.duration);
      return duration !== null && duration <= 0;
    })) return 'noDemand';
  }
  return null;
}
export const irrigateText = {
  de:{noDemand:'Kein berechneter Bewässerungsbedarf · Dauer 0 s.',now:'Jetzt bewässern',all:'Alle Zonen bewässern',detail:'Berechneter Lauf · Smart Irrigation',statusUnknown:'Status der nativen Steuerung noch nicht verfügbar. Verbindung zu Smart Irrigation prüfen.',enableNative:'Direkte Ventilsteuerung in Smart Irrigation aktivieren.',missingButton:'Native Steuerung ist aktiv, aber der Bewässerungsbutton fehlt. Smart-Irrigation-Integration einmal neu laden. Erscheint nur der globale Button, Home Assistant neu starten. Danach das Dashboard aktualisieren.',buttonUnavailable:'Native Steuerung ist aktiv, aber der konfigurierte Bewässerungsbutton ist nicht verfügbar. Entität und Integration prüfen.',confirm:'Den berechneten Bewässerungslauf über Smart Irrigation starten?',confirmAll:'Die berechneten Bewässerungsläufe aller geeigneten Zonen über Smart Irrigation starten?'},
  en:{noDemand:'No calculated watering needed · duration 0 s.',now:'Water now',all:'Water all zones',detail:'Calculated run · Smart Irrigation',statusUnknown:'Native control status is not available yet. Check the Smart Irrigation connection.',enableNative:'Enable direct valve control in Smart Irrigation.',missingButton:'Native control is enabled, but its watering button is missing. Reload the Smart Irrigation integration once. If only the global button appears, restart Home Assistant. Then refresh the dashboard.',buttonUnavailable:'Native control is enabled, but the configured watering button is unavailable. Check the entity and integration.',confirm:'Start the calculated watering run through Smart Irrigation?',confirmAll:'Start calculated watering runs for all eligible zones through Smart Irrigation?'},
};
