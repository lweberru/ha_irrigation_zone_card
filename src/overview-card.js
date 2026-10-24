import { styles } from './styles.js';
import { numeric } from './model.js';
import { watchDiscovery } from './discovery.js';
import { watchOverview } from './overview-data.js';
import { overviewEntityKeys, validateOverviewConfig, resolveOverview, overviewModel, overviewAction } from './overview-model.js';
import './overview-editor.js';

const text = {
  de:{title:'Bewässerung',eyebrow:'Smart Irrigation · Zentrale',unknown:'Status unbekannt',running:'Bewässerung aktiv',paused:'Automatik pausiert',blocked:'Bewässerung zurückgestellt',noDemand:'Kein Bedarf eingeplant',scheduled:'Start vorgemerkt',demand:'Wasserbedarf vorhanden',planning:'Nächster Planzeitpunkt',notArmed:'Start nicht vorgemerkt',armed:'Start vorgemerkt',noStart:'Kein Startzeitpunkt gewählt',duration:'Gesamtbedarf',estimated:'Prognose',calculated:'Berechnet',zones:'Zonen mit Bedarf',of:'von',forecast:'Regenprognose',threshold:'Regengrenze',window:'Zeitraum',hours:'h',rainProtection:'Regenprognose-Sperre',freeze:'Frostschutz',rain_sensor:'Regensensor',wind:'Windschutz',precipitation:'Regenprognose',soil_moisture:'Bodenfeuchte',days_between:'Bewässerungsabstand',postponed:'Aufschub',clear:'Freigegeben',held:'Sperrt',unavailable:'Nicht verfügbar',disabled:'Ausgeschaltet',active:'Aktiv',inactive:'Aus',limit:'Grenze',heldZones:'Zonen zurückgestellt',checks:'Schutz & Sperrgründe',weather:'Wetterquelle',calculation:'Automatische Berechnung',automatic:'Aktiv',manual:'Aus',calculate:'Alle berechnen',update:'Wetter aktualisieren',automation:'Bewässerungsautomatik',enable:'Aktivieren',pause:'Pausieren',disable:'Deaktivieren',mainValve:'Hauptventil',on:'Geöffnet',off:'Geschlossen',opening:'Öffnet',closing:'Schließt',refresh:'Planung neu laden',sending:'Wird gesendet …',error:'Aktion fehlgeschlagen.',offline:'Zentrale Daten nicht verfügbar. Verbindung und Smart Irrigation prüfen.',loading:'Planung wird geladen …',stale:'Smart Irrigation meldet veraltete Zonendaten.',external:'Ventile werden über eigene Automationen gesteuert.',direct:'Direkte Ventilsteuerung durch Smart Irrigation.',forecastNote:'Vorschau der Integrationsplanung; Bedarf und Sperren können sich bis zum Start ändern.',noChecks:'Keine aktiven Schutzprüfungen gemeldet.',missing:'Konfigurierte Entität nicht verfügbar',day:'Tage',freezeOff:'Der Frostschutz ist in Smart Irrigation ausgeschaltet.',freezeUnknown:'Kein gültiger Temperaturwert verfügbar.',at:'um',freezeLimit:'Frostgrenze',noFreeze:'Kein Frosthindernis',freezeBlocked:'Frostsperre aktiv',pendingCheck:'Prüfung nicht gemeldet'},
  en:{title:'Irrigation',eyebrow:'Smart Irrigation · Overview',unknown:'Status unknown',running:'Irrigation active',paused:'Automation paused',blocked:'Irrigation deferred',noDemand:'No demand planned',scheduled:'Start armed',demand:'Water demand detected',planning:'Next planned start',notArmed:'Start not armed',armed:'Start armed',noStart:'No start trigger selected',duration:'Total demand',estimated:'Forecast',calculated:'Calculated',zones:'Zones needing water',of:'of',forecast:'Rain forecast',threshold:'Rain threshold',window:'Window',hours:'h',rainProtection:'Forecast rain protection',freeze:'Frost protection',rain_sensor:'Rain sensor',wind:'Wind protection',precipitation:'Rain forecast',soil_moisture:'Soil moisture',days_between:'Watering interval',postponed:'Postponed',clear:'Clear',held:'Blocking',unavailable:'Unavailable',disabled:'Disabled',active:'Active',inactive:'Off',limit:'Limit',heldZones:'zones deferred',checks:'Protection & skip conditions',weather:'Weather source',calculation:'Automatic calculation',automatic:'Enabled',manual:'Off',calculate:'Calculate all',update:'Update weather',automation:'Irrigation automation',enable:'Enable',pause:'Pause',disable:'Disable',mainValve:'Main valve',on:'Open',off:'Closed',opening:'Opening',closing:'Closing',refresh:'Reload planning',sending:'Sending …',error:'Action failed.',offline:'Central data unavailable. Check the connection and Smart Irrigation.',loading:'Loading planning …',stale:'Smart Irrigation reports stale zone data.',external:'Valves are controlled by external automations.',direct:'Smart Irrigation controls valves directly.',forecastNote:'Integration planning preview; demand and skip conditions may change before the start.',noChecks:'No active protection checks reported.',missing:'Configured entity unavailable',day:'days',freezeOff:'Frost protection is disabled in Smart Irrigation.',freezeUnknown:'No valid temperature reading available.',at:'at',freezeLimit:'Frost threshold',noFreeze:'No frost restriction',freezeBlocked:'Frost protection blocking',pendingCheck:'Check not reported'},
};
const esc = value=>String(value ?? '').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const icon = value=>`<ha-icon icon="${esc(value)}"></ha-icon>`;
const extraStyles = `
.system-status{margin:24px 0 4px;display:flex;gap:12px;align-items:center}.system-status .symbol{height:42px;width:42px;display:grid;place-items:center;background:color-mix(in srgb,var(--iz-green) 12%,transparent);color:var(--iz-green);border-radius:50%;flex-shrink:0}.system-status strong{font-size:18px;font-weight:550;line-height:1.35}.system-status.blocked .symbol,.system-status.paused .symbol{color:var(--iz-amber);background:color-mix(in srgb,var(--iz-amber) 12%,transparent)}.plan{margin-top:22px;padding:19px;border-radius:18px;background:color-mix(in srgb,var(--iz-green) 7%,transparent)}.plan-date{font-size:22px;font-weight:550;letter-spacing:-.6px;margin:8px 0;line-height:1.3}.plan-note{font-size:11px;color:var(--secondary-text-color,#77877f)}.totals{display:grid;grid-template-columns:1fr 1fr;margin-top:18px;padding-top:16px;border-top:1px solid var(--divider-color,#e1e9e3);gap:12px}.total strong{display:block;font-size:25px;font-weight:550;letter-spacing:-.5px}.total small{font-size:11px;font-weight:400;letter-spacing:0}.total .label{font-size:10px;margin-top:4px}.section-label{font-size:10px;font-weight:650;letter-spacing:1.3px;text-transform:uppercase;color:var(--secondary-text-color,#77877f);margin:22px 0 12px}.frost{display:flex;align-items:center;gap:14px;padding:16px;border:1px solid color-mix(in srgb,var(--iz-blue) 22%,transparent);border-radius:16px;background:color-mix(in srgb,var(--iz-blue) 6%,transparent)}.frost>ha-icon{--mdc-icon-size:28px;color:var(--iz-blue)}.frost .reading{font-size:23px;font-weight:550;white-space:nowrap}.frost .frost-copy{flex:1;min-width:0}.frost strong{font-size:12px;display:block}.frost p{font-size:10px;margin:5px 0 0;color:var(--secondary-text-color,#77877f);line-height:1.4}.frost.blocking{border-color:var(--iz-amber)}.frost.blocking>ha-icon{color:var(--iz-amber)}.frost.unknown{opacity:.8}.protections{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.check{padding:12px;border-radius:12px;background:color-mix(in srgb,var(--primary-text-color,#233c33) 4%,transparent);min-width:0}.check-title{display:flex;align-items:center;gap:6px;font-size:11px}.check-title ha-icon{--mdc-icon-size:16px;color:var(--iz-green)}.check.blocking .check-title ha-icon{color:var(--iz-amber)}.check.unknown .check-title ha-icon{color:var(--secondary-text-color,#77877f)}.check-result{font-size:10px;color:var(--secondary-text-color,#77877f);margin-top:6px;overflow-wrap:anywhere}.rain{margin:18px 0}.rain-heading{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.rain-heading strong{font-size:25px;font-weight:550;color:var(--iz-blue);white-space:nowrap}.rain-heading small{font-size:12px}.rain-track{height:7px;border-radius:8px;background:color-mix(in srgb,var(--iz-blue) 15%,transparent);margin:10px 0 7px;overflow:hidden}.rain-fill{height:100%;background:var(--iz-blue);border-radius:8px}.rain-limit{font-size:10px;color:var(--secondary-text-color,#77877f)}.settings{margin-top:20px;border-top:1px solid var(--divider-color,#e1e9e3);padding-top:6px}.setting{display:flex;align-items:center;gap:12px;padding:11px 0;font-size:12px;min-height:48px}.setting>ha-icon{color:var(--iz-green);--mdc-icon-size:19px}.setting-copy{flex:1;min-width:0}.setting-copy .label{font-size:10px;margin-top:4px}.text-action{border:0;background:color-mix(in srgb,var(--iz-green) 10%,transparent);color:var(--iz-green);padding:9px 12px;min-height:40px;border-radius:10px;font-size:11px;font-weight:550;max-width:55%;overflow-wrap:anywhere}.facts{display:flex;justify-content:space-between;gap:12px;font-size:10px;margin-top:18px;color:var(--secondary-text-color,#77877f);line-height:1.6}.facts span{max-width:52%;overflow-wrap:anywhere}.actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px}.actions button{display:flex;justify-content:center;align-items:center;gap:7px;border:0;padding:13px 8px;border-radius:12px;min-height:46px;background:var(--iz-green);color:var(--iz-button-text,#fff);font-size:11px;font-weight:600}.actions button.secondary{background:color-mix(in srgb,var(--iz-blue) 12%,transparent);color:var(--iz-blue)}.actions ha-icon{--mdc-icon-size:18px}.footnote{font-size:10px;line-height:1.5;color:var(--secondary-text-color,#77877f);margin-top:14px}.unknown .symbol{color:var(--secondary-text-color,#77877f)}@container(max-width:300px){.protections,.actions{grid-template-columns:1fr}.plan-date{font-size:19px}.frost{gap:8px;padding:12px}.frost .reading{font-size:19px}}
`;
export class IrrigationOverviewCard extends HTMLElement {
  constructor(){super();this.attachShadow({mode:'open'});this._pending=null;}
  setConfig(config){this._config=validateOverviewConfig(config);this._watch();this._render();}
  set hass(hass){
    const old=this._hass;this._hass=hass;this._watch();
    if(!this._config)return;
    const ids=new Set([...overviewEntityKeys.map(key=>this._resolved()[key]),...(this._discovery?.registry||[]).filter(entry=>entry.platform==='smart_irrigation').map(entry=>entry.entity_id),this._system?.config?.rain_sensor,this._system?.config?.freeze_sensor,this._system?.config?.wind_sensor]);
    const changed=!old||[...ids].some(id=>id&&old.states[id]!==hass.states[id]);
    if(changed||old.language!==hass.language||old.locale!==hass.locale||old.themes!==hass.themes)this._render();
    if(old&&changed&&this._systemReader&&!this._refreshTimer)this._refreshTimer=setTimeout(()=>{this._refreshTimer=null;void this._systemReader?.refresh();},300);
  }
  connectedCallback(){this._watch();this._render();}
  disconnectedCallback(){this._stop();}
  _stop(){this._unwatch?.();this._systemReader?.unsubscribe();this._unwatch=null;this._systemReader=null;this._connection=null;clearTimeout(this._refreshTimer);this._refreshTimer=null;}
  _watch(){
    if(!this.isConnected||!this._config||!this._hass?.callWS)return;
    const connection=this._hass.connection||this._hass;
    if(this._connection===connection)return;
    this._stop();this._connection=connection;this._discovery=null;this._system=null;
    this._unwatch=watchDiscovery(this._hass,snapshot=>{this._discovery=snapshot;this._render();});
    this._systemReader=watchOverview(this._hass,snapshot=>{this._system=snapshot;this._render();});
  }
  _resolved(){return resolveOverview(this._config,this._discovery);}
  getCardSize(){return 15;}
  getGridOptions(){return {columns:12,rows:'auto',min_columns:6};}
  static getStubConfig(){return {};}
  static getConfigElement(){return document.createElement('irrigation-overview-card-editor');}
  _number(value){return value===null?'—':new Intl.NumberFormat(this._hass.locale?.language||this._hass.language||'en',{maximumFractionDigits:1}).format(value);}
  _date(value){
    if(!value||!Number.isFinite(Date.parse(value)))return '—';
    return new Intl.DateTimeFormat(this._hass.locale?.language||this._hass.language||'en',{dateStyle:'medium',timeStyle:'short',timeZone:this._hass.config?.time_zone||'UTC'}).format(new Date(value));
  }
  _duration(seconds){if(seconds===null)return '—';if(seconds<60)return `${this._number(seconds)} s`;return `${this._number(seconds/60)} min`;}
  _state(id){const state=this._hass.states[id];if(!state||['unknown','unavailable'].includes(state.state))return this._t.unavailable;return this._hass.formatEntityState?.(state)||`${state.state} ${state.attributes?.unit_of_measurement||''}`.trim();}
  _more(entityId){if(entityId)this.dispatchEvent(new CustomEvent('hass-more-info',{detail:{entityId},bubbles:true,composed:true}));}
  async _action(key){
    if(this._pending)return;
    const action=overviewAction(this._resolved(),this._hass.states,key);if(!action)return;
    this._pending=key;this._error='';this._render();
    try{await this._hass.callService(action.domain,action.service,{entity_id:action.entity});await this._systemReader?.refresh();}
    catch(error){this._error=`${this._t.error} ${error?.message||''}`;}
    finally{this._pending=null;this._render();}
  }
  _checkDetail(check){
    const t=this._t;if(check.available===false)return t.unavailable;
    if(check.id==='soil_moisture'&&Array.isArray(check.zones)){const held=check.zones.filter(zone=>zone.held).length;return held?`${held} ${t.heldZones}`:t.clear;}
    if(check.id==='days_between'&&numeric(check.days_since)!==null&&numeric(check.days_required)!==null)return `${this._number(check.days_since)} / ${this._number(check.days_required)} ${t.day}`;
    if(check.id==='rain_sensor')return check.raining===true?t.held:check.raining===false?t.clear:t.unavailable;
    if(check.id==='postponed'&&check.until)return this._date(check.until);
    if(numeric(check.value)!==null)return `${this._number(numeric(check.value))} ${check.unit||''}${numeric(check.threshold)!==null?` · ${t.limit} ${this._number(numeric(check.threshold))} ${check.unit||''}`:''}`;
    return check.skip===true?t.held:check.skip===false?t.clear:t.unavailable;
  }
  _render(){
    if(!this._config||!this._hass)return;
    const config=this._resolved(),m=overviewModel(config,this._hass.states,this._system,this._discovery);
    const lang=config.language&&config.language!=='auto'?config.language:this._hass.language;
    const t=this._t=text[lang?.startsWith('de')?'de':'en'];
    this.toggleAttribute('dark',!!this._hass.themes?.darkMode);
    const focus=this.shadowRoot.activeElement?.id;
    const rawFreeze=Array.isArray(m.info?.skip_preview?.checks)?m.info.skip_preview.checks.find(check=>check.id==='freeze'):null;
    const freezeEnabled=rawFreeze?.enabled===true;
    const freezeValid=freezeEnabled&&rawFreeze.available!==false&&numeric(rawFreeze.value)!==null;
    const freezeClass=freezeEnabled&&rawFreeze.skip===true?'blocking':!rawFreeze||(freezeEnabled&&!freezeValid)?'unknown':'';
    const freezeCaption=!rawFreeze?t.pendingCheck:!freezeEnabled?t.freezeOff:!freezeValid?t.freezeUnknown:rawFreeze.skip===true?t.freezeBlocked:t.noFreeze;
    const checkIcons={rain_sensor:'mdi:weather-rainy',wind:'mdi:weather-windy',precipitation:'mdi:weather-pouring',soil_moisture:'mdi:sprout',days_between:'mdi:calendar-clock',postponed:'mdi:pause-circle-outline'};
    const checks=m.checks.filter(check=>!['freeze','precipitation'].includes(check.id));
    const statusIcon={blocked:'mdi:shield-alert-outline',running:'mdi:sprinkler',paused:'mdi:pause-circle-outline',unknown:'mdi:help-circle-outline',noDemand:'mdi:check',scheduled:'mdi:calendar-check',demand:'mdi:water-alert'}[m.status];
    const actionButton=(key,label,ico,secondary=false)=>`<button id="${key}" data-action="${key}" class="${secondary?'secondary':''}" ${!overviewAction(config,this._hass.states,key)||this._pending?'disabled':''}>${icon(ico)}${esc(this._pending===key?t.sending:label)}</button>`;
    const precipitationState=this._hass.states[config.precipitation_switch_entity]?.state;
    const missing=overviewEntityKeys.filter(key=>config[key]&&(!this._hass.states[config[key]]||this._hass.states[config[key]].state==='unavailable'||(!config[key].startsWith('button.')&&this._hass.states[config[key]].state==='unknown')));
    const valveText={on:t.on,open:t.on,off:t.off,closed:t.off,opening:t.opening,closing:t.closing}[m.valveState]||t.unavailable;
    this.shadowRoot.innerHTML=`<style>${styles}${extraStyles}</style><ha-card><div class="wrap">
      <header><div class="zone-icon">${icon(config.icon||'mdi:sprinkler-variant')}</div><div class="heading"><div class="eyebrow">${esc(t.eyebrow)}</div><h2>${esc(config.name||t.title)}</h2></div><button id="refresh" class="more" aria-label="${esc(t.refresh)}" ${!this._systemReader?'disabled':''}>${icon('mdi:refresh')}</button></header>
      <div class="system-status ${m.status}" role="status"><div class="symbol">${icon(statusIcon)}</div><strong>${esc(t[m.status])}</strong></div>
      <div class="plan"><div class="label">${esc(t.planning)}</div><div class="plan-date">${esc(m.info?.active_start_trigger==='none'?t.noStart:this._date(m.info?.next_irrigation_start))}</div><div class="plan-note">${esc(m.info?.start_trigger_armed===true?t.armed:m.info?.start_trigger_armed===false?t.notArmed:t.unavailable)}</div><div class="totals"><div class="total"><strong>${esc(this._duration(m.duration))}</strong><div class="label">${esc(t.duration)} · ${esc(m.estimated?t.estimated:t.calculated)}</div></div><div class="total"><strong>${esc(this._number(m.needed))}<small> ${esc(t.of)} ${esc(this._number(m.zoneCount))}</small></strong><div class="label">${esc(t.zones)}</div></div></div></div>
      <div class="section-label">${esc(t.checks)}</div><div class="frost ${freezeClass}" role="status">${icon('mdi:snowflake')}<div class="frost-copy"><strong>${esc(t.freeze)}</strong><p>${esc(freezeCaption)}</p>${numeric(rawFreeze?.threshold)!==null?`<p>${esc(t.freezeLimit)} ${esc(this._number(numeric(rawFreeze.threshold)))} ${esc(rawFreeze.unit||'')}</p>`:''}</div><div class="reading">${esc(freezeValid?this._number(numeric(rawFreeze.value)):'—')}<small>${esc(freezeValid?rawFreeze.unit||'':'')}</small></div></div>
      ${m.rain?`<div class="rain"><div class="rain-heading"><div class="label">${esc(t.forecast)}${numeric(m.rain.window_hours)!==null?` · ${esc(this._number(numeric(m.rain.window_hours)))} ${esc(t.hours)}`:''}</div><strong>${esc(this._number(m.forecast))} <small>mm</small></strong></div><div class="rain-track" role="img" aria-label="${esc(t.forecast+': '+this._number(m.forecast)+' mm · '+t.threshold+': '+this._number(m.threshold)+' mm')}"><div class="rain-fill" style="width:${m.rainFill??0}%"></div></div><div class="rain-limit">${esc(t.threshold)} ${esc(this._number(m.threshold))} mm · ${esc(m.rain.enabled!==true?t.disabled:m.rain.available===false?t.unavailable:m.rain.skip===true?t.held:m.rain.skip===false?t.clear:t.unavailable)}</div></div>`:''}
      <div class="protections">${checks.map(check=>`<div class="check ${check.available===false?'unknown':check.skip===true?'blocking':''}"><div class="check-title">${icon(checkIcons[check.id]||'mdi:shield-check-outline')}${esc(t[check.id]||check.id)}</div><div class="check-result">${esc(this._checkDetail(check))}</div></div>`).join('')}</div>
      <div class="settings">
        ${config.automation_entity?`<div class="setting">${icon('mdi:autorenew')}<div class="setting-copy">${esc(t.automation)}<div class="label">${esc(m.automation==='on'?t.active:m.automation==='off'?t.inactive:t.unavailable)}</div></div>${config.show_actions?`<button id="automation_entity" class="text-action" data-action="automation_entity" ${!overviewAction(config,this._hass.states,'automation_entity')||this._pending?'disabled':''}>${esc(m.automation==='on'?t.pause:t.enable)}</button>`:''}</div>`:''}
        ${config.main_valve_entity?`<div class="setting">${icon('mdi:pipe-valve')}<div class="setting-copy">${esc(t.mainValve)}</div><button id="main-valve" class="text-action" data-entity="${esc(config.main_valve_entity)}">${esc(valveText)}</button></div>`:''}
        ${config.precipitation_switch_entity?`<div class="setting">${icon('mdi:weather-pouring')}<div class="setting-copy">${esc(t.rainProtection)}<div class="label">${esc(precipitationState==='on'?t.active:precipitationState==='off'?t.inactive:t.unavailable)}</div></div>${config.show_actions?`<button id="precipitation_switch_entity" class="text-action" data-action="precipitation_switch_entity" ${!overviewAction(config,this._hass.states,'precipitation_switch_entity')||this._pending?'disabled':''}>${esc(precipitationState==='on'?t.disable:t.enable)}</button>`:''}</div>`:''}
        ${config.precipitation_threshold_entity?`<div class="setting">${icon('mdi:water-outline')}<div class="setting-copy">${esc(t.threshold)}</div><button id="rain-threshold" class="text-action" data-entity="${esc(config.precipitation_threshold_entity)}">${esc(this._state(config.precipitation_threshold_entity))}</button></div>`:''}
      </div>
      <div class="facts"><span>${esc(t.weather)}<br><strong>${esc(m.settings?.use_weather_service===false?t.inactive:m.settings?.weather_service||'—')}</strong></span><span>${esc(t.calculation)}<br><strong>${esc(m.settings?.autocalcenabled===true?`${t.automatic}${m.settings.calctime?' · '+m.settings.calctime:''}`:m.settings?.autocalcenabled===false?t.manual:'—')}</strong></span></div>
      ${config.show_actions?`<div class="actions">${actionButton('calculate_entity',t.calculate,'mdi:calculator-variant-outline')}${actionButton('update_weather_entity',t.update,'mdi:weather-sync',true)}</div>`:''}
      ${!this._system||this._system.error?`<div class="notice" role="status">${esc(this._system?.error?t.offline:t.loading)}</div>`:''}
      ${this._discovery?.error?`<div class="notice">${esc(t.offline)}</div>`:''}
      ${m.stale?`<div class="notice">${esc(t.stale)}</div>`:''}
      ${missing.length?`<div class="notice">${esc(t.missing)}: ${missing.map(key=>esc(config[key])).join(', ')}</div>`:''}
      ${this._error?`<div role="alert" class="notice error">${esc(this._error)}</div>`:''}
      <div class="footnote">${esc(m.settings?.direct_valve_control_enabled===true?t.direct:m.settings?.direct_valve_control_enabled===false?t.external:'')} ${esc(t.forecastNote)}</div>
    </div></ha-card>`;
    this.shadowRoot.querySelector('#refresh').onclick=()=>this._systemReader?.refresh();
    this.shadowRoot.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>this._action(button.dataset.action));
    this.shadowRoot.querySelectorAll('[data-entity]').forEach(button=>button.onclick=()=>this._more(button.dataset.entity));
    if(focus)this.shadowRoot.getElementById(focus)?.focus({preventScroll:true});
  }
}
if(!customElements.get('irrigation-overview-card'))customElements.define('irrigation-overview-card',IrrigationOverviewCard);
window.customCards=window.customCards||[];
if(!window.customCards.some(card=>card.type==='irrigation-overview-card'))window.customCards.push({type:'irrigation-overview-card',name:'Irrigation Overview',description:'Central Smart Irrigation planning, frost protection, rain forecast and actions.',preview:true,documentationURL:'https://github.com/lweberru/ha_irrigation_zone_card'});
