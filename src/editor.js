import { entityKeys } from './model.js';
import { hasZone, watchDiscovery } from './discovery.js';

const labels = {
  de: { entity:'Berechnete Dauer (Smart Irrigation)', name:'Zonenname', icon:'Symbol', irrigation_needed_entity:'Bewässerung nötig', bucket_entity:'Wasserbilanz (live)', water_used_entity:'Wasserverbrauch', moisture_entity:'Bodenfeuchte', valve_entity:'Ventil (optional)', bucket_min:'Wasserbilanz: Skalenminimum (< 0)', bucket_max:'Wasserbilanz: Skalenmaximum (> 0)', show_control:'Manuelle Ventilsteuerung anzeigen', confirm_open:'Vor manuellem Öffnen bestätigen', language:'Sprache' },
  en: { entity:'Calculated duration (Smart Irrigation)', name:'Zone name', icon:'Icon', irrigation_needed_entity:'Irrigation needed', bucket_entity:'Water balance (live)', water_used_entity:'Water used', moisture_entity:'Soil moisture', valve_entity:'Valve (optional)', bucket_min:'Water balance: scale minimum (< 0)', bucket_max:'Water balance: scale maximum (> 0)', show_control:'Show manual valve control', confirm_open:'Confirm before opening manually', language:'Language' },
};
Object.assign(labels.de, { show_rules:'Bewässerungsregeln anzeigen', zone:'Smart-Irrigation-Zone', overrides:'Sensoren überschreiben (optional)', et_entity:'Angewandte ET', problem_entity:'Zonenproblem' });
Object.assign(labels.en, { show_rules:'Show irrigation rules', zone:'Smart Irrigation zone', overrides:'Override sensors (optional)', et_entity:'Applied ET', problem_entity:'Zone problem' });
class IrrigationZoneEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({mode:'open'}); }
  setConfig(config) { this._config = {...config}; this._render(); }
  connectedCallback() { this._watch(); this._render(); }
  disconnectedCallback() { this._unwatch?.(); this._unwatch = null; this._connection = null; }
  set hass(hass) { this._hass = hass; this._watch(); this._render(); }
  _watch() {
    if (!this.isConnected || !this._hass?.callWS) return;
    const connection = this._hass.connection || this._hass;
    if (this._connection === connection) return;
    this._unwatch?.(); this._discovery = null; this._connection = connection;
    this._unwatch = watchDiscovery(this._hass, snapshot=>{ this._discovery = snapshot; this._render(); });
  }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this.shadowRoot.innerHTML = '<style>.notice{font-size:12px;color:var(--secondary-text-color);margin:12px 0}summary{cursor:pointer;padding:16px 0}</style><ha-form id="main"></ha-form><div class="notice" role="status"></div><details><summary></summary><ha-form id="overrides"></ha-form></details>';
      this._form = this.shadowRoot.querySelector('#main');
      this._overrides = this.shadowRoot.querySelector('#overrides');
      const onChange = event=>{
        event.stopPropagation();
        const config = {...this._config,...event.detail.value};
        if (String(config.zone ?? '') !== String(this._config.zone ?? '')) {
          for (const key of entityKeys) delete config[key];
          delete config.name;
        }
        for (const key of Object.keys(config)) if (config[key] === '' || config[key] === null || config[key] === undefined) delete config[key];
        this._config = config;
        this._render();
        this.dispatchEvent(new CustomEvent('config-changed',{detail:{config},bubbles:true,composed:true}));
      };
      this._form.addEventListener('value-changed',onChange);
      this._overrides.addEventListener('value-changed',onChange);
    }
    const lang = this._config.language && this._config.language !== 'auto' ? this._config.language : this._hass.language;
    const de = lang?.startsWith('de');
    const label = schema => labels[de ? 'de' : 'en'][schema.name] || schema.name;
    const zones = this._discovery?.zones || [];
    const options = [{value:'',label:de ? 'Manuell konfigurieren' : 'Configure manually'}, ...zones.map(zone=>({value:String(zone.id),label:`${zone.name} (${zone.id})`}))];
    if (hasZone(this._config) && !zones.some(zone=>String(zone.id) === String(this._config.zone))) options.push({value:String(this._config.zone),label:`Zone ${this._config.zone}`});
    this._form.schema = [
        {name:'zone',selector:{select:{options}}},
        {name:'name',selector:{text:{}}}, {name:'icon',selector:{icon:{}}},
        {name:'show_rules',selector:{boolean:{}}}, {name:'show_control',selector:{boolean:{}}}, {name:'confirm_open',selector:{boolean:{}}},
        {name:'language',selector:{select:{options:[{value:'auto',label:'Auto'},{value:'de',label:'Deutsch'},{value:'en',label:'English'}]}}},
    ];
    this._overrides.schema = [
        ...entityKeys.map(name=>({name,required:name === 'entity' && !hasZone(this._config),selector:{entity:{domain:name === 'valve_entity' ? ['switch','valve'] : ['irrigation_needed_entity','problem_entity'].includes(name) ? 'binary_sensor' : 'sensor'}}})),
        {name:'bucket_min',selector:{number:{mode:'box',min:-10000,max:-0.01,step:'any'}}},
        {name:'bucket_max',selector:{number:{mode:'box',min:0.01,max:10000,step:'any'}}},
      ];
    for (const form of [this._form,this._overrides]) {
      form.hass = this._hass;
      form.data = {show_rules:true,show_control:true,confirm_open:true,language:'auto',...this._config,zone:hasZone(this._config) ? String(this._config.zone) : ''};
      form.computeLabel = label;
    }
    this.shadowRoot.querySelector('summary').textContent = label({name:'overrides'});
    if (!hasZone(this._config)) this.shadowRoot.querySelector('details').open = true;
    this.shadowRoot.querySelector('.notice').textContent = this._discovery?.error
      ? (de ? 'Automatische Zuordnung nicht verfügbar. Entitäten können manuell eingetragen werden.' : 'Automatic discovery unavailable. You can configure entities manually.')
      : (de ? 'Die Zone ordnet Sensoren, Bodenfeuchte und verknüpftes Ventil automatisch zu. Ein Zonenwechsel setzt manuelle Sensorzuordnungen und den Namen zurück.' : 'The zone automatically assigns sensors, soil moisture and the linked valve. Changing zones clears sensor overrides and the name.');
  }
}
if (!customElements.get('irrigation-zone-card-editor')) customElements.define('irrigation-zone-card-editor',IrrigationZoneEditor);
