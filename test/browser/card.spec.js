import { test, expect } from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/'); await expect(page.locator('irrigation-zone-card')).toHaveCount(3);});
test('renders real data, signed balance and distinct statuses',async({page})=>{
  const cards = page.locator('irrigation-zone-card');
  await expect(cards.nth(0).locator('.status')).toHaveText('Kein Wasserbedarf');
  await expect(cards.nth(0).locator('.balance-value')).toHaveText('+3,5 mm');
  await expect(cards.nth(0).locator('.ring-value')).toHaveText('100%');
  await expect(cards.nth(1).locator('.status')).toHaveText('Bewässerung nötig');
  await expect(cards.nth(1).locator('.stat-value').first()).toHaveText('13 min');
  await expect(cards.nth(2).locator('.status')).toHaveText('Ventil aktiv');
});
test('confirm opening, exact service targeting, close without confirmation',async({page})=>{
  page.once('dialog',dialog=>dialog.dismiss());
  await page.locator('irrigation-zone-card').first().getByRole('button',{name:'Öffnen',exact:true}).click();
  expect(await page.evaluate(()=>window.demoCalls)).toEqual([]);
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('irrigation-zone-card').first().getByRole('button',{name:'Öffnen',exact:true}).click();
  expect(await page.evaluate(()=>window.demoCalls)).toEqual([{domain:'valve',service:'open_valve',data:{entity_id:'valve.vorgarten'}}]);
  await page.locator('irrigation-zone-card').first().getByRole('button',{name:'Schließen',exact:true}).click();
  expect(await page.evaluate(()=>window.demoCalls.at(-1).service)).toBe('close_valve');
});
test('switch routing and service failures remain visible',async({page})=>{
  await page.evaluate(()=>{
    const card = document.querySelector('irrigation-zone-card');
    card.setConfig({...window.demoConfig,valve_entity:'switch.zone',confirm_open:false});
    card.hass = {...window.demoHass(),states:{...window.demoHass().states,'switch.zone':{state:'off',attributes:{}}},callService:async(domain,service,data)=>{window.demoCalls.push({domain,service,data});throw new Error('Test error');}};
  });
  await page.locator('irrigation-zone-card').first().getByRole('button',{name:'Öffnen',exact:true}).click();
  expect(await page.evaluate(()=>window.demoCalls[0])).toEqual({domain:'switch',service:'turn_on',data:{entity_id:'switch.zone'}});
  await expect(page.locator('irrigation-zone-card').first().getByRole('alert')).toContainText('Test error');
});
test('unavailable values are never rendered as healthy zero and moving valve is disabled',async({page})=>{
  await page.evaluate(()=>{
    const card=document.querySelector('irrigation-zone-card'); const hass=window.demoHass();
    for(const key of Object.keys(hass.states)) hass.states[key]={state:'unavailable',attributes:{}};
    hass.states['valve.vorgarten']={state:'opening',attributes:{supported_features:3}};
    card.hass=hass;
  });
  const card = page.locator('irrigation-zone-card').first();
  await expect(card.locator('.balance-value')).toHaveText('—');
  await expect(card.locator('#control')).toBeDisabled();
  await expect(card.locator('.notice')).toContainText('Nicht verfügbar');
});
test('more-info is composed and config text cannot inject markup',async({page})=>{
  await page.evaluate(()=>{
    document.addEventListener('hass-more-info',event=>window.moreInfo=event.detail);
    document.querySelector('irrigation-zone-card').setConfig({...window.demoConfig,name:'<img src=x onerror=alert(1)>'});
  });
  const card=page.locator('irrigation-zone-card').first();
  await expect(card.locator('h2')).toHaveText('<img src=x onerror=alert(1)>');
  await expect(card.locator('img')).toHaveCount(0);
  await card.getByRole('button',{name:'Zonendetails öffnen'}).click();
  expect(await page.evaluate(()=>window.moreInfo)).toEqual({entityId:'sensor.smart_irrigation_vorgarten'});
});
test('responsive layout stays within card at phone width; light/dark previews',async({page})=>{
  await page.setViewportSize({width:390,height:1600});
  expect(await page.locator('irrigation-zone-card').first().evaluate(card=>card.shadowRoot.querySelector('ha-card').scrollWidth <= card.clientWidth)).toBe(true);
  await page.screenshot({path:'test-results/mobile.png',fullPage:true});
  await page.setViewportSize({width:1280,height:850});
  await page.screenshot({path:'test-results/light.png',fullPage:true});
  await page.locator('#theme').click();
  await page.screenshot({path:'test-results/dark.png',fullPage:true});
});
test('visual editor preserves unrelated config and clears optional values',async({page})=>{
  const result = await page.evaluate(()=>{
    const card=document.querySelector('irrigation-zone-card'); const editor=card.constructor.getConfigElement();
    editor.setConfig({...window.demoConfig,grid_options:{columns:12},show_control:false}); editor.hass=window.demoHass();
    let result; editor.addEventListener('config-changed',event=>result=event.detail.config);
    editor.shadowRoot.querySelector('ha-form').dispatchEvent(new CustomEvent('value-changed',{detail:{value:{moisture_entity:'',name:'Beet'}}}));
    return result;
  });
  expect(result.name).toBe('Beet'); expect(result.moisture_entity).toBeUndefined(); expect(result.grid_options).toEqual({columns:12}); expect(result.show_control).toBe(false);
});
