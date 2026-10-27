import { overviewEntityKeys } from './overview-model.js';
import { languageOptions, resolveLanguage, translate } from './i18n/index.js';
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
        {name:'language',selector:{select:{options:languageOptions}}},
      ];
      this._form.addEventListener('value-changed',event=>{
        event.stopPropagation(); const config={...this._config,...event.detail.value};
        for (const key of Object.keys(config)) if (config[key] === '' || config[key] === null || config[key] === undefined) delete config[key];
        this._config=config;
        this.dispatchEvent(new CustomEvent('config-changed',{detail:{config},bubbles:true,composed:true}));
      });
    }
    const t=translate(resolveLanguage(this._config.language,this._hass),'overviewEditor');
    this._form.hass=this._hass;
    this._form.data={show_actions:true,language:'auto',...this._config};
    this._form.computeLabel=field=>t[field.name] || field.name;
  }
}
if (!customElements.get('irrigation-overview-card-editor')) customElements.define('irrigation-overview-card-editor',IrrigationOverviewEditor);
