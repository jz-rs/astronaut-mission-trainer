import { describe, expect, it } from 'vitest';
import { RUN_BALANCE } from '../src/config/balance';
import { getLocation } from '../src/content/locations';
import { musicMood } from '../src/core/musicMood';
import { createRun } from '../src/core/run';
import type { ScheduledEvent } from '../src/core/types';

/** The windy night music plays only at night; anything else (storms, low bars) keeps it calm. */
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

  it('is the night music only after sunset', () => {
    const state = calmRun();
    state.solElapsedMs = RUN_BALANCE.solDurationMs * 0.99;
    expect(musicMood(state)).toBe('tense');
  });

  it('stays calm by day even with a storm or low bars', () => {
    const state = calmRun();
    state.events = [hitEvent('dust-storm', state.sol)];
    state.stats.oxygen = 10;
    expect(musicMood(state)).toBe('calm');
  });

  it('is calm again when a new sol starts', () => {
    const state = calmRun();
    state.sol += 1;
    state.solElapsedMs = 0;
    expect(musicMood(state)).toBe('calm');
  });
});
