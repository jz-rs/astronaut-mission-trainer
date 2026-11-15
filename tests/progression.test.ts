import { describe, expect, it } from 'vitest';
import {
  countTotalStars,
  findNewUnlocks,
  isLocationUnlocked,
  landingBlocker,
  starsMissing,
} from '../src/core/progression';
import { TEST_LOCATION } from './helpers';

const LOCKED = { ...TEST_LOCATION, id: 'locked', starsToUnlock: 4 };

describe('Mars map progression', () => {
  it('adds up the stars of every location', () => {
    expect(countTotalStars({ jezero: 3, gale: 1 })).toBe(4);
  });

  it('opens a location only with enough stars', () => {
    expect(isLocationUnlocked(TEST_LOCATION, 0)).toBe(true);
    expect(isLocationUnlocked(LOCKED, 3)).toBe(false);
    expect(starsMissing(LOCKED, 3)).toBe(1);
    expect(isLocationUnlocked(LOCKED, 4)).toBe(true);
  });

  it('celebrates each new location only once, and never the first one', () => {
    expect(findNewUnlocks([TEST_LOCATION, LOCKED], 4, [])).toEqual([LOCKED]);
    expect(findNewUnlocks([TEST_LOCATION, LOCKED], 4, ['locked'])).toEqual([]);
  });

  it('asks for the mission manual before any landing, then for the missing stars', () => {
    expect(landingBlocker(TEST_LOCATION, 0, false)).toBe('manual');
    expect(landingBlocker(LOCKED, 0, false)).toBe('manual');
    expect(landingBlocker(LOCKED, 3, true)).toBe('stars');
    expect(landingBlocker(LOCKED, 4, true)).toBeNull();
  });
});
