// Native integration buttons own the run, its duration and accounting. Never
// replace a missing native action with an automation trigger or a raw valve call.
export function irrigateAction(config, states, system) {
  const entity = config.irrigate_entity;
  const state = states[entity]?.state;
  return config.show_irrigate === true && system?.config?.direct_valve_control_enabled === true &&
    /^button\.[a-z0-9_]+$/.test(entity || '') && state !== undefined && state !== 'unavailable'
    ? {domain:'button',service:'press',entity} : null;
}
export const irrigateText = {
  de:{now:'Jetzt bewässern',all:'Alle Zonen bewässern',detail:'Berechneter Lauf · Smart Irrigation',unavailable:'Native Bewässerung nicht verfügbar. Direkte Ventilsteuerung in Smart Irrigation aktivieren und den Bewässerungsbutton prüfen.',confirm:'Den berechneten Bewässerungslauf über Smart Irrigation starten?',confirmAll:'Die berechneten Bewässerungsläufe aller geeigneten Zonen über Smart Irrigation starten?'},
  en:{now:'Water now',all:'Water all zones',detail:'Calculated run · Smart Irrigation',unavailable:'Native watering unavailable. Enable direct valve control in Smart Irrigation and check the irrigation button.',confirm:'Start the calculated watering run through Smart Irrigation?',confirmAll:'Start calculated watering runs for all eligible zones through Smart Irrigation?'},
};
