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
test('water balance value and scale open the correct native history dialog with keyboard support',async({page})=>{
  await page.evaluate(()=>document.addEventListener('hass-more-info',event=>window.balanceInfo=event.detail));
  const card=page.locator('irrigation-zone-card').first();
  await card.locator('.balance-value').click();expect(await page.evaluate(()=>window.balanceInfo)).toEqual({entityId:'sensor.smart_irrigation_vorgarten_live_bucket'});
  await page.evaluate(()=>window.balanceInfo=null);await card.locator('.balance-bar').click();expect(await page.evaluate(()=>window.balanceInfo)).toEqual({entityId:'sensor.smart_irrigation_vorgarten_live_bucket'});
  await page.evaluate(()=>window.balanceInfo=null);await card.locator('.balance-detail').focus();await page.keyboard.press('Enter');expect(await page.evaluate(()=>window.balanceInfo)).toEqual({entityId:'sensor.smart_irrigation_vorgarten_live_bucket'});
  await expect(card.locator('button button')).toHaveCount(0);
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
async function zoneFixture(page) {
  await page.evaluate(()=>{
    window.discoveryCallbacks={}; window.discoveryUnsubs=0; window.discoveryReads=[];
    window.zoneData=[{id:0,name:'Automatische Zone',soil_moisture_sensor:window.demoConfig.moisture_entity,linked_entity:'valve.vorgarten'},{id:2,name:'Andere Zone',linked_entity:'valve.vorgarten'}];
    const roles={entity:'duration',bucket_entity:'live_bucket',water_used_entity:'water_used',irrigation_needed_entity:'irrigation_needed',et_entity:'et_value',problem_entity:'problem'};
    const hass=window.demoHass();
    window.zoneRegistry=Object.entries(roles).map(([key,role])=>{
      const old=window.demoConfig[key]; const entity_id=`${old.split('.')[0]}.renamed_${role}`;
      hass.states[entity_id]=hass.states[old]; delete hass.states[old];
      return {entity_id,platform:'smart_irrigation',unique_id:`smart_irrigation_0_${role}`};
    });
    hass.connection={
      subscribeEvents:async cb=>{window.discoveryCallbacks.registry=cb;return ()=>window.discoveryUnsubs++;},
      subscribeMessage:async cb=>{window.discoveryCallbacks.zones=cb;return ()=>window.discoveryUnsubs++;},
    };
    hass.callWS=async message=>{window.discoveryReads.push(message);return message.type==='smart_irrigation/zones' ? window.zoneData : window.zoneRegistry;};
    window.zoneHass=hass;
    const card=document.querySelector('irrigation-zone-card'); card.setConfig({zone:0}); card.hass=hass;
  });
}
test('selecting just a zone resolves renamed sensors, linked moisture and a shared valve',async({page})=>{
  await zoneFixture(page);
  const card=page.locator('irrigation-zone-card').first();
  await expect(card.locator('h2')).toHaveText('Automatische Zone');
  await expect(card.locator('.balance-value')).toHaveText('+3,5 mm');
  await expect(card.locator('.ring-value')).toHaveText('100%');
  await expect(card.locator('.control-title')).toContainText('Gemeinsames Ventil');
  await page.evaluate(()=>{
    const card=document.querySelector('irrigation-zone-card');
    const hass={...window.zoneHass,states:{...window.zoneHass.states,'sensor.renamed_live_bucket':{state:'-6',attributes:{unit_of_measurement:'mm'}}}};
    card.hass=hass;
  });
  await expect(card.locator('.balance-value')).toHaveText('-6 mm');
  page.once('dialog',dialog=>dialog.accept());
  await card.getByRole('button',{name:'Öffnen',exact:true}).click();
  expect(await page.evaluate(()=>window.demoCalls.at(-1))).toEqual({domain:'valve',service:'open_valve',data:{entity_id:'valve.vorgarten'}});
});
test('auto-discovered ET and problem update live and keep watering visible',async({page})=>{
  await zoneFixture(page);const card=page.locator('irrigation-zone-card').first();
  await expect(card.locator('.et-detail')).toHaveText('Angewandte ET-1,1 mm');await expect(card.locator('.problem-banner')).toHaveCount(0);
  await page.evaluate(()=>{
    const card=document.querySelector('irrigation-zone-card');card.hass={...card._hass,states:{...card._hass.states,'sensor.renamed_et_value':{state:'1.2',attributes:{unit_of_measurement:'mm'}},'binary_sensor.renamed_problem':{state:'on',attributes:{reason:'valve_did_not_close'}},'valve.vorgarten':{state:'open',attributes:{supported_features:3}}}};
  });
  await expect(card.locator('.et-detail')).toContainText('+1,2 mm');await expect(card.getByRole('alert')).toContainText('Ventil hat nicht geschlossen');await expect(card.locator('.status')).toHaveText('Ventil aktiv');await expect(card.locator('#control')).toHaveText('Schließen');
  await page.evaluate(()=>document.addEventListener('hass-more-info',event=>window.diagInfo=event.detail));await card.locator('.et-detail').click();expect(await page.evaluate(()=>window.diagInfo)).toEqual({entityId:'sensor.renamed_et_value'});
  await card.locator('.problem-content').click();expect(await page.evaluate(()=>window.diagInfo)).toEqual({entityId:'binary_sensor.renamed_problem'});
});
test('unknown problem stays visible and missing ET is not a zero reading',async({page})=>{
  await zoneFixture(page);const card=page.locator('irrigation-zone-card').first();
  await page.evaluate(()=>{const card=document.querySelector('irrigation-zone-card');card.hass={...card._hass,states:{...card._hass.states,'sensor.renamed_et_value':{state:'unavailable',attributes:{}},'binary_sensor.renamed_problem':{state:'unknown',attributes:{}}}};});
  await expect(card.locator('.problem-banner')).toContainText('Problemstatus unbekannt');await expect(card.locator('.et-detail strong')).toHaveText('—');await expect(card.getByRole('alert')).toHaveCount(0);
  await page.evaluate(()=>{const card=document.querySelector('irrigation-zone-card');card.hass={...card._hass,states:{...card._hass.states,'binary_sensor.renamed_problem':{state:'off',attributes:{reason:'no_flow'}}}};});
  await expect(card.locator('.problem-banner')).toHaveCount(0);
});
test('problem reasons are escaped, generic reasons remain useful, ET also works without a bucket',async({page})=>{
  await page.evaluate(()=>{const card=document.querySelector('irrigation-zone-card');const config={...window.demoConfig};delete config.bucket_entity;card.setConfig(config);card.hass={...window.demoHass(),states:{...window.demoHass().states,[config.problem_entity]:{state:'on',attributes:{reason:'<img src=x onerror=alert(1)>'}},[config.et_entity]:{state:'0',attributes:{unit_of_measurement:'mm'}}}};});
  const card=page.locator('irrigation-zone-card').first();await expect(card.getByRole('alert')).toContainText('<img src=x onerror=alert(1)>');await expect(card.locator('img')).toHaveCount(0);await expect(card.locator('.et-detail strong')).toHaveText('0 mm');
  await page.evaluate(()=>{const card=document.querySelector('irrigation-zone-card');card.hass={...card._hass,states:{...card._hass.states,[window.demoConfig.problem_entity]:{state:'on',attributes:{reason:null}}}};});
  await expect(card.getByRole('alert')).toContainText('Details im Problemsensor prüfen');
});
test('zone dropdown shares discovery, resets overrides on change and persists only the selection',async({page})=>{
  await zoneFixture(page);
  await page.evaluate(()=>{
    const editor=document.createElement('irrigation-zone-card-editor'); editor.id='test-editor';
    editor.setConfig({...window.demoConfig,grid_options:{columns:12}}); editor.hass=window.zoneHass;document.body.append(editor);
    editor.addEventListener('config-changed',event=>window.editorConfig=event.detail.config);
  });
  await expect.poll(()=>page.evaluate(()=>document.querySelector('#test-editor').shadowRoot.querySelector('#main').schema[0].selector.select.options.length)).toBe(3);
  await page.evaluate(()=>document.querySelector('#test-editor').shadowRoot.querySelector('#main').dispatchEvent(new CustomEvent('value-changed',{detail:{value:{zone:'0'}}})));
  const config=await page.evaluate(()=>window.editorConfig);
  expect(config.zone).toBe('0'); expect(config.entity).toBeUndefined(); expect(config.moisture_entity).toBeUndefined(); expect(config.name).toBeUndefined();expect(config.grid_options).toEqual({columns:12});
  expect(await page.evaluate(()=>window.discoveryReads.length)).toBe(2);
  await page.evaluate(()=>document.querySelector('#test-editor').remove());
  expect(await page.evaluate(()=>window.discoveryUnsubs)).toBe(0);
  await page.locator('irrigation-zone-card').first().evaluate(card=>card.remove());
  await expect.poll(()=>page.evaluate(()=>window.discoveryUnsubs)).toBe(2);
});
test('registry and zone edits refresh discovery, missing zones and API errors are visible',async({page})=>{
  await zoneFixture(page);
  const card=page.locator('irrigation-zone-card').first();
  await expect(card.locator('h2')).toHaveText('Automatische Zone');
  await page.evaluate(async()=>{
    window.zoneData=[{...window.zoneData[0],name:'Neuer Name'}];
    await window.discoveryCallbacks.zones();
  });
  await expect(card.locator('h2')).toHaveText('Neuer Name');
  await page.evaluate(()=>document.querySelector('irrigation-zone-card').setConfig({zone:99}));
  await expect(card.locator('.notice')).toContainText('wurde nicht gefunden');
  await expect(card.locator('#control')).toHaveCount(0);
  await page.evaluate(async()=>{window.zoneHass.callWS=async()=>{throw new Error('offline');};await window.discoveryCallbacks.registry();});
  await expect(card.locator('.notice')).toContainText('Automatische Zuordnung nicht verfügbar');
});
