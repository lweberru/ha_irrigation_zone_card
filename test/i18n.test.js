import { test } from 'node:test';
import assert from 'node:assert/strict';
import { languages, languageCodes, resolveLanguage, translate } from '../src/i18n/index.js';
import { validateConfig } from '../src/model.js';
import { validateOverviewConfig } from '../src/overview-model.js';
const keys = (obj, prefix='') => Object.entries(obj).flatMap(([key, value]) => value && typeof value === 'object' ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]).sort();
test('every language translates the same keys as English',()=>{
  const english = keys(languages.en.strings);
  for (const [code, { strings }] of Object.entries(languages)) assert.deepEqual(keys(strings), english, code);
});
test('language follows the configuration, then Home Assistant, then English',()=>{
  assert.equal(resolveLanguage('nl', {language:'de'}), 'nl');
  assert.equal(resolveLanguage('auto', {language:'de-CH'}), 'de');
  assert.equal(resolveLanguage(undefined, {language:'nl'}), 'nl');
  assert.equal(resolveLanguage('auto', {language:'fr'}), 'en');
  assert.equal(resolveLanguage('auto', {}), 'en');
});
test('missing translations fall back to English',()=>{
  languages.xx = { name:'Test', strings:{ card:{ zone:'Zone XX', problemReasons:{ no_flow:'XX' } } } };
  try {
    const t = translate('xx', 'card');
    assert.equal(t.zone, 'Zone XX');
    assert.equal(t.watering, languages.en.strings.card.watering);
    assert.equal(t.problemReasons.no_flow, 'XX');
    assert.equal(t.problemReasons.valve_did_not_open, languages.en.strings.card.problemReasons.valve_did_not_open);
  } finally { delete languages.xx; }
});
test('configuration accepts every registered language',()=>{
  for (const language of languageCodes) {
    assert.equal(validateConfig({entity:'sensor.zone',language}).language, language);
    assert.equal(validateOverviewConfig({language}).language, language);
  }
  assert.throws(()=>validateConfig({entity:'sensor.zone',language:'xx'}));
});
