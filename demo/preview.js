import '../dist/ha_irrigation_zone_card.js';
// Local stand-ins for the HA elements. The shipped card uses HA's own icons and form.
const paths = {
  'mdi:sprout':'M12 21v-9M12 15C4 16 2 10 3 5c6 0 9 3 9 8M12 12c0-6 4-9 9-9 1 7-3 11-9 9',
  'mdi:sprinkler-variant':'M8 20h8M12 20v-5M7 15h10M5 11l-2-2M8 7 7 4M12 6V2M16 7l1-3M19 11l2-2',
  'mdi:timer-outline':'M9 2h6M12 7a7 7 0 1 0 0 14 7 7 0 0 0 0-14M12 10v4l3 2M18 6l2-2',
  'mdi:water-outline':'M12 3s-7 8-7 12a7 7 0 0 0 14 0c0-4-7-12-7-12Z',
  'mdi:dots-horizontal':'M5 12h.01M12 12h.01M19 12h.01',
  'mdi:pipe-valve':'M2 10h5v7H2M17 10h5v7h-5M7 9h10v9H7ZM12 9V4M8 4h8',
  'mdi:valve-closed':'M2 10h5v7H2M17 10h5v7h-5M7 9h10v9H7ZM12 9V4M8 4h8',
};
class DemoIcon extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    this.attachShadow({mode:'open'}).innerHTML = `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}svg{width:100%;height:100%}</style><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[this.getAttribute('icon')] || paths['mdi:sprout']}"/></svg>`;
  }
}
customElements.define('ha-icon',DemoIcon);
const config = {
  type:'custom:irrigation-zone-card', name:'Vorgarten', entity:'sensor.smart_irrigation_vorgarten',
  irrigation_needed_entity:'binary_sensor.smart_irrigation_vorgarten_irrigation_needed',
  bucket_entity:'sensor.smart_irrigation_vorgarten_live_bucket', water_used_entity:'sensor.smart_irrigation_vorgarten_water_used',
  moisture_entity:'sensor.vorgarten_pflanzen_vorgarten_bodenfeuchtigkeit', valve_entity:'valve.vorgarten',
};
export const fixture = (overrides = {}) => ({
  'sensor.smart_irrigation_vorgarten':{state:'0',attributes:{unit_of_measurement:'s',device_class:'duration',maximum_bucket:24,friendly_name:'Vorgarten Dauer'}},
  'binary_sensor.smart_irrigation_vorgarten_irrigation_needed':{state:'off',attributes:{}},
  'sensor.smart_irrigation_vorgarten_live_bucket':{state:'3.52',attributes:{unit_of_measurement:'mm'}},
  'sensor.smart_irrigation_vorgarten_water_used':{state:'0.0',attributes:{unit_of_measurement:'L'}},
  'sensor.vorgarten_pflanzen_vorgarten_bodenfeuchtigkeit':{state:'100',attributes:{unit_of_measurement:'%'}},
  'valve.vorgarten':{state:'closed',attributes:{supported_features:3}}, ...overrides,
});
window.demoCalls = [];
window.demoConfig = config;
window.demoHass = (states = fixture()) => ({
  language:'de',locale:{language:'de'},themes:{darkMode:document.body.classList.contains('dark')},states,
  formatEntityState:entity=>`${new Intl.NumberFormat('de',{maximumFractionDigits:1}).format(Number(entity.state))} ${entity.attributes.unit_of_measurement || ''}`.trim(),
  callService:async(domain,service,data)=>{
    window.demoCalls.push({domain,service,data});
    const state = service === 'open_valve' || service === 'turn_on' ? domain === 'switch' ? 'on' : 'open' : domain === 'switch' ? 'off' : 'closed';
    const updated = {...states,[data.entity_id]:{...states[data.entity_id],state}};
    document.querySelectorAll('irrigation-zone-card').forEach(card=>{if(card._hass.states === states) card.hass = window.demoHass(updated);});
  },
});
const cases = [
  {name:'Vorgarten', caption:'01 / Wasservorrat · kein Bedarf', states:fixture()},
  {name:'Rasenfläche',caption:'02 / Wasserdefizit · Bewässerung nötig', states:fixture({
    [config.entity]:{state:'780',attributes:{unit_of_measurement:'s',maximum_bucket:24}},
    [config.irrigation_needed_entity]:{state:'on',attributes:{}},
    [config.bucket_entity]:{state:'-8.4',attributes:{unit_of_measurement:'mm'}},
    [config.moisture_entity]:{state:'28',attributes:{unit_of_measurement:'%'}},
    [config.water_used_entity]:{state:'142.6',attributes:{unit_of_measurement:'L'}},
  })},
  {name:'Hochbeet',caption:'03 / Ventil aktiv · manuelle Steuerung',states:fixture({
    [config.entity]:{state:'360',attributes:{unit_of_measurement:'s',maximum_bucket:24}},
    [config.bucket_entity]:{state:'-2.1',attributes:{unit_of_measurement:'mm'}},
    [config.moisture_entity]:{state:'64',attributes:{unit_of_measurement:'%'}},
    [config.water_used_entity]:{state:'36.2',attributes:{unit_of_measurement:'L'}},
    [config.valve_entity]:{state:'open',attributes:{supported_features:3}},
  })},
];
for (const scenario of cases) {
  const wrapper = document.createElement('div');
  const card = document.createElement('irrigation-zone-card');
  card.setConfig({...config,name:scenario.name}); card.hass = window.demoHass(scenario.states);
  wrapper.append(card);
  const caption = document.createElement('div'); caption.className = 'caption'; caption.textContent = scenario.caption;
  wrapper.append(caption); document.querySelector('#cards').append(wrapper);
}
document.querySelector('#theme').onclick = ()=>{
  document.body.classList.toggle('dark');
  document.querySelectorAll('irrigation-zone-card').forEach(card=>{card.hass=window.demoHass(card._hass.states);});
};
