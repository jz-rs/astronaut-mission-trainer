import { describe, expect, it } from 'vitest';
import { SCORING } from '../src/config/balance';
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

  it('scores average health x10 plus 100 per sample', () => {
    const state = createRun(TEST_LOCATION, {});
    state.stats = { oxygen: 40, food: 60, shield: 80, energy: 20 };
    state.samples = 3;
    const expected = 50 * SCORING.pointsPerAverageStatPoint + 3 * SCORING.pointsPerSample;
    expect(calculateResult(state).score).toBe(expected);
  });

  it('gives the survival star only when the base survived', () => {
    const state = createRun(TEST_LOCATION, {});
    state.status = 'evacuated';
    expect(calculateResult(state).stars.survived).toBe(false);
    state.status = 'survived';
    expect(calculateResult(state).stars.survived).toBe(true);
  });

  it('gives the samples star only when the goal is reached', () => {
    const state = createRun(TEST_LOCATION, {});
    state.samples = TEST_LOCATION.samplesGoal - 1;
    expect(calculateResult(state).stars.samplesGoalReached).toBe(false);
    state.samples = TEST_LOCATION.samplesGoal;
    expect(calculateResult(state).stars.samplesGoalReached).toBe(true);
  });
});
