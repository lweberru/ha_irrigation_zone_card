import { overviewEntityKeys } from './overview-model.js';
const labels = {
  de:{name:'Titel',icon:'Symbol',language:'Sprache',show_actions:'Zentrale Aktionen anzeigen',automation_entity:'Eigene Bewässerungsautomation (optional)',main_valve_entity:'Hauptventil (optional, Status und Details)',calculate_entity:'Alle berechnen (automatisch erkannt)',update_weather_entity:'Wetter aktualisieren (automatisch erkannt)',precipitation_switch_entity:'Regenprognose-Sperre (automatisch erkannt)',precipitation_threshold_entity:'Regenschwelle (automatisch erkannt)'},
  en:{name:'Title',icon:'Icon',language:'Language',show_actions:'Show central actions',automation_entity:'External irrigation automation (optional)',main_valve_entity:'Main valve (optional, status and details)',calculate_entity:'Calculate all (auto-discovered)',update_weather_entity:'Update weather (auto-discovered)',precipitation_switch_entity:'Forecast rain protection (auto-discovered)',precipitation_threshold_entity:'Rain threshold (auto-discovered)'},
};
class IrrigationOverviewEditor extends HTMLElement {
  constructor() { super(); this.attachShadow({mode:'open'}); }
  setConfig(config) { this._config={...config}; this._render(); }
  set hass(hass) { this._hass=hass; this._render(); }
  _render() {
    if (!this._config || !this._hass) return;
    if (!this._form) {
      this.shadowRoot.innerHTML='<ha-form></ha-form>';
      this._form=this.shadowRoot.firstElementChild;
      this._form.schema=[
        {name:'name',selector:{text:{}}},{name:'icon',selector:{icon:{}}},
        ...overviewEntityKeys.map(name=>({name,selector:{entity:{domain:name === 'automation_entity' ? 'automation' : name === 'main_valve_entity' ? ['switch','valve'] : name.endsWith('switch_entity') ? 'switch' : name.endsWith('threshold_entity') ? 'number' : 'button'}}})),
        {name:'show_actions',selector:{boolean:{}}},
        {name:'language',selector:{select:{options:[{value:'auto',label:'Auto'},{value:'de',label:'Deutsch'},{value:'en',label:'English'}]}}},
      ];
      this._form.addEventListener('value-changed',event=>{
        event.stopPropagation(); const config={...this._config,...event.detail.value};
        for (const key of Object.keys(config)) if (config[key] === '' || config[key] === null || config[key] === undefined) delete config[key];
        this._config=config;
        this.dispatchEvent(new CustomEvent('config-changed',{detail:{config},bubbles:true,composed:true}));
      });
    }
    const lang=this._config.language && this._config.language !== 'auto' ? this._config.language : this._hass.language;
    this._form.hass=this._hass;
    this._form.data={show_actions:true,language:'auto',...this._config};
    this._form.computeLabel=field=>labels[lang?.startsWith('de') ? 'de' : 'en'][field.name] || field.name;
  }
}
if (!customElements.get('irrigation-overview-card-editor')) customElements.define('irrigation-overview-card-editor',IrrigationOverviewEditor);
