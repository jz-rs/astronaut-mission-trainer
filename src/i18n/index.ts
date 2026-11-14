import en from './en.json';
import es from './es.json';

/** Spanish is the source of truth: every key must exist in es.json first. */
export type TranslationKey = keyof typeof es;
export type Language = 'es' | 'en';

const dictionaries: Record<Language, Record<TranslationKey, string>> = { es, en };

let currentLanguage: Language = 'es';

export function setLanguage(language: Language): void {
  currentLanguage = language;
}

export function getLanguage(): Language {
  return currentLanguage;
}

/** Translates a key and fills `{placeholders}`: t('hud.sol', { current: 1, total: 5 }). */
export function t(key: TranslationKey, values: Record<string, string | number> = {}): string {
  const template = dictionaries[currentLanguage][key];
  return template.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}
