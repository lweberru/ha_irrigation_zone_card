import {test} from 'node:test';
import assert from 'node:assert/strict';
import {irrigateAction,irrigateIssue} from '../src/irrigate.js';
import {validateConfig} from '../src/model.js';
import {resolveZone} from '../src/discovery.js';
import {validateOverviewConfig,resolveOverview,overviewModel} from '../src/overview-model.js';
test('native run controls are opt-in, independent of direct controls and domain validated',()=>{
  assert.equal(validateConfig({zone:0}).show_irrigate,false);assert.equal(validateOverviewConfig({}).show_irrigate,false);
  assert.equal(validateOverviewConfig({}).show_native_control,true);
  for(const config of [{zone:0,irrigate_entity:'switch.zone'},{zone:0,show_irrigate:'true'},{zone:0,confirm_irrigate:'false'}])assert.throws(()=>validateConfig(config));
  assert.throws(()=>validateOverviewConfig({irrigate_entity:'switch.zone'}));assert.throws(()=>validateOverviewConfig({show_native_control:'true'}));
  assert.equal(validateConfig({zone:0,show_control:false,show_irrigate:true}).show_irrigate,true);
});
test('native buttons resolve by stable unique IDs, never guessed or substituted',()=>{
  const entry={platform:'smart_irrigation',unique_id:'smart_irrigation_0_irrigate_now',entity_id:'button.renamed_run'};
  const discovery={zones:[{id:0,name:'Zone'}],registry:[entry]};
  assert.equal(resolveZone({zone:0},discovery).irrigate_entity,'button.renamed_run');
  assert.equal(resolveZone({zone:0,irrigate_entity:'button.custom'},discovery).irrigate_entity,'button.custom');
  assert.equal(resolveZone({zone:0},{...discovery,registry:[{...entry,disabled_by:'user'}]}).irrigate_entity,undefined);
  assert.equal(resolveZone({zone:0},{...discovery,registry:[entry,{...entry,entity_id:'button.duplicate'}]}).irrigate_entity,undefined);
  assert.equal(resolveOverview({}, {registry:[{...entry,unique_id:'smart_irrigation_irrigate_all'}]}).irrigate_entity,'button.renamed_run');
});
test('native action requires explicitly enabled backend and available button; unknown means never pressed',()=>{
  const config={show_irrigate:true,irrigate_entity:'button.run'};const states={'button.run':{state:'unknown'}};
  assert.deepEqual(irrigateAction(config,states,{config:{direct_valve_control_enabled:true}}),{domain:'button',service:'press',entity:'button.run'});
  for(const system of [null,{config:{}},{config:{direct_valve_control_enabled:false}}])assert.equal(irrigateAction(config,states,system),null);
  assert.equal(irrigateAction(config,{'button.run':{state:'unavailable'}},{config:{direct_valve_control_enabled:true}}),null);
  assert.equal(irrigateAction({...config,show_irrigate:false},states,{config:{direct_valve_control_enabled:true}}),null);
});

test('optional external automation cannot override native integration planning status',()=>{
  const system={config:{direct_valve_control_enabled:true},info:{next_irrigation_duration:60,start_trigger_armed:true,skip_preview:{checks:[]}}};
  for(const state of ['off','unavailable'])assert.equal(overviewModel({automation_entity:'automation.extra'},{'automation.extra':{state}},system,{zones:[]}).status,'scheduled');
});

test('native diagnostics distinguish enabled-with-missing-button from disabled control',()=>{
  const enabled={config:{direct_valve_control_enabled:true}};
  assert.equal(irrigateIssue({}, {},enabled),'missingButton');
  assert.equal(irrigateIssue({}, {},{config:{direct_valve_control_enabled:false}}),'enableNative');
  assert.equal(irrigateIssue({}, {},null),'statusUnknown');
  assert.equal(irrigateIssue({irrigate_entity:'button.run'}, {},enabled),'buttonUnavailable');
  assert.equal(irrigateIssue({irrigate_entity:'button.run'}, {'button.run':{state:'unknown'}},enabled),null);
});
test('zero committed zone duration explains the no-op and cannot dispatch watering',()=>{
  const config={entity:'sensor.duration',show_irrigate:true,irrigate_entity:'button.run'};
  const system={config:{direct_valve_control_enabled:true}};
  for(const value of ['0','0.0','-1']){
    const states={'button.run':{state:'unknown'},'sensor.duration':{state:value}};
    assert.equal(irrigateIssue(config,states,system),'noDemand');
    assert.equal(irrigateAction(config,states,system),null);
  }
  for(const value of ['120','unknown','unavailable','',undefined]){
    assert.notEqual(irrigateAction(config,{'button.run':{state:'unknown'},'sensor.duration':{state:value}},system),null);
  }
});
test('global no-demand uses committed eligible zones rather than a zero planning preview',()=>{
  const config={show_irrigate:true,irrigate_entity:'button.run'};
  const states={'button.run':{state:'unknown'}};
  const system={config:{direct_valve_control_enabled:true},info:{next_irrigation_duration:0}};
  const discovery={zones:[{id:0,duration:0,linked_entity:'valve.zone'},{id:1,duration:300,state:'disabled',linked_entity:'valve.disabled'},{id:2,duration:300}],registry:[]};
  assert.equal(irrigateIssue(config,states,system,discovery),'noDemand');
  assert.equal(irrigateAction(config,states,system,discovery),null);
  discovery.zones[0].duration=120;
  assert.notEqual(irrigateAction(config,states,system,discovery),null);
  discovery.zones[0].duration=undefined;
  assert.notEqual(irrigateAction(config,states,system,discovery),null);
});
test('global no-demand prefers live duration entities and ignores failed discovery',()=>{
  const config={show_irrigate:true,irrigate_entity:'button.run'};
  const system={config:{direct_valve_control_enabled:true}};
  const states={'button.run':{state:'unknown'},'sensor.renamed':{state:'120'}};
  const discovery={zones:[{id:0,duration:0,linked_entity:'valve.zone'}],registry:[{platform:'smart_irrigation',unique_id:'smart_irrigation_0_duration',entity_id:'sensor.renamed'}]};
  assert.notEqual(irrigateAction(config,states,system,discovery),null);
  states['sensor.renamed'].state='0';
  assert.equal(irrigateIssue(config,states,system,discovery),'noDemand');
  assert.notEqual(irrigateAction(config,states,system,{...discovery,error:true}),null);
});
