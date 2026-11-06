import { overviewEntityKeys } from './overview-model.js';
const labels = {
  de:{automation_name:'Bezeichnung der optionalen Automation',show_native_control:'Native Ventilsteuerung anzeigen',confirm_native:'Vor Aktivierung der nativen Steuerung bestätigen',show_control:'Hauptventil direkt steuern',show_irrigate:'Alle Zonen bewässern anzeigen (Smart Irrigation)',confirm_irrigate:'Vor Bewässerungslauf bestätigen',irrigate_entity:'Alle Zonen bewässern (nativer Button, optional)',name:'Titel',icon:'Symbol',language:'Sprache',show_actions:'Zentrale Aktionen anzeigen',automation_entity:'Eigene Bewässerungsautomation (optional)',confirm_open:'Vor manuellem Öffnen bestätigen',main_valve_entity:'Hauptventil (optional, direkt schaltbar)',calculate_entity:'Alle berechnen (automatisch erkannt)',update_weather_entity:'Wetter aktualisieren (automatisch erkannt)',precipitation_switch_entity:'Regenprognose-Sperre (automatisch erkannt)',precipitation_threshold_entity:'Regenschwelle (automatisch erkannt)'},
  en:{automation_name:'Optional automation label',show_native_control:'Show native valve control',confirm_native:'Confirm enabling native control',show_control:'Control main valve directly',show_irrigate:'Show water all zones (Smart Irrigation)',confirm_irrigate:'Confirm before starting watering',irrigate_entity:'Water all zones (native button, optional)',name:'Title',icon:'Icon',language:'Language',show_actions:'Show central actions',automation_entity:'External irrigation automation (optional)',confirm_open:'Confirm before opening manually',main_valve_entity:'Main valve (optional, direct control)',calculate_entity:'Calculate all (auto-discovered)',update_weather_entity:'Update weather (auto-discovered)',precipitation_switch_entity:'Forecast rain protection (auto-discovered)',precipitation_threshold_entity:'Rain threshold (auto-discovered)'},
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
        {name:'name',selector:{text:{}}},{name:'automation_name',selector:{text:{}}},{name:'icon',selector:{icon:{}}},
        ...overviewEntityKeys.map(name=>({name,selector:{entity:{domain:name === 'automation_entity' ? 'automation' : name === 'main_valve_entity' ? ['switch','valve'] : name.endsWith('switch_entity') ? 'switch' : name.endsWith('threshold_entity') ? 'number' : 'button'}}})),
        {name:'show_native_control',selector:{boolean:{}}},{name:'confirm_native',selector:{boolean:{}}},{name:'show_control',selector:{boolean:{}}},{name:'show_irrigate',selector:{boolean:{}}},{name:'confirm_irrigate',selector:{boolean:{}}},{name:'show_actions',selector:{boolean:{}}},{name:'confirm_open',selector:{boolean:{}}},
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
    this._form.data={show_native_control:true,confirm_native:true,show_control:true,show_irrigate:false,confirm_irrigate:true,show_actions:true,confirm_open:true,language:'auto',...this._config};
    this._form.computeLabel=field=>labels[lang?.startsWith('de') ? 'de' : 'en'][field.name] || field.name;
  }
}
if (!customElements.get('irrigation-overview-card-editor')) customElements.define('irrigation-overview-card-editor',IrrigationOverviewEditor);
