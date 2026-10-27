// Translations for both cards.
//
// Adding a language:
//   1. Copy en.js to <code>.js (e.g. fr.js) and translate the values. Keep the keys.
//   2. Import it below and add it to `languages` with its own name.
// Missing keys fall back to English, so a partial translation still works.
import en from './en.js';
import de from './de.js';
import nl from './nl.js';

export const languages = {
  en: { name: 'English', strings: en },
  de: { name: 'Deutsch', strings: de },
  nl: { name: 'Nederlands', strings: nl },
};

export const languageCodes = ['auto', ...Object.keys(languages)];

export const languageOptions = [
  { value: 'auto', label: 'Auto' },
  ...Object.entries(languages).map(([value, { name }]) => ({ value, label: name })),
];

// 'auto' or no setting follows Home Assistant; region variants such as 'nl-BE' use their base language.
export function resolveLanguage(configured, hass) {
  const lang = configured && configured !== 'auto' ? configured : hass?.language;
  const base = String(lang || '').toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(languages, base) ? base : 'en';
}

const merge = (fallback, own = {}) => Object.fromEntries(Object.entries(fallback).map(([key, value]) =>
  [key, value && typeof value === 'object' ? merge(value, own[key]) : own[key] ?? value]));

const cache = new Map();
export function translate(lang, section) {
  const id = `${lang}:${section}`;
  if (!cache.has(id)) cache.set(id, merge(en[section], languages[lang]?.strings[section]));
  return cache.get(id);
}
