import '../dist/ha_irrigation_zone_card.js';
import './icons.js';
const config = {
  type:'custom:irrigation-zone-card', name:'Vorgarten', entity:'sensor.smart_irrigation_vorgarten',
  irrigation_needed_entity:'binary_sensor.smart_irrigation_vorgarten_irrigation_needed',
  bucket_entity:'sensor.smart_irrigation_vorgarten_live_bucket', water_used_entity:'sensor.smart_irrigation_vorgarten_water_used',
  moisture_entity:'sensor.vorgarten_pflanzen_vorgarten_bodenfeuchtigkeit', valve_entity:'valve.vorgarten',
  et_entity:'sensor.smart_irrigation_vorgarten_et_value', problem_entity:'binary_sensor.smart_irrigation_vorgarten_problem',
};
export const fixture = (overrides = {}) => ({
  'sensor.smart_irrigation_vorgarten':{state:'0',attributes:{unit_of_measurement:'s',device_class:'duration',maximum_bucket:24,friendly_name:'Vorgarten Dauer'}},
  'binary_sensor.smart_irrigation_vorgarten_irrigation_needed':{state:'off',attributes:{}},
  'sensor.smart_irrigation_vorgarten_live_bucket':{state:'3.52',attributes:{unit_of_measurement:'mm'}},
  'sensor.smart_irrigation_vorgarten_water_used':{state:'0.0',attributes:{unit_of_measurement:'L'}},
  'sensor.vorgarten_pflanzen_vorgarten_bodenfeuchtigkeit':{state:'100',attributes:{unit_of_measurement:'%'}},
  'valve.vorgarten':{state:'closed',attributes:{supported_features:3}},
  'sensor.smart_irrigation_vorgarten_et_value':{state:'-1.13',attributes:{unit_of_measurement:'mm'}},
  'binary_sensor.smart_irrigation_vorgarten_problem':{state:'off',attributes:{reason:null}}, ...overrides,
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
  {name:'Hochbeet',caption:'03 / Ventil aktiv · Problem gemeldet',states:fixture({
    [config.entity]:{state:'360',attributes:{unit_of_measurement:'s',maximum_bucket:24}},
    [config.bucket_entity]:{state:'-2.1',attributes:{unit_of_measurement:'mm'}},
    [config.moisture_entity]:{state:'64',attributes:{unit_of_measurement:'%'}},
    [config.water_used_entity]:{state:'36.2',attributes:{unit_of_measurement:'L'}},
    [config.valve_entity]:{state:'open',attributes:{supported_features:3}},
    [config.problem_entity]:{state:'on',attributes:{reason:'no_flow'}},
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
