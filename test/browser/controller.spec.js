import {test,expect} from '@playwright/test';

async function fixture(page){
  await page.goto('/demo/overview.html');
  await page.evaluate(async()=>{
    window.controllerCalls=[];
    window.controllerEnabled=false;
    window.controllerLive={paused:false,paused_until:null,programs:[],valves:[],cycle:false};
    const card=document.querySelector('irrigation-overview-card');
    const original=card._hass.callWS;
    card._hass.callWS=async message=>{
      if(message.type==='smart_irrigation/config')return {full_controller:true,irrigation_enabled:window.controllerEnabled,direct_valve_control_enabled:true};
      if(message.type==='smart_irrigation/programs_state')return {programs:[],live:window.controllerLive};
      return original(message);
    };
    window.overviewData[0].registry.push({platform:'smart_irrigation',unique_id:'smart_irrigation_irrigation_enabled',entity_id:'switch.native_master'});
    card.hass={...card._hass,states:{...card._hass.states,'switch.native_master':{state:'off',attributes:{}}},callService:async(domain,service,data)=>{
      window.controllerCalls.push({domain,service,data});
      if(domain==='switch'){
        window.controllerEnabled=service==='turn_on';
        card.hass={...card._hass,states:{...card._hass.states,'switch.native_master':{state:window.controllerEnabled?'on':'off',attributes:{}}}};
      }else if(service==='pause_watering'){window.controllerLive.paused=true;window.controllerLive.paused_until='2026-11-15T15:00:00Z';}
      else if(service==='resume_watering')window.controllerLive.paused=false;
      else if(service==='stop_watering')window.controllerLive={paused:false,programs:[],valves:[],cycle:false};
    }};
    card.setConfig({...window.overviewConfig,show_controller:true,pause_minutes:15,confirm_native:true,confirm_irrigate:false});
    await card._systemReader.refresh();
    await card._unwatch;
    await Promise.all(window.overviewEvents[0].map(cb=>cb()));
  });
  const card=page.locator('irrigation-overview-card').first();
  await expect(card.locator('.controller')).toBeVisible();
  await expect(card.locator('#irrigation_enabled_entity')).toBeVisible();
  return card;
}
test('new master stays at the top, confirms enabling, and full controller hides incompatible direct toggle',async({page})=>{
  const card=await fixture(page);
  await expect(card.locator('#native_control')).toHaveCount(0);
  await expect(card.locator('#irrigation_enabled_entity')).toContainText('Zentrale Steuerung aus');
  await expect(card.locator('.system-status')).toHaveText('Automatik pausiert');
  page.once('dialog',d=>d.dismiss());await card.locator('#irrigation_enabled_entity').click();
  expect(await page.evaluate(()=>window.controllerCalls)).toEqual([]);
  page.once('dialog',d=>d.accept());await card.locator('#irrigation_enabled_entity').click();
  expect(await page.evaluate(()=>window.controllerCalls)).toEqual([{domain:'switch',service:'turn_on',data:{entity_id:'switch.native_master'}}]);
  await card.locator('#irrigation_enabled_entity').click();
  expect(await page.evaluate(()=>window.controllerCalls.at(-1).service)).toBe('turn_off');
  await expect(card.locator('#controller_stop')).toBeDisabled();
});
test('pause, resume and stop use controller services and live progress is escaped',async({page})=>{
  const card=await fixture(page);
  await card.evaluate(async card=>{
    window.controllerEnabled=true;window.controllerLive={paused:false,cycle:true,valves:[],programs:[{program_id:'main',name:'<img src=x onerror=alert(1)>',step:1,steps:3,percent:42,remaining_seconds:180}]};
    await card._systemReader.refresh();
  });
  await expect(card.locator('.controller-program')).toContainText('<img src=x onerror=alert(1)>');
  await expect(card.locator('.controller img')).toHaveCount(0);
  await expect(card.locator('progress')).toHaveAttribute('value','42');
  await card.locator('#controller_pause').click();
  await expect(card.locator('.controller')).toContainText('Lauf pausiert');
  await expect(card.locator('.controller')).toContainText('Pause bis');
  await expect(card.locator('#controller_pause')).toBeDisabled();
  await card.locator('#controller_resume').click();
  await card.locator('#controller_stop').click();
  expect(await page.evaluate(()=>window.controllerCalls)).toEqual([
    {domain:'smart_irrigation',service:'pause_watering',data:{minutes:15}},
    {domain:'smart_irrigation',service:'resume_watering',data:{}},
    {domain:'smart_irrigation',service:'stop_watering',data:{}},
  ]);
  await expect(card.locator('#controller_stop')).toBeDisabled();
  await card.screenshot({path:'test-results/controller-ready.png'});
});
test('runtime failures disable commands, retain planning and support read-only and hidden controls',async({page})=>{
  const card=await fixture(page);
  await card.evaluate(async card=>{const original=card._hass.callWS;card._hass.callWS=message=>message.type==='smart_irrigation/programs_state'?Promise.reject(Error('offline')):original(message);await card._systemReader.refresh();});
  await expect(card.locator('.controller')).toContainText('Controller-Status nicht verfügbar');
  await expect(card.locator('#controller_pause')).toBeDisabled();
  await card.evaluate(card=>card._action('controller_pause'));
  expect(await page.evaluate(()=>window.controllerCalls)).toEqual([]);
  await card.evaluate(card=>card.setConfig({...card._config,show_actions:false}));
  await expect(card.locator('[data-action]')).toHaveCount(0);
  await card.evaluate(card=>card.setConfig({...card._config,show_controller:false,show_master_control:false}));
  await expect(card.locator('.controller')).toHaveCount(0);
  await expect(card.locator('#irrigation_enabled_entity')).toHaveCount(0);
});
