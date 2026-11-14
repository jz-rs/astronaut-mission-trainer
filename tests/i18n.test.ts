import { describe, expect, it } from 'vitest';
import en from '../src/i18n/en.json';
import es from '../src/i18n/es.json';
import { setLanguage, t } from '../src/i18n';

describe('translations', () => {
  it('English has exactly the same keys as Spanish', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(es).sort());
  });

  it('fills placeholders', () => {
    setLanguage('en');
    expect(t('hud.sol', { current: 2, total: 5 })).toBe('Sol 2/5');
  });
});
