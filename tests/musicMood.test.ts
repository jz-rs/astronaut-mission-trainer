import { describe, expect, it } from 'vitest';
import { ALERT_BALANCE, RUN_BALANCE } from '../src/config/balance';
import { getLocation } from '../src/content/locations';
import { musicMood } from '../src/core/musicMood';
import { createRun } from '../src/core/run';
import type { ScheduledEvent } from '../src/core/types';

/** The background music turns tense at night, in storms and failures, and when a bar is low. */
function calmRun() {
  return createRun(getLocation('jezero'), {});
}

function hitEvent(type: ScheduledEvent['type'], hitSol: number): ScheduledEvent {
  return { eventId: 'test', type, effect: {}, hitSol, warningSol: null, status: 'hit' };
}

describe('musicMood', () => {
  it('is calm at the start of a run', () => {
    expect(musicMood(calmRun())).toBe('calm');
  });

  it('is tense at night', () => {
    const state = calmRun();
    state.solElapsedMs = RUN_BALANCE.solDurationMs * 0.99;
    expect(musicMood(state)).toBe('tense');
  });

  it('is tense when a bar is low', () => {
    const state = calmRun();
    state.stats.oxygen = ALERT_BALANCE.lowStatThreshold - 1;
    expect(musicMood(state)).toBe('tense');
  });

  it('is tense in the sol a storm hits, but not for good news or an old storm', () => {
    const state = calmRun();
    state.events = [hitEvent('dust-storm', state.sol)];
    expect(musicMood(state)).toBe('tense');
    state.events = [hitEvent('good', state.sol), hitEvent('solar-storm', state.sol - 1)];
    expect(musicMood(state)).toBe('calm');
  });
});
