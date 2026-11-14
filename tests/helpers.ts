import type { LocationConfig } from '../src/core/types';

export const TEST_LOCATION: LocationConfig = {
  id: 'test',
  order: 1,
  starsToUnlock: 0,
  samplesGoal: 2,
  challenge: { stat: 'oxygen', minimum: 30 },
  decayMultiplier: {},
};
