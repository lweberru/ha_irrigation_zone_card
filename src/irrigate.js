// Native integration buttons own the run, its duration and accounting. Never
// replace a missing native action with an automation trigger or a raw valve call.
export function irrigateAction(config, states, system) {
  const entity = config.irrigate_entity;
  const state = states[entity]?.state;
  return config.show_irrigate === true && system?.config?.direct_valve_control_enabled === true &&
    /^button\.[a-z0-9_]+$/.test(entity || '') && state !== undefined && state !== 'unavailable'
    ? {domain:'button',service:'press',entity} : null;
}
export function irrigateIssue(config, states, system) {
  const enabled = system?.config?.direct_valve_control_enabled;
  if (typeof enabled !== 'boolean') return 'statusUnknown';
  if (!enabled) return 'enableNative';
  if (!config.irrigate_entity) return 'missingButton';
  if (!states[config.irrigate_entity] || states[config.irrigate_entity].state === 'unavailable') return 'buttonUnavailable';
  return null;
}
export const irrigateText = {
  de:{now:'Jetzt bewässern',all:'Alle Zonen bewässern',detail:'Berechneter Lauf · Smart Irrigation',statusUnknown:'Status der nativen Steuerung noch nicht verfügbar. Verbindung zu Smart Irrigation prüfen.',enableNative:'Direkte Ventilsteuerung in Smart Irrigation aktivieren.',missingButton:'Native Steuerung ist aktiv, aber der Bewässerungsbutton fehlt. Smart-Irrigation-Integration einmal neu laden. Erscheint nur der globale Button, Home Assistant neu starten. Danach das Dashboard aktualisieren.',buttonUnavailable:'Native Steuerung ist aktiv, aber der konfigurierte Bewässerungsbutton ist nicht verfügbar. Entität und Integration prüfen.',confirm:'Den berechneten Bewässerungslauf über Smart Irrigation starten?',confirmAll:'Die berechneten Bewässerungsläufe aller geeigneten Zonen über Smart Irrigation starten?'},
  en:{now:'Water now',all:'Water all zones',detail:'Calculated run · Smart Irrigation',statusUnknown:'Native control status is not available yet. Check the Smart Irrigation connection.',enableNative:'Enable direct valve control in Smart Irrigation.',missingButton:'Native control is enabled, but its watering button is missing. Reload the Smart Irrigation integration once. If only the global button appears, restart Home Assistant. Then refresh the dashboard.',buttonUnavailable:'Native control is enabled, but the configured watering button is unavailable. Check the entity and integration.',confirm:'Start the calculated watering run through Smart Irrigation?',confirmAll:'Start calculated watering runs for all eligible zones through Smart Irrigation?'},
};
