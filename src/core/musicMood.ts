import { ALERT_BALANCE } from '../config/balance';
import { isAfterSunset } from './daylight';
import { STAT_IDS, type RunState } from './types';

/**
 * Which background music fits the base right now (pure rules, no sound). Calm most of the time;
 * tense when something is wrong, so the kid feels it before reading anything:
 *   - it is night (after sunset);
 *   - a storm or a failure hit during this sol, or Earth called a crisis meeting;
 *   - the crew must run to the shelter;
 *   - a bar is low (the same red blink as the rooms).
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
    badEventHitThisSol(state) ||
    STAT_IDS.some((stat) => state.stats[stat] < ALERT_BALANCE.lowStatThreshold)
  );
}

function badEventHitThisSol(state: RunState): boolean {
  return state.events.some(
    (event) => event.status === 'hit' && event.type !== 'good' && event.hitSol === state.sol,
  );
}
