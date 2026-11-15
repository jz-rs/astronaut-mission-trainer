import { isAfterSunset } from './daylight';
import type { RunState } from './types';

/**
 * Which background music fits the base right now (pure rules, no sound). Calm most of the time;
 * tense when something is wrong, so the kid feels it before reading anything:
 *   - it is night (after sunset);
 *   - a storm or a failure hit during this sol, or Earth called a crisis meeting;
 *   - the crew must run to the shelter.
 * A new sol always starts calm: the night is over and the old storms are gone.
 */
export type MusicMood = 'calm' | 'tense';

export function musicMood(state: RunState): MusicMood {
  return isTroubleNow(state) ? 'tense' : 'calm';
}

function isTroubleNow(state: RunState): boolean {
  return (
    isAfterSunset(state) ||
    state.shelter !== null ||
    state.meeting !== null ||
    badEventHitThisSol(state)
  );
}

function badEventHitThisSol(state: RunState): boolean {
  return state.events.some(
    (event) => event.status === 'hit' && event.type !== 'good' && event.hitSol === state.sol,
  );
}
