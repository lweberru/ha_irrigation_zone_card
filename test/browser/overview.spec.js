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
  const card=page.locator('irrigation-overview-card').first();await card.locator('#automation_entity').click();await expect(card.locator('.system-status')).toHaveText('Automatik pausiert');
  await page.evaluate(()=>{document.querySelector('irrigation-overview-card')._hass.callService=async()=>{throw new Error('No permission');};});
  await card.getByRole('button',{name:'Alle berechnen',exact:true}).click();await expect(card.getByRole('alert')).toContainText('No permission');
});
test('threshold and main valve use HA detail dialog; read-only inline mode hides actions',async({page})=>{
  await page.evaluate(()=>document.addEventListener('hass-more-info',event=>window.overviewMore=event.detail));
  const card=page.locator('irrigation-overview-card').first();await card.locator('#rain-threshold').click();expect(await page.evaluate(()=>window.overviewMore)).toEqual({entityId:'number.rain_threshold'});
  await card.locator('#main-valve').click();expect(await page.evaluate(()=>window.overviewMore)).toEqual({entityId:'switch.main_valve'});
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
