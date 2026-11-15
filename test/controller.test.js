import {test} from 'node:test';
import assert from 'node:assert/strict';
import {controllerAction,controllerModel} from '../src/controller.js';
import {irrigateAction,irrigateIssue} from '../src/irrigate.js';
import {overviewAction,overviewModel,resolveOverview,validateOverviewConfig} from '../src/overview-model.js';
import {resolveZone} from '../src/discovery.js';
import {watchOverview} from '../src/overview-data.js';

const runtime=(live={},enabled=true)=>({config:{full_controller:true,irrigation_enabled:enabled,direct_valve_control_enabled:true},info:{next_irrigation_duration:0},controller:{live:{paused:false,cycle:false,programs:[],valves:[],...live}}});
test('master switch is discovered by stable ID, domain validated and independent of physical valves',()=>{
  const entry={platform:'smart_irrigation',unique_id:'smart_irrigation_irrigation_enabled',entity_id:'switch.renamed_master'};
  assert.equal(resolveOverview({}, {registry:[entry]}).irrigation_enabled_entity,entry.entity_id);
  assert.throws(()=>validateOverviewConfig({irrigation_enabled_entity:'valve.wrong'}));
  assert.throws(()=>validateOverviewConfig({pause_minutes:0}));
  assert.throws(()=>validateOverviewConfig({pause_minutes:1441}));
  assert.deepEqual(overviewAction({irrigation_enabled_entity:entry.entity_id},{[entry.entity_id]:{state:'off'}},'irrigation_enabled_entity'),{domain:'switch',service:'turn_on',entity:entry.entity_id});
  assert.equal(overviewAction({show_master_control:false,irrigation_enabled_entity:entry.entity_id},{[entry.entity_id]:{state:'on'}},'irrigation_enabled_entity'),null);
  assert.equal(overviewAction({calculate_entity:'button.calc'},{'button.calc':{state:'unknown'}},'calculate_entity',runtime({},false)),null);
  assert.notEqual(overviewAction({update_weather_entity:'button.weather'},{'button.weather':{state:'unknown'}},'update_weather_entity',runtime({},false)),null);
});
test('master off blocks native watering even though direct control is enabled',()=>{
  const config={show_irrigate:true,irrigate_entity:'button.run'};
  assert.equal(irrigateIssue(config,{'button.run':{state:'unknown'}},runtime({},false)),'masterOff');
  assert.equal(irrigateAction(config,{'button.run':{state:'unknown'}},runtime({},false)),null);
  assert.equal(overviewModel({}, {},runtime({},false),{zones:[]}).status,'paused');
});
test('runtime actions use native services, pause minutes and availability without raw hardware calls',()=>{
  const active=runtime({cycle:true});
  assert.deepEqual(controllerAction({pause_minutes:15},active,'controller_pause'),{domain:'smart_irrigation',service:'pause_watering',data:{minutes:15}});
  assert.equal(controllerAction({},active,'controller_resume'),null);
  const paused=runtime({paused:true});
  assert.deepEqual(controllerAction({},paused,'controller_resume'),{domain:'smart_irrigation',service:'resume_watering',data:{}});
  assert.deepEqual(controllerAction({},paused,'controller_stop'),{domain:'smart_irrigation',service:'stop_watering',data:{}});
  assert.equal(controllerAction({},runtime({paused:true},false),'controller_resume'),null);
  for(const config of [{show_actions:false},{show_controller:false}])assert.equal(controllerAction(config,active,'controller_pause'),null);
  assert.equal(controllerAction({},runtime(),'controller_stop'),null);
  assert.equal(controllerAction({}, {...active,controllerError:true},'controller_stop'),null);
});
test('paused and queued native programs determine overview status rather than stored durations',()=>{
  assert.equal(controllerModel(runtime()).state,'idle');
  assert.equal(controllerModel(runtime({paused:true})).state,'paused');
  assert.equal(overviewModel({}, {},runtime({programs:[{state:'waiting'}]}),{zones:[]}).status,'running');
  assert.equal(overviewModel({}, {},runtime({paused:true,cycle:true}),{zones:[]}).status,'paused');
});
test('automatic zone control prefers its native valve while explicit raw overrides remain supported',()=>{
  const discovery={zones:[{id:3,name:'Zone',linked_entity:'valve.hardware'}],registry:[{platform:'smart_irrigation',unique_id:'smart_irrigation_3_valve',entity_id:'valve.renamed_native'}]};
  const native=resolveZone({zone:3},discovery);
  assert.equal(native.valve_entity,'valve.renamed_native');assert.equal(native._nativeValve,true);
  const raw=resolveZone({zone:3,valve_entity:'valve.hardware'},discovery);
  assert.equal(raw.valve_entity,'valve.hardware');assert.equal(raw._nativeValve,false);
  assert.equal(resolveZone({zone:3},{...discovery,registry:[]}).valve_entity,'valve.hardware');
});
test('runtime reader calls programs_state only for a full controller and isolates runtime failures',async()=>{
  for(const full of [false,true]){
    const calls=[];
    const hass={callWS:async({type})=>{calls.push(type);if(type.endsWith('/config'))return {full_controller:full};if(type.endsWith('/programs_state'))throw Error('offline');return {next_irrigation_duration:0};}};
    let resolve;const ready=new Promise(r=>resolve=r);
    const reader=watchOverview(hass,resolve);const snapshot=await ready;reader.unsubscribe();
    assert.equal(calls.includes('smart_irrigation/programs_state'),full);
    assert.equal(snapshot.error,false);assert.equal(snapshot.controllerError,full);
  }
});
