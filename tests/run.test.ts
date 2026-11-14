import { describe, expect, it } from 'vitest';
import { CREW_BALANCE, RUN_BALANCE, TASK_BALANCE } from '../src/config/balance';
import { applyAction } from '../src/core/actions';
import { createRun, PLAYER_ID, updateRun } from '../src/core/run';
import { TEST_LOCATION } from './helpers';

describe('run simulation', () => {
  it('drops stats over time', () => {
    const state = createRun(TEST_LOCATION, {});
    updateRun(state, RUN_BALANCE.solDurationMs / 2);
    expect(state.stats.oxygen).toBeLessThan(RUN_BALANCE.startingStatValue);
  });

  it('applies location decay multipliers', () => {
    const harshLocation = { ...TEST_LOCATION, decayMultiplier: { energy: 2 } };
    const normal = createRun(TEST_LOCATION, {});
    const harsh = createRun(harshLocation, {});
    updateRun(normal, 1000);
    updateRun(harsh, 1000);
    expect(harsh.stats.energy).toBeLessThan(normal.stats.energy);
  });

  it('evacuates the crew when any stat reaches zero', () => {
    const state = createRun(TEST_LOCATION, {});
    state.stats.food = 0.01;
    updateRun(state, 1000);
    expect(state.status).toBe('evacuated');
  });

  it('survives after the last sol ends', () => {
    const state = createRun(TEST_LOCATION, {});
    state.sol = RUN_BALANCE.solsPerRun;
    state.stats = { oxygen: 100, food: 100, shield: 100, energy: 100 };
    updateRun(state, RUN_BALANCE.solDurationMs);
    expect(state.status).toBe('survived');
  });

  it('rewards the player and charges energy when a task is completed', () => {
    const state = createRun(TEST_LOCATION, {});
    const { gain, energyCost } = TASK_BALANCE.greenhouse;
    applyAction(state, {
      type: 'completeTask',
      crewId: PLAYER_ID,
      taskId: 'greenhouse',
      performance: 1,
    });
    expect(state.stats.food).toBe(RUN_BALANCE.startingStatValue + gain);
    expect(state.stats.energy).toBe(RUN_BALANCE.startingStatValue - energyCost);
  });

  it('lets a bot finish its task after the bot task duration', () => {
    const state = createRun(TEST_LOCATION, {});
    state.stats.oxygen = 10;
    applyAction(state, { type: 'assignTask', crewId: 'bot-red', taskId: 'oxygen-factory' });
    updateRun(state, CREW_BALANCE.botTaskDurationMs);
    expect(state.crew.find((member) => member.id === 'bot-red')?.task).toBeNull();
    expect(state.stats.oxygen).toBeGreaterThan(10);
  });
});
