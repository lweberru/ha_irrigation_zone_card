const labels = {
  de: { entity:'Berechnete Dauer (Smart Irrigation)', name:'Zonenname', icon:'Symbol', irrigation_needed_entity:'Bewässerung nötig', bucket_entity:'Wasserbilanz (live)', water_used_entity:'Wasserverbrauch', moisture_entity:'Bodenfeuchte', valve_entity:'Ventil (optional)', bucket_min:'Wasserbilanz: Skalenminimum (< 0)', bucket_max:'Wasserbilanz: Skalenmaximum (> 0)', show_control:'Manuelle Ventilsteuerung anzeigen', confirm_open:'Vor manuellem Öffnen bestätigen', language:'Sprache' },
  en: { entity:'Calculated duration (Smart Irrigation)', name:'Zone name', icon:'Icon', irrigation_needed_entity:'Irrigation needed', bucket_entity:'Water balance (live)', water_used_entity:'Water used', moisture_entity:'Soil moisture', valve_entity:'Valve (optional)', bucket_min:'Water balance: scale minimum (< 0)', bucket_max:'Water balance: scale maximum (> 0)', show_control:'Show manual valve control', confirm_open:'Confirm before opening manually', language:'Language' },
};
class IrrigationZoneEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({mode:'open'}); }
  setConfig(config) { this._config = {...config}; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this.shadowRoot.innerHTML = '<ha-form></ha-form>';
      this._form = this.shadowRoot.firstElementChild;
      this._form.addEventListener('value-changed',event=>{
        event.stopPropagation();
        const config = {...this._config,...event.detail.value};
        for (const key of Object.keys(config)) if (config[key] === '' || config[key] === null || config[key] === undefined) delete config[key];
        this._config = config;
        this.dispatchEvent(new CustomEvent('config-changed',{detail:{config},bubbles:true,composed:true}));
      });
      this._form.schema = [
        {name:'entity',required:true,selector:{entity:{domain:'sensor'}}},
        {name:'name',selector:{text:{}}}, {name:'icon',selector:{icon:{}}},
        ...['irrigation_needed_entity','bucket_entity','water_used_entity','moisture_entity','valve_entity'].map(name=>({name,selector:{entity:{domain:name === 'valve_entity' ? ['switch','valve'] : name === 'irrigation_needed_entity' ? 'binary_sensor' : 'sensor'}}})),
        {name:'bucket_min',selector:{number:{mode:'box',min:-10000,max:-0.01,step:'any'}}},
        {name:'bucket_max',selector:{number:{mode:'box',min:0.01,max:10000,step:'any'}}},
        {name:'show_control',selector:{boolean:{}}}, {name:'confirm_open',selector:{boolean:{}}},
        {name:'language',selector:{select:{options:[{value:'auto',label:'Auto'},{value:'de',label:'Deutsch'},{value:'en',label:'English'}]}}},
      ];
    }
    const lang = this._config.language && this._config.language !== 'auto' ? this._config.language : this._hass.language;
    this._form.hass = this._hass;
    this._form.data = {show_control:true,confirm_open:true,language:'auto',...this._config};
    this._form.computeLabel = schema => labels[lang?.startsWith('de') ? 'de' : 'en'][schema.name] || schema.name;
  }
}
if (!customElements.get('irrigation-zone-card-editor')) customElements.define('irrigation-zone-card-editor',IrrigationZoneEditor);
