import { styles } from './styles.js';
import { entityKeys, validateConfig, zoneModel, durationParts } from './model.js';
import './editor.js';
import './overview-card.js';
import { hasZone, resolveZone, watchDiscovery, sameEntities } from './discovery.js';

export const translations = {
  de: { zone:'Bewässerungszone', watering:'Ventil aktiv', needed:'Bewässerung nötig', balanced:'Kein Wasserbedarf', unknown:'Wasserbedarf unbekannt', moisture:'Bodenfeuchte', balance:'Wasserbilanz · live', reserve:'Wasservorrat', deficit:'Wasserdefizit', neutral:'Ausgeglichen', duration:'Berechnete Dauer', used:'Wasserverbrauch', valve:'Zonenventil', open:'Öffnen', close:'Schließen', opening:'Öffnet …', closing:'Schließt …', on:'Geöffnet', off:'Geschlossen', unavailable:'Nicht verfügbar', pending:'Wird gesendet …', confirm:'Ventil manuell öffnen? Es bleibt geöffnet, bis es geschlossen wird. Die berechnete Dauer startet keinen Timer.', manual:'Manuell · ohne Abschalttimer', failed:'Ventil konnte nicht geschaltet werden.', missing:'Nicht verfügbar', details:'Zonendetails öffnen', noData:'Die konfigurierten Sensoren liefern noch keine Werte.' },
  en: { zone:'Irrigation zone', watering:'Valve active', needed:'Irrigation needed', balanced:'No irrigation needed', unknown:'Water demand unknown', moisture:'Soil moisture', balance:'Water balance · live', reserve:'Water reserve', deficit:'Water deficit', neutral:'Balanced', duration:'Calculated duration', used:'Water used', valve:'Zone valve', open:'Open', close:'Close', opening:'Opening …', closing:'Closing …', on:'Open', off:'Closed', unavailable:'Unavailable', pending:'Sending …', confirm:'Open valve manually? It stays open until closed. The calculated duration does not start a timer.', manual:'Manual · no shutoff timer', failed:'Could not control the valve.', missing:'Unavailable', details:'Open zone details', noData:'The configured sensors have no readings yet.' },
};
Object.assign(translations.de, { sharedValve:'Gemeinsames Ventil', loading:'Zone wird geladen …', zoneMissing:'Die ausgewählte Smart-Irrigation-Zone wurde nicht gefunden.', discoveryFailed:'Automatische Zuordnung nicht verfügbar. Verbindung und Smart-Irrigation-Integration prüfen oder Entitäten manuell eintragen.', autoMissing:'Sensoren nicht automatisch gefunden (optional manuell zuweisen)' });
Object.assign(translations.en, { sharedValve:'Shared valve', loading:'Loading zone …', zoneMissing:'The selected Smart Irrigation zone was not found.', discoveryFailed:'Automatic discovery unavailable. Check the connection and Smart Irrigation integration or configure entities manually.', autoMissing:'Sensors not discovered (assign manually if needed)' });
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const icon = value => `<ha-icon icon="${escape(value)}"></ha-icon>`;

export class IrrigationZoneCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode:'open' }); this._pending = false; }
  connectedCallback() { this._watchDiscovery(); }
  disconnectedCallback() { this._unwatch?.(); this._unwatch = null; this._connection = null; }
  setConfig(config) { this._config = validateConfig(config); this._watchDiscovery(); this._render(); }
  _watchDiscovery() {
    const connection = this._hass?.connection || this._hass;
    if (!this.isConnected || !hasZone(this._config) || !this._hass?.callWS) {
      if (!hasZone(this._config)) { this._unwatch?.(); this._unwatch = null; this._connection = null; this._discovery = null; }
      return;
    }
    if (this._connection === connection) return;
    this._unwatch?.(); this._discovery = null; this._connection = connection;
    this._unwatch = watchDiscovery(this._hass, snapshot => { this._discovery = snapshot; this._render(); });
  }
  _resolved() { return resolveZone(this._config, this._discovery); }
  set hass(value) {
    const old = this._hass;
    const previous = this._config ? this._resolved() : null;
    this._hass = value;
    if (!this._config) return;
    this._watchDiscovery();
    const resolved = this._resolved();
    if (!old || old.language !== value.language || old.locale !== value.locale || old.themes !== value.themes ||
      !sameEntities(previous, resolved) || entityKeys.some(key => old.states[resolved[key]] !== value.states[resolved[key]])) this._render();
  }
  getCardSize() { return this._config?.valve_entity ? 9 : 8; }
  getGridOptions() { return { columns:12, rows:'auto', min_columns:6 }; }
  static getConfigElement() { return document.createElement('irrigation-zone-card-editor'); }
  static getStubConfig(hass) {
    const entity = Object.keys(hass?.states || {}).find(id => id.startsWith('sensor.smart_irrigation_') && hass.states[id].attributes?.device_class === 'duration');
    const zone = hass?.states[entity]?.attributes?.id;
    if (Number.isSafeInteger(zone) && zone >= 0) return {zone};
    if (!entity) return { entity:'sensor.smart_irrigation_zone' };
    const result = { entity };
    for (const [key, id] of Object.entries({ irrigation_needed_entity:entity.replace('sensor.', 'binary_sensor.') + '_irrigation_needed', bucket_entity:entity + '_live_bucket', water_used_entity:entity + '_water_used' })) {
      if (hass.states[id]) result[key] = id;
    }
    return result;
  }
  _number(number, signed = false) {
    if (number === null) return '—';
    return new Intl.NumberFormat(this._hass.locale?.language || this._hass.language || 'en', { maximumFractionDigits:1, signDisplay:signed ? 'exceptZero' : 'auto' }).format(number);
  }
  _state(id) {
    const state = this._hass.states[id];
    if (!state || ['unknown','unavailable'].includes(state.state)) return '—';
    return this._hass.formatEntityState ? this._hass.formatEntityState(state) : `${state.state} ${state.attributes?.unit_of_measurement || ''}`.trim();
  }
  _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail:{entityId:id}, bubbles:true, composed:true })); }
  async _control() {
    if (this._pending) return;
    const config = this._resolved();
    const model = zoneModel(config, this._hass.states);
    const action = model.action;
    if (!action) return;
    if (['turn_on','open_valve'].includes(action.service) && config.confirm_open && !window.confirm(`${config._sharedValve ? this._t.sharedValve + ' ' : ''}${this._t.confirm}`)) return;
    this._pending = true; this._error = ''; this._render();
    try {
      await this._hass.callService(action.domain, action.service, { entity_id:config.valve_entity });
    } catch (error) { this._error = `${this._t.failed} ${error?.message || ''}`; }
    finally { this._pending = false; this._render(); }
  }
  _render() {
    if (!this._config || !this._hass) return;
    this.toggleAttribute('dark', !!this._hass.themes?.darkMode);
    const focused = this.shadowRoot.activeElement;
    const focusTarget = focused?.id ? {id:focused.id} : focused?.dataset.entity ? {entity:focused.dataset.entity} : focused?.classList.contains('more') ? {more:true} : null;
    const config = this._resolved();
    const lang = config.language === 'auto' || !config.language ? this._hass.language : config.language;
    const t = this._t = translations[lang?.startsWith('de') ? 'de' : 'en'];
    const m = zoneModel(config, this._hass.states);
    const name = config.name || m.main?.attributes?.friendly_name?.replace(/ (Dauer|Duration)$/i,'') || 'Smart Irrigation';
    const duration = durationParts(m.main);
    const durationHTML = duration ? `${escape(this._number(duration.value))} <small>${escape(duration.unit)}${duration.remainder ? ` ${duration.remainder} ${duration.remainderUnit}` : ''}</small>` : '—';
    const missing = entityKeys.filter(key => config[key] && (!this._hass.states[config[key]] || ['unknown','unavailable'].includes(this._hass.states[config[key]].state)));
    const valveState = { on:t.on, open:t.on, off:t.off, closed:t.off, opening:t.opening, closing:t.closing }[m.valve?.state] || t.unavailable;
    const close = ['turn_off','close_valve'].includes(m.action?.service);
    const moistureUnit = this._hass.states[config.moisture_entity]?.attributes?.unit_of_measurement || '';
    this.shadowRoot.innerHTML = `<style>${styles}</style><ha-card><div class="wrap">
      <header><div class="zone-icon">${icon(config.icon || 'mdi:sprinkler-variant')}</div><div class="heading"><div class="eyebrow">${escape(t.zone)}</div><h2>${escape(name)}</h2></div><button class="more" aria-label="${escape(t.details)}">${icon('mdi:dots-horizontal')}</button></header>
      <div class="status ${m.status}" role="status"><span class="dot"></span>${escape(t[m.status])}</div>
      ${config.moisture_entity || config.bucket_entity ? `<div class="overview">
        ${config.moisture_entity ? `<button class="ring ring-button" data-entity="${escape(config.moisture_entity)}" aria-label="${escape(t.moisture + ': ' + this._state(config.moisture_entity))}">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="track" cx="60" cy="60" r="54" fill="none" stroke-width="5"/><circle class="arc" cx="60" cy="60" r="54" fill="none" stroke-width="5" pathLength="100" stroke-dasharray="${m.moistureFill} 100"/></svg>
          <div class="ring-content">${icon('mdi:sprout')}<div class="ring-value">${escape(this._number(m.moisture))}<small>${escape(m.moisture === null ? '' : moistureUnit)}</small></div><div class="ring-label">${escape(t.moisture)}</div></div>
        </button>` : ''}
        ${config.bucket_entity ? `<div class="balance ${m.balance < 0 ? 'deficit' : ''}" style="--zero:${m.zero}%;--position:${m.position ?? m.zero}%">
          <div class="label">${escape(t.balance)}</div><div class="balance-value">${escape(this._number(m.balance,true))} <small>${escape(this._hass.states[config.bucket_entity]?.attributes?.unit_of_measurement || '')}</small></div>
          <div class="hint">${escape(m.balance === null ? t.unavailable : m.balance < 0 ? t.deficit : m.balance > 0 ? t.reserve : t.neutral)}</div>
          <div class="balance-bar" role="img" aria-label="${escape(t.balance + ': ' + this._state(config.bucket_entity))}"><span class="zero"></span>${m.position === null ? '' : '<span class="marker"></span>'}</div><div class="scale"><span>${escape(this._number(m.min))}</span><span class="center">0</span><span>+${escape(this._number(m.max))}</span></div>
        </div>` : ''}
      </div>` : '<div class="empty-overview"></div>'}
      <div class="stats"><button class="stat" data-entity="${escape(config.entity)}">${icon('mdi:timer-outline')}<div><div class="stat-value">${durationHTML}</div><div class="label">${escape(t.duration)}</div></div></button>
      ${config.water_used_entity ? `<button class="stat" data-entity="${escape(config.water_used_entity)}">${icon('mdi:water-outline')}<div><div class="stat-value">${escape(this._state(config.water_used_entity))}</div><div class="label">${escape(t.used)}</div></div></button>` : ''}</div>
      ${config.valve_entity ? `<div class="control">${icon(m.active ? 'mdi:pipe-valve' : 'mdi:valve-closed')}<div class="control-copy"><div class="control-title">${escape(config._sharedValve ? t.sharedValve : t.valve)} · ${escape(valveState)}</div><div class="control-state">${escape(t.manual)}</div></div>${config.show_control ? `<button id="control" class="${close ? 'close' : ''}" ${!m.action || this._pending ? 'disabled' : ''}>${escape(this._pending ? t.pending : close ? t.close : t.open)}</button>` : ''}</div>` : ''}
      ${config._discoveryIssue ? `<div class="notice" role="status">${escape(t[config._discoveryIssue])}</div>` : ''}
      ${config._autoMissing?.length ? `<div class="notice">${escape(t.autoMissing)}: ${config._autoMissing.map(escape).join(', ')}</div>` : ''}
      ${missing.length ? `<div class="notice">${escape(t.missing)}: ${missing.map(key=>escape(config[key])).join(', ')}</div>` : ''}
      ${this._error ? `<div role="alert" class="notice error">${escape(this._error)}</div>` : ''}
    </div></ha-card>`;
    this.shadowRoot.querySelector('.more').addEventListener('click',()=>this._more(config.entity));
    this.shadowRoot.querySelectorAll('[data-entity]').forEach(button=>button.addEventListener('click',()=>this._more(button.dataset.entity)));
    this.shadowRoot.querySelector('#control')?.addEventListener('click',()=>this._control());
    if (focusTarget) {
      const buttons = [...this.shadowRoot.querySelectorAll('button')];
      buttons.find(button => focusTarget.id ? button.id === focusTarget.id : focusTarget.entity ? button.dataset.entity === focusTarget.entity : button.classList.contains('more'))?.focus({preventScroll:true});
    }
  }
}
if (!customElements.get('irrigation-zone-card')) customElements.define('irrigation-zone-card', IrrigationZoneCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(card=>card.type === 'irrigation-zone-card')) window.customCards.push({ type:'irrigation-zone-card', name:'Irrigation Zone', description:'Smart Irrigation: water balance, soil moisture and zone valve.', preview:true, documentationURL:'https://github.com/lweberru/ha_irrigation_zone_card' });
