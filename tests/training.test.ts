import { describe, expect, it } from 'vitest';
import { CREW_BALANCE } from '../src/config/balance';
import { getBotEfficiency, recordPerformance } from '../src/core/training';

describe('bot training', () => {
  it('untrained bots use the base efficiency', () => {
    expect(getBotEfficiency({}, 'solar-panels')).toBe(CREW_BALANCE.untrainedBotEfficiency);
  });

  it('bots learn from the best player performance', () => {
    const training = recordPerformance({}, 'solar-panels', 1.1);
    expect(getBotEfficiency(training, 'solar-panels')).toBe(1.1);
  });

  it('a worse result does not lower the training', () => {
    const training = recordPerformance({ greenhouse: 0.9 }, 'greenhouse', 0.5);
    expect(training.greenhouse).toBe(0.9);
  });
});
