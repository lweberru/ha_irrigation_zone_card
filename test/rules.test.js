import {test} from 'node:test';
import assert from 'node:assert/strict';
import {zoneRules} from '../src/rules.js';
import {validateConfig} from '../src/model.js';
const discovery={zones:[{id:2,irrigation_threshold:10,days_between_irrigation:3,soil_moisture_sensor:'sensor.roses',soil_moisture_threshold:50,maximum_duration:3600}]};
const system={config:{stored_units:'metric',days_between_irrigation:1},info:{skip_preview:{checks:[]}}};
test('rules use exact zone IDs and retain zero settings instead of inheriting',()=>{
  const rules=zoneRules({zone:'2'},discovery,system);
  assert.equal(rules.threshold,10);assert.equal(rules.days,3);assert.equal(rules.inherited,false);assert.equal(rules.moisture,50);assert.equal(rules.maxSeconds,3600);assert.equal(rules.unit,'mm');
  const zero={zones:[{id:2,irrigation_threshold:0,days_between_irrigation:0,maximum_duration:0}]};
  const actual=zoneRules({zone:2},zero,system);
  assert.equal(actual.days,0);assert.equal(actual.threshold,0);assert.equal(actual.maxSeconds,0);assert.equal(actual.hasMoisture,false);
  assert.equal(zoneRules({zone:0},discovery,system),null);assert.equal(zoneRules({entity:'sensor.zone'},discovery,system),null);
  assert.equal(zoneRules({zone:2,show_rules:false},discovery,system),null);
  assert.throws(()=>validateConfig({zone:2,show_rules:'false'}));
});
test('missing global rules remain unknown, and stored units take priority',()=>{
  const inherited={zones:[{id:2,days_between_irrigation:null}]};
  assert.equal(zoneRules({zone:2},inherited,system).days,1);
  const missing=zoneRules({zone:2},inherited,null);
  assert.equal(missing.days,null);assert.equal(missing.unit,null);assert.equal(missing.checksKnown,false);assert.deepEqual(missing.held,[]);
  assert.equal(zoneRules({zone:2},discovery,{config:{stored_units:'imperial',units:'metric'}}).unit,'in');
});
test('holds come only from available backend checks for this zone',()=>{
  const checks=[{id:'days_between',enabled:true,available:true,zones_held:[1,2]},{id:'soil_moisture',enabled:true,available:true,zones:[{zone_id:'2',held:true}]},{id:'freeze',enabled:true,available:true,skip:true}];
  const read=()=>zoneRules({zone:2},discovery,{...system,info:{skip_preview:{checks}}});
  assert.deepEqual(read().held,['intervalHeld','moistureHeld','globalHeld']);
  checks[0].zones_held=[{zone_id:1}];checks[1].zones=[{zone_id:1,held:true}];checks[2].available=false;
  assert.deepEqual(read().held,[]);
  checks[0].zones_held=[{zone_id:2}];assert.deepEqual(read().held,['intervalHeld']);
  checks[0].enabled=false;assert.deepEqual(read().held,[]);
  assert.equal(read().checksKnown,false); // Enabled freeze check is unavailable.
  assert.equal(zoneRules({zone:2},discovery,system).checksKnown,false); // No preview checks.
});
