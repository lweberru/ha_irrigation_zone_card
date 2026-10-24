import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateOverviewConfig,resolveOverview,overviewModel,overviewAction } from '../src/overview-model.js';
import { watchOverview } from '../src/overview-data.js';
const config={automation_entity:'automation.irrigation'};
const info={next_irrigation_duration:600,next_irrigation_zones:['Zone'],start_trigger_armed:true,skip_preview:{should_skip:false,checks:[]}};
const system={info,config:{active_valve_runs:[]}};
test('overview needs no entity; optional overrides are domain-validated',()=>{
  assert.equal(validateOverviewConfig({}).show_actions,true);
  for(const value of [{automation_entity:'switch.wrong'},{calculate_entity:'light.wrong'},{main_valve_entity:'sensor.wrong'},{show_actions:'yes'}])assert.throws(()=>validateOverviewConfig(value));
});
test('overview auto-discovers only unambiguous enabled global entities',()=>{
  const entry={entity_id:'button.renamed',platform:'smart_irrigation',unique_id:'smart_irrigation_calculate_all'};
  assert.equal(resolveOverview({}, {registry:[entry]}).calculate_entity,'button.renamed');
  assert.equal(resolveOverview({calculate_entity:'button.manual'},{registry:[entry]}).calculate_entity,'button.manual');
  assert.equal(resolveOverview({},{registry:[entry,{...entry,entity_id:'button.duplicate'}]}).calculate_entity,undefined);
  assert.equal(resolveOverview({},{registry:[{...entry,disabled_by:'user'}]}).calculate_entity,undefined);
});
test('status separates external automation, actual direct runs, skips and unarmed demand',()=>{
  const model=(state,changes={})=>overviewModel(config,{'automation.irrigation':{state}},{...system,...changes},{zones:[{}]});
  assert.equal(model('off').status,'paused');assert.equal(model('unavailable').status,'unknown');assert.equal(model('on').status,'scheduled');
  assert.equal(model('on',{info:{...info,start_trigger_armed:false}}).status,'demand');
  assert.equal(model('on',{info:{...info,next_irrigation_duration:0}}).status,'noDemand');
  assert.equal(model('off',{config:{active_valve_runs:[{zone_id:1}]}}).status,'running');
  assert.equal(model('on',{error:true}).status,'unknown');
  assert.equal(model('on',{info:{...info,skip_preview:{should_skip:true,checks:[]}}}).status,'blocked');
});
test('rain and frost retain source units, real zero values and unavailable checks',()=>{
  const checks=[{id:'freeze',enabled:true,available:false,value:null,threshold:2,unit:'°C'},{id:'precipitation',enabled:true,available:true,forecast_mm:0,threshold_mm:2}];
  const m=overviewModel({}, {},{...system,info:{...info,skip_preview:{checks}}},{zones:[]});
  assert.equal(m.forecast,0);assert.equal(m.rainFill,0);assert.equal(m.checks[0].available,false);assert.equal(m.checks[0].unit,'°C');
  assert.equal(m.zoneCount,0);assert.equal(overviewModel({}, {},null,null).duration,null);
  assert.equal(overviewModel({}, {},{...system,info:{...info,skip_preview:{checks:[{...checks[1],forecast_mm:10}]}}},null).rainFill,100);
});
test('actions target exact entities; unknown is a valid never-pressed button state',()=>{
  assert.deepEqual(overviewAction({calculate_entity:'button.calc'},{'button.calc':{state:'unknown'}},'calculate_entity'),{domain:'button',service:'press',entity:'button.calc'});
  assert.equal(overviewAction({calculate_entity:'button.calc'},{'button.calc':{state:'unavailable'}},'calculate_entity'),null);
  assert.equal(overviewAction(config,{'automation.irrigation':{state:'unknown'}},'automation_entity'),null);
  assert.equal(overviewAction(config,{'automation.irrigation':{state:'on'}},'automation_entity').service,'turn_off');
});
test('system reader shares requests, handles partial failure and cleans up subscriptions',async()=>{
  let reads=0,cleanups=0;const callbacks=[];
  const hass={connection:{subscribeMessage:async callback=>{callbacks.push(callback);return()=>cleanups++;}},callWS:async message=>{reads++;return message.type.endsWith('/info')?info:system.config;}};
  const first=[],second=[];const a=watchOverview(hass,value=>first.push(value));const b=watchOverview(hass,value=>second.push(value));
  await new Promise(resolve=>setTimeout(resolve,0));assert.equal(reads,2);assert.equal(first.length,1);assert.equal(second.length,1);
  hass.callWS=async()=>{throw new Error('offline');};await callbacks[0]();assert.equal(first.at(-1).error,true);assert.equal(first.at(-1).info,null);
  a.unsubscribe();assert.equal(cleanups,0);b.unsubscribe();assert.equal(cleanups,1);
});
