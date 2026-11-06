import { test,expect } from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/demo/overview.html');await expect(page.locator('irrigation-overview-card').first().locator('.system-status')).toHaveText('Start vorgemerkt');});
test('central planning, timezone, rain and frost are independent of zone cards',async({page})=>{
  const cards=page.locator('irrigation-overview-card');await expect(cards).toHaveCount(3);
  await expect(cards.first().locator('.plan-date')).toContainText('06:56');
  await expect(cards.first().locator('.totals')).toContainText('13 min');
  await expect(cards.first().locator('.frost')).toContainText('11,7°C');
  await expect(cards.nth(1).locator('.rain-heading')).toContainText('4,5');
  await expect(cards.nth(2).locator('.frost')).toContainText('Frostsperre aktiv');
  await expect(cards.nth(2).locator('.frost')).toContainText('-1,5°C');
});
test('frost disabled and missing temperature never look like a cleared check',async({page})=>{
  await page.evaluate(async()=>{Object.assign(window.overviewData[0].info.skip_preview.checks[0],{available:false,value:null});await Promise.all(window.overviewEvents[0].map(callback=>callback()));});
  const frost=page.locator('irrigation-overview-card').first().locator('.frost');await expect(frost).toContainText('Kein gültiger Temperaturwert');await expect(frost.locator('.reading')).toHaveText('—');
  await page.evaluate(async()=>{window.overviewData[0].info.skip_preview.checks[0].enabled=false;await Promise.all(window.overviewEvents[0].map(callback=>callback()));});
  await expect(frost).toContainText('Frostschutz ist in Smart Irrigation ausgeschaltet');
});
test('native central buttons and protection toggle target exact entities',async({page})=>{
  const card=page.locator('irrigation-overview-card').first();
  await card.getByRole('button',{name:'Alle berechnen',exact:true}).click();await card.getByRole('button',{name:'Wetter aktualisieren',exact:true}).click();
  await card.locator('#precipitation_switch_entity').click();
  expect(await page.evaluate(()=>window.overviewCalls)).toEqual([{domain:'button',service:'press',data:{entity_id:'button.calculate_all'}},{domain:'button',service:'press',data:{entity_id:'button.update_weather'}},{domain:'switch',service:'turn_off',data:{entity_id:'switch.rain_protection'}}]);
});
test('external automation pause is shown; service failures do not fake success',async({page})=>{
  const card=page.locator('irrigation-overview-card').first();await card.locator('#automation_entity').click();await expect(card.locator('#automation_entity')).toContainText('Automatik pausiert');await expect(card.locator('.settings #automation_entity')).toHaveCount(0);
  await page.evaluate(()=>{document.querySelector('irrigation-overview-card')._hass.callService=async()=>{throw new Error('No permission');};});
  await card.getByRole('button',{name:'Alle berechnen',exact:true}).click();await expect(card.getByRole('alert')).toContainText('No permission');
});
test('threshold uses HA details; main valve switches directly and read-only mode hides actions',async({page})=>{
  await page.evaluate(()=>document.addEventListener('hass-more-info',event=>window.overviewMore=event.detail));
  const card=page.locator('irrigation-overview-card').first();await card.locator('#rain-threshold').click();expect(await page.evaluate(()=>window.overviewMore)).toEqual({entityId:'number.rain_threshold'});
  page.once('dialog',dialog=>dialog.accept());await card.locator('#main_valve_entity').click();expect(await page.evaluate(()=>window.overviewCalls.at(-1))).toEqual({domain:'switch',service:'turn_on',data:{entity_id:'switch.main_valve'}});expect(await page.evaluate(()=>window.overviewMore)).toEqual({entityId:'number.rain_threshold'});
  await card.locator('#main_valve_entity').click();expect(await page.evaluate(()=>window.overviewCalls.at(-1).service)).toBe('turn_off');
  await card.evaluate(card=>card.setConfig({...window.overviewConfig,show_actions:false}));await expect(card.locator('[data-action]')).toHaveCount(0);
});
test('API failure clears planning instead of showing a healthy zero',async({page})=>{
  await page.evaluate(async()=>{const card=document.querySelector('irrigation-overview-card');card._hass.callWS=async()=>{throw new Error('offline');};await card._systemReader.refresh();});
  const card=page.locator('irrigation-overview-card').first();await expect(card.locator('.system-status')).toHaveText('Status unbekannt');await expect(card.locator('.plan-date')).toHaveText('—');await expect(card.locator('.notice')).toContainText('Zentrale Daten nicht verfügbar');
});
test('overview editor preserves layout and clears overrides',async({page})=>{
  const config=await page.evaluate(()=>{const editor=document.createElement('irrigation-overview-card-editor');editor.setConfig({...window.overviewConfig,grid_options:{columns:12}});editor.hass=window.overviewHass(0);let result;editor.addEventListener('config-changed',event=>result=event.detail.config);editor.shadowRoot.querySelector('ha-form').dispatchEvent(new CustomEvent('value-changed',{detail:{value:{main_valve_entity:''}}}));return result;});
  expect(config.main_valve_entity).toBeUndefined();expect(config.grid_options).toEqual({columns:12});
});
test('central card fits phone width and supports dark theme',async({page})=>{
  await page.setViewportSize({width:390,height:1400});expect(await page.locator('irrigation-overview-card').first().evaluate(card=>card.shadowRoot.querySelector('ha-card').scrollWidth<=card.clientWidth)).toBe(true);
  await page.screenshot({path:'test-results/overview-mobile.png',fullPage:true});
  await page.setViewportSize({width:1280,height:1400});await page.screenshot({path:'test-results/overview-light.png',fullPage:true});
  await page.locator('#theme').click();await page.screenshot({path:'test-results/overview-dark.png',fullPage:true});
});

test('top controls precede planning, paused automation is clickable and main opening can be cancelled',async({page})=>{
  const card=page.locator('irrigation-overview-card').first();
  expect(await card.evaluate(card=>card.shadowRoot.querySelector('.top-controls').compareDocumentPosition(card.shadowRoot.querySelector('.plan')) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
  await card.locator('#automation_entity').click();await expect(card.locator('#automation_entity')).toContainText('Automatik pausiert');
  await card.locator('#automation_entity').click();await expect(card.locator('#automation_entity')).toContainText('Automatik aktiv');
  page.once('dialog',dialog=>dialog.dismiss());await card.locator('#main_valve_entity').click();
  expect(await page.evaluate(()=>window.overviewCalls.filter(call=>call.data.entity_id==='switch.main_valve'))).toEqual([]);
  await expect(card.locator('.settings [data-action="main_valve_entity"]')).toHaveCount(0);
});
test('main valve honors valve capabilities and moving states; failures remain visible',async({page})=>{
  await page.evaluate(()=>{const card=document.querySelector('irrigation-overview-card');card.setConfig({...window.overviewConfig,main_valve_entity:'valve.main',confirm_open:false});card.hass={...card._hass,states:{...card._hass.states,'valve.main':{state:'closed',attributes:{supported_features:1}}}};});
  const card=page.locator('irrigation-overview-card').first();await card.locator('#main_valve_entity').click();expect(await page.evaluate(()=>window.overviewCalls.at(-1))).toEqual({domain:'valve',service:'open_valve',data:{entity_id:'valve.main'}});
  await page.evaluate(()=>{const card=document.querySelector('irrigation-overview-card');card.hass={...card._hass,states:{...card._hass.states,'valve.main':{state:'opening',attributes:{supported_features:3}}}};});
  await expect(card.locator('#main_valve_entity')).toBeDisabled();
  await page.evaluate(()=>{const card=document.querySelector('irrigation-overview-card');card.hass={...card._hass,states:{...card._hass.states,'valve.main':{state:'open',attributes:{supported_features:2}}},callService:async()=>{throw new Error('Valve offline');}};});
  await card.locator('#main_valve_entity').click();await expect(card.getByRole('alert')).toContainText('Valve offline');await expect(card.locator('#main_valve_entity')).toContainText('Geöffnet');
});
test('minimal overview works with Smart Irrigation alone and does not request local entities',async({page})=>{
  await page.evaluate(()=>{
    const card=document.querySelector('irrigation-overview-card');
    card.setConfig({type:'custom:irrigation-overview-card'});
    const states=Object.fromEntries(Object.entries(card._hass.states).filter(([id])=>!id.startsWith('automation.')&&id!=='switch.main_valve'));
    card.hass={...card._hass,states};
  });
  const card=page.locator('irrigation-overview-card').first();
  await expect(card.locator('.system-status')).toHaveText('Start vorgemerkt');
  await expect(card.locator('#automation_entity')).toHaveCount(0);await expect(card.locator('#main_valve_entity')).toHaveCount(0);await expect(card.locator('#native_control')).toHaveCount(1);
  await expect(card.locator('.notice')).toHaveCount(0);
  await expect(card.locator('.frost')).toContainText('11,7°C');
  await card.getByRole('button',{name:'Alle berechnen',exact:true}).click();
  expect(await page.evaluate(()=>window.overviewCalls)).toEqual([{domain:'button',service:'press',data:{entity_id:'button.calculate_all'}}]);
});

async function nativeOverviewFixture(page){
  await page.evaluate(async()=>{
    window.overviewData[0].config.direct_valve_control_enabled=true;
    window.overviewData[0].registry.push({platform:'smart_irrigation',unique_id:'smart_irrigation_irrigate_all',entity_id:'button.all_native'});
    const card=document.querySelector('irrigation-overview-card');card.hass={...card._hass,states:{...card._hass.states,'button.all_native':{state:'unknown',attributes:{}}}};
    card.setConfig({...window.overviewConfig,show_control:false,show_irrigate:true});
    await Promise.all(window.overviewEvents[0].map(cb=>cb()));
  });
}
test('native global run is independently configurable and targets the integration button',async({page})=>{
  await nativeOverviewFixture(page);const card=page.locator('irrigation-overview-card').first();await expect(card.locator('#main_valve_entity')).toHaveCount(0);
  page.once('dialog',d=>d.accept());await card.locator('#irrigate_entity').click();expect(await page.evaluate(()=>window.overviewCalls)).toEqual([{domain:'button',service:'press',data:{entity_id:'button.all_native'}}]);
  await card.screenshot({path:'test-results/native-overview.png'});
  await card.evaluate(card=>card.setConfig({...card._config,show_actions:false}));await expect(card.locator('[data-action]')).toHaveCount(0);await expect(card.locator('#irrigate_entity')).toHaveCount(0);
});
test('missing native global button stays disabled and cannot trigger a local automation',async({page})=>{
  const card=page.locator('irrigation-overview-card').first();await card.evaluate(card=>card.setConfig({...window.overviewConfig,show_irrigate:true}));
  await expect(card.locator('#irrigate_entity')).toBeDisabled();await expect(card.locator('.irrigate-control')).toContainText('Direkte Ventilsteuerung in Smart Irrigation aktivieren');expect(await page.evaluate(()=>window.overviewCalls)).toEqual([]);
});
test('native control switch confirms enabling, writes only its setting and verifies backend state',async({page})=>{
  const card=page.locator('irrigation-overview-card').first();await expect(card.locator('#native_control')).toContainText('Native Steuerung aus');
  page.once('dialog',d=>d.dismiss());await card.locator('#native_control').click();expect(await page.evaluate(()=>window.overviewApiCalls)).toEqual([]);
  page.once('dialog',d=>d.accept());await card.locator('#native_control').click();await expect(card.locator('#native_control')).toContainText('Native Steuerung aktiv');
  expect(await page.evaluate(()=>window.overviewApiCalls)).toEqual([{method:'POST',path:'smart_irrigation/config',data:{direct_valve_control_enabled:true}}]);
  await card.locator('#native_control').click();await expect(card.locator('#native_control')).toContainText('Native Steuerung aus');
  expect(await page.evaluate(()=>window.overviewCalls)).toEqual([]);
});
test('native control failures preserve reported backend state and the control can be hidden',async({page})=>{
  const card=page.locator('irrigation-overview-card').first();
  await card.evaluate(card=>{card.setConfig({...card._config,confirm_native:false});card._hass.callApi=async()=>{throw new Error('Config denied');};});
  await card.locator('#native_control').click();await expect(card.getByRole('alert')).toContainText('Config denied');await expect(card.locator('#native_control')).toContainText('Native Steuerung aus');
  await card.evaluate(card=>{card._hass.callApi=async()=>({});});
  await card.locator('#native_control').click();await expect(card.getByRole('alert')).toContainText('nicht bestätigt');
  await card.evaluate(card=>card.setConfig({...card._config,show_native_control:false}));await expect(card.locator('#native_control')).toHaveCount(0);
});
test('enabled native control with a missing button asks for reload instead of activation',async({page})=>{
  await page.evaluate(async()=>{const card=document.querySelector('irrigation-overview-card');card.setConfig({...window.overviewConfig,show_irrigate:true});window.overviewData[0].config.direct_valve_control_enabled=true;await card._systemReader.refresh();});
  const card=page.locator('irrigation-overview-card').first();await expect(card.locator('#irrigate_entity')).toBeDisabled();await expect(card.locator('.irrigate-control')).toContainText('Native Steuerung ist aktiv');await expect(card.locator('.irrigate-control')).toContainText('einmal neu laden');await expect(card.locator('.irrigate-control')).not.toContainText('aktivieren');
});
