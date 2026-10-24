import '../dist/ha_irrigation_zone_card.js';
import './icons.js';
export const systemFixture=()=>({
  info:{next_irrigation_start:'2026-10-25T05:56:00+00:00',next_irrigation_duration:780,next_irrigation_zones:['Vorgarten'],start_trigger_armed:true,durations_estimated:true,active_start_trigger:'default',stale_zones:[],skip_preview:{should_skip:false,checks:[
    {id:'freeze',enabled:true,available:true,skip:false,value:11.7,threshold:2,unit:'°C'},
    {id:'rain_sensor',enabled:true,available:true,skip:false,raining:false},
    {id:'precipitation',enabled:true,available:true,skip:false,forecast_mm:0.8,threshold_mm:2,window_hours:48},
    {id:'days_between',enabled:true,available:true,skip:false,days_since:3,days_required:1},
  ]}},
  config:{weather_service:'Open-Meteo',use_weather_service:true,autocalcenabled:true,calctime:'23:00',direct_valve_control_enabled:false,active_valve_runs:[]},
  zones:[{id:0},{id:1},{id:2}],
  registry:[['calculate_all','button.calculate_all'],['update_weather','button.update_weather'],['skip_irrigation_on_precipitation','switch.rain_protection'],['precipitation_threshold','number.rain_threshold']].map(([role,entity_id])=>({entity_id,platform:'smart_irrigation',unique_id:`smart_irrigation_${role}`})),
});
window.overviewCalls=[];window.overviewReads=[];window.overviewData=[];window.overviewEvents=[];
window.overviewConfig={type:'custom:irrigation-overview-card',automation_entity:'automation.irrigation',main_valve_entity:'switch.main_valve'};
window.overviewHass=(index,states)=>({
  language:'de',locale:{language:'de'},themes:{darkMode:document.body.classList.contains('dark')},config:{time_zone:'Europe/Berlin'},
  states:states||{'button.calculate_all':{state:'unknown',attributes:{}},'button.update_weather':{state:'unknown',attributes:{}},'switch.rain_protection':{state:'on',attributes:{}},'number.rain_threshold':{state:'2',attributes:{unit_of_measurement:'mm'}},'automation.irrigation':{state:'on',attributes:{}},'switch.main_valve':{state:'off',attributes:{}}},
  connection:window.overviewConnections[index],
  callWS:async message=>{window.overviewReads.push(message.type);return window.overviewData[index][message.type==='config/entity_registry/list'?'registry':message.type.split('/')[1]]||[];},
  formatEntityState:state=>`${new Intl.NumberFormat('de',{maximumFractionDigits:1}).format(Number(state.state))} ${state.attributes.unit_of_measurement||''}`.trim(),
  callService:async(domain,service,data)=>{
    window.overviewCalls.push({domain,service,data});
    const card=document.querySelectorAll('irrigation-overview-card')[index];
    if(domain==='switch'||domain==='automation')card.hass=window.overviewHass(index,{...card._hass.states,[data.entity_id]:{state:service==='turn_on'?'on':'off',attributes:{}}});
  },
});
window.overviewConnections=[];
const scenarios=[
  {caption:'01 / Bedarf & Planung',data:systemFixture()},
  {caption:'02 / Regenprognose sperrt',data:systemFixture()},
  {caption:'03 / Frostsperre aktiv',data:systemFixture()},
];
scenarios[1].data.info.skip_preview.should_skip=true;
Object.assign(scenarios[1].data.info.skip_preview.checks[2],{skip:true,forecast_mm:4.5});
scenarios[2].data.info.skip_preview.should_skip=true;
Object.assign(scenarios[2].data.info.skip_preview.checks[0],{skip:true,value:-1.5});
for(const [index,scenario] of scenarios.entries()){
  window.overviewData.push(scenario.data);window.overviewEvents.push([]);
  window.overviewConnections.push({subscribeMessage:async callback=>{window.overviewEvents[index].push(callback);return()=>{};},subscribeEvents:async()=>()=>{}});
  const wrapper=document.createElement('div');const card=document.createElement('irrigation-overview-card');
  card.setConfig(window.overviewConfig);card.hass=window.overviewHass(index);wrapper.append(card);
  const caption=document.createElement('div');caption.className='caption';caption.textContent=scenario.caption;wrapper.append(caption);document.querySelector('#cards').append(wrapper);
}
document.querySelector('#theme').onclick=()=>{document.body.classList.toggle('dark');document.querySelectorAll('irrigation-overview-card').forEach((card,index)=>{card.hass=window.overviewHass(index,card._hass.states);});};
