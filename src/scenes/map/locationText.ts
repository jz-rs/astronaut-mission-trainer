import { t, type TranslationKey } from '../../i18n';

/**
 * Location ids come from data/locations.json, so TypeScript cannot check their keys;
 * tests/content.test.ts checks that every location has its texts.
 */
export function locationText(locationId: string, field: 'name' | 'why'): string {
  return t(`location.${locationId}.${field}` as TranslationKey);
}
