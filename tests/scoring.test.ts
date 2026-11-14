import { describe, expect, it } from 'vitest';
import { createRun } from '../src/core/run';
import { calculateResult, countStars } from '../src/core/scoring';
import { TEST_LOCATION } from './helpers';

describe('scoring', () => {
  it('gives all three stars for a perfect run', () => {
    const state = createRun(TEST_LOCATION, {});
    state.status = 'survived';
    state.samples = TEST_LOCATION.samplesGoal;
    expect(countStars(calculateResult(state).stars)).toBe(3);
  });

  it('loses the challenge star if the stat ever dropped below the minimum', () => {
    const state = createRun(TEST_LOCATION, {});
    state.lowestStats.oxygen = TEST_LOCATION.challenge.minimum - 1;
    expect(calculateResult(state).stars.challengeCompleted).toBe(false);
  });
});
