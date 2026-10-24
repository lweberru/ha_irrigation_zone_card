import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numeric, validateConfig, zoneModel, durationParts, valveAction } from '../src/model.js';
import { resolveZone, watchDiscovery } from '../src/discovery.js';
test('numeric states preserve unknown as missing and zero as zero',()=>{
  for(const value of ['',null,undefined,'unknown','unavailable','NaN','Infinity']) assert.equal(numeric(value),null);
  assert.equal(numeric('0'),0); assert.equal(numeric('-3.52'),-3.52);
});
test('configuration restricts actuators and scales',()=>{
  assert.throws(()=>validateConfig({entity:'switch.zone'}));
  assert.throws(()=>validateConfig({entity:'sensor.zone',valve_entity:'light.zone'}));
  assert.throws(()=>validateConfig({entity:'sensor.zone',bucket_min:0}));
  assert.throws(()=>validateConfig({entity:'sensor.zone',bucket_max:NaN}));
  assert.equal(validateConfig({entity:'sensor.zone'}).confirm_open,true);
});
test('water balance has zero point and signed, bounded positions',()=>{
  const config = {entity:'sensor.zone',bucket_entity:'sensor.bucket'};
  const states = {'sensor.zone':{attributes:{maximum_bucket:24}},'sensor.bucket':{state:'-12'}};
  let m = zoneModel(config,states);
  assert.equal(m.min,-24); assert.equal(m.max,24); assert.equal(m.zero,50); assert.equal(m.position,25);
  states['sensor.bucket'].state = '200'; assert.equal(zoneModel(config,states).position,100);
  states['sensor.bucket'].state = 'unavailable'; assert.equal(zoneModel(config,states).position,null);
  assert.equal(zoneModel({...config,bucket_min:-10,bucket_max:30},states).zero,25);
});
test('need is never inferred from a missing sensor and active actuator wins',()=>{
  const config = {entity:'sensor.zone',irrigation_needed_entity:'binary_sensor.need',valve_entity:'valve.zone'};
  assert.equal(zoneModel(config,{}).status,'unknown');
  assert.equal(zoneModel(config,{'binary_sensor.need':{state:'off'}}).status,'balanced');
  assert.equal(zoneModel(config,{'binary_sensor.need':{state:'on'}}).status,'needed');
  assert.equal(zoneModel(config,{'valve.zone':{state:'closing'}}).status,'watering');
});
test('moisture arc requires percentage unit; raw value stays intact',()=>{
  const config = {entity:'sensor.zone',moisture_entity:'sensor.moisture'};
  assert.equal(zoneModel(config,{'sensor.moisture':{state:'140',attributes:{unit_of_measurement:'%'}}}).moistureFill,100);
  const m = zoneModel(config,{'sensor.moisture':{state:'480',attributes:{unit_of_measurement:'mV'}}});
  assert.equal(m.moistureFill,0); assert.equal(m.moisture,480);
});
test('duration respects entity units and does not claim to be a countdown',()=>{
  const duration = (state,unit)=>durationParts({state,attributes:{unit_of_measurement:unit}});
  assert.deepEqual(duration('780','s'),{value:13,unit:'min',remainder:0,remainderUnit:'s'});
  assert.deepEqual(duration('1.5','h'),{value:1,unit:'h',remainder:30,remainderUnit:'min'});
  assert.equal(duration('unknown','s'),null); assert.deepEqual(duration('12','ticks'),{raw:true,value:12,unit:'ticks'});
});
test('explicit valve/switch actions respect state and valve capabilities',()=>{
  assert.deepEqual(valveAction('valve.zone','closed',1),{domain:'valve',service:'open_valve'});
  assert.deepEqual(valveAction('valve.zone','open',2),{domain:'valve',service:'close_valve'});
  assert.deepEqual(valveAction('switch.zone','on'),{domain:'switch',service:'turn_off'});
  for(const state of ['opening','closing','unknown','unavailable']) assert.equal(valveAction('valve.zone',state),null);
  assert.equal(valveAction('valve.zone','closed',0),null);
});
const discovery = {
  zones:[{id:0,name:'Vorgarten',soil_moisture_sensor:'sensor.moisture',linked_entity:'switch.shared'},{id:2,name:'Westen',linked_entity:'switch.shared'}],
  registry:Object.entries({duration:'sensor.renamed_duration',live_bucket:'sensor.renamed_balance',water_used:'sensor.renamed_usage',irrigation_needed:'binary_sensor.renamed_need',et_value:'sensor.renamed_et',problem:'binary_sensor.renamed_problem'})
    .map(([role,entity_id])=>({entity_id,platform:'smart_irrigation',unique_id:`smart_irrigation_0_${role}`})),
};
test('zone ID zero and string IDs are valid, invalid IDs and entity overrides rejected',()=>{
  assert.equal(validateConfig({zone:0}).zone,0); assert.equal(validateConfig({zone:'0'}).zone,'0');
  for(const zone of [-1,1.1,'Vorgarten',true,null,{},'01',Infinity]) assert.throws(()=>validateConfig({zone}));
  assert.throws(()=>validateConfig({})); assert.throws(()=>validateConfig({zone:0,entity:'switch.bad'}));
});
test('zone discovers renamed entities by unique ID and integration links, detecting shared valves',()=>{
  const config=resolveZone(validateConfig({zone:'0'}),discovery);
  assert.equal(config.entity,'sensor.renamed_duration'); assert.equal(config.bucket_entity,'sensor.renamed_balance');
  assert.equal(config.irrigation_needed_entity,'binary_sensor.renamed_need'); assert.equal(config.water_used_entity,'sensor.renamed_usage');
  assert.equal(config.moisture_entity,'sensor.moisture'); assert.equal(config.valve_entity,'switch.shared');
  assert.equal(config.name,'Vorgarten'); assert.equal(config._sharedValve,2); assert.deepEqual(config._autoMissing,[]);
  assert.equal(config.et_entity,'sensor.renamed_et');assert.equal(config.problem_entity,'binary_sensor.renamed_problem');
});
test('ET and problem overrides validate sensor domains',()=>{
  assert.throws(()=>validateConfig({entity:'sensor.zone',et_entity:'binary_sensor.et'}));
  assert.throws(()=>validateConfig({entity:'sensor.zone',problem_entity:'sensor.problem'}));
  assert.equal(validateConfig({zone:0,et_entity:'sensor.et',problem_entity:'binary_sensor.problem'}).et_entity,'sensor.et');
});
test('problem is independent of watering and unknown never clears it',()=>{
  const config={entity:'sensor.zone',problem_entity:'binary_sensor.problem',valve_entity:'valve.zone',et_entity:'sensor.et'};
  const states={'valve.zone':{state:'open',attributes:{supported_features:3}},'binary_sensor.problem':{state:'on',attributes:{reason:'no_flow'}},'sensor.et':{state:'-1.13'}};
  const model=zoneModel(config,states);assert.equal(model.status,'watering');assert.equal(model.problem,'active');assert.equal(model.problemReason,'no_flow');assert.equal(model.et,-1.13);
  for(const state of ['unknown','unavailable','unexpected'])assert.equal(zoneModel(config,{...states,'binary_sensor.problem':{state}}).problem,'unknown');
  const clear=zoneModel(config,{...states,'binary_sensor.problem':{state:'off',attributes:{reason:'no_flow'}}});assert.equal(clear.problem,'clear');assert.equal(clear.problemReason,null);
  assert.equal(zoneModel(config,{}).problem,'unknown');assert.equal(zoneModel({entity:'sensor.zone'},{}).problem,null);
});
test('missing optional diagnostics remain unknown and manual overrides win',()=>{
  const missing=resolveZone({zone:0},{...discovery,registry:discovery.registry.filter(entry=>!entry.unique_id.endsWith('_problem')&&!entry.unique_id.endsWith('_et_value'))});
  assert.equal(missing._problemExpected,true);assert.equal(missing._etExpected,true);assert.equal(zoneModel(missing,{}).problem,'unknown');assert.equal(zoneModel(missing,{}).et,null);
  const overridden=resolveZone({zone:0,et_entity:'sensor.custom_et',problem_entity:'binary_sensor.custom_problem'},discovery);
  assert.equal(overridden.et_entity,'sensor.custom_et');assert.equal(overridden.problem_entity,'binary_sensor.custom_problem');
});
test('manual overrides win, manual configs stay intact, zone switching never inherits discovery',()=>{
  const config={zone:0,entity:'sensor.custom',valve_entity:'valve.custom',name:'Custom'};
  const result=resolveZone(config,discovery);
  assert.equal(result.entity,'sensor.custom'); assert.equal(result.valve_entity,'valve.custom'); assert.equal(result.name,'Custom');
  const manual={entity:'sensor.custom'}; assert.equal(resolveZone(manual,discovery),manual);
  const second=resolveZone({zone:2},discovery); assert.equal(second.entity,undefined); assert.equal(second.moisture_entity,undefined);
  assert.equal(resolveZone({zone:0},null)._discoveryIssue,'loading');
  assert.equal(resolveZone({zone:99},discovery)._discoveryIssue,'zoneMissing');
  assert.equal(resolveZone({zone:0},{zones:[],error:true})._discoveryIssue,'discoveryFailed');
});
test('disabled, foreign and ambiguous entities are not silently selected',()=>{
  const registry=[...discovery.registry,{...discovery.registry[0],entity_id:'sensor.duplicate'}];
  let result=resolveZone({zone:0},{...discovery,registry}); assert.equal(result.entity,undefined);
  result=resolveZone({zone:0},{...discovery,registry:discovery.registry.map(entry=>({...entry,disabled_by:'user'}))});
  assert.equal(result.bucket_entity,undefined); assert.equal(result._autoMissing.length,4);
  result=resolveZone({zone:0},{...discovery,registry:discovery.registry.map(entry=>({...entry,platform:'other'}))});
  assert.equal(result.entity,undefined);
});
test('shared discovery reader deduplicates requests and unsubscribes when last card leaves',async()=>{
  let reads=0, unsubscribed=0; const callbacks={};
  const connection={
    subscribeEvents:async callback=>{callbacks.registry=callback;return ()=>unsubscribed++;},
    subscribeMessage:async callback=>{callbacks.zones=callback;return ()=>unsubscribed++;},
  };
  const hass={connection,callWS:async message=>{reads++;return message.type === 'smart_irrigation/zones' ? discovery.zones : discovery.registry;}};
  const first=[],second=[];
  const a=watchDiscovery(hass,value=>first.push(value)); const b=watchDiscovery(hass,value=>second.push(value));
  await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(reads,2); assert.equal(first.length,1); assert.equal(second.length,1);
  await callbacks.zones(); assert.equal(reads,4); assert.equal(first.length,2);
  a(); assert.equal(unsubscribed,0); b(); assert.equal(unsubscribed,2);
});
