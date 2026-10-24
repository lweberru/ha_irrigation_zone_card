import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numeric, validateConfig, zoneModel, durationParts, valveAction } from '../src/model.js';
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
