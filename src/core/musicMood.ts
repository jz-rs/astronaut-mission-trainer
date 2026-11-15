import { isAfterSunset } from './daylight';
import type { RunState } from './types';

/**
 * Which background music fits the base right now (pure rules, no sound): the calm one by day,
 * the windy night one only after sunset. A new sol always starts calm.
 */
export type MusicMood = 'calm' | 'tense';

export function musicMood(state: RunState): MusicMood {
  return isAfterSunset(state) ? 'tense' : 'calm';
}
