// Runtime commands stay with Smart Irrigation; this card owns no timers/queue.
export function controllerModel(system) {
  const supported = system?.config?.full_controller === true;
  const live = system?.controller?.live;
  const programs = Array.isArray(live?.programs) ? live.programs : [];
  const paused = live?.paused === true;
  const busy = live?.cycle === true || programs.length > 0 || (Array.isArray(live?.valves) && live.valves.length > 0);
  return {supported,live,programs,paused,busy,available:supported && !!live && !system?.controllerError,
    enabled:system?.config?.irrigation_enabled !== false,
    state:!live || system?.controllerError ? 'unknown' : paused ? 'paused' : busy ? 'running' : 'idle'};
}
export function controllerAction(config,system,key) {
  const model = controllerModel(system);
  if (config.show_actions === false || config.show_controller === false || !model.available) return null;
  const service = key === 'controller_stop' && (model.busy || model.paused) ? 'stop_watering'
    : key === 'controller_resume' && model.paused && model.enabled ? 'resume_watering'
    : key === 'controller_pause' && model.busy && !model.paused && model.enabled ? 'pause_watering' : null;
  return service ? {domain:'smart_irrigation',service,data:service === 'pause_watering' ? {minutes:config.pause_minutes ?? 60} : {}} : null;
}
export const controllerText = {
  de:{title:'Nativer Controller',master:'Berechnen & bewässern',on:'Zentrale Steuerung aktiv',off:'Zentrale Steuerung aus',masterNote:'Aus stoppt Berechnung und Bewässerung.',confirm:'Berechnung und automatische Bewässerung wieder aktivieren?',idle:'Bereit · kein Lauf aktiv',running:'Bewässerung läuft',paused:'Lauf pausiert',unknown:'Controller-Status nicht verfügbar',pause:'Pause',resume:'Fortsetzen',stop:'Stoppen',open:'Programme & Planung öffnen',remaining:'verbleibend',step:'Schritt',until:'Pause bis',error:'Controller-Daten nicht verfügbar.',resumeConfirm:'Den pausierten Bewässerungslauf fortsetzen?'},
  en:{title:'Native controller',master:'Calculate & water',on:'Central control enabled',off:'Central control disabled',masterNote:'Off stops calculation and watering.',confirm:'Enable calculation and automatic watering again?',idle:'Ready · no active run',running:'Watering in progress',paused:'Run paused',unknown:'Controller status unavailable',pause:'Pause',resume:'Resume',stop:'Stop',open:'Open programs & planning',remaining:'remaining',step:'Step',until:'Paused until',error:'Controller data unavailable.',resumeConfirm:'Resume the paused watering run?'},
};
