import { describe, expect, it } from 'vitest';
import { planAutoBotActions } from '../src/bots/autoPilot';
import { createRun } from '../src/core/run';
import { TEST_LOCATION } from './helpers';

describe('auto pilot', () => {
  it('sends the first idle bot to the lowest stat', () => {
    const state = createRun(TEST_LOCATION, {});
    state.stats.shield = 5;
    const [firstAction] = planAutoBotActions(state);
    expect(firstAction).toEqual({ type: 'assignTask', crewId: 'bot-red', taskId: 'shield-wall' });
  });

  it('never sends two bots to the same task', () => {
    const state = createRun(TEST_LOCATION, {});
    const taskIds = planAutoBotActions(state).map((action) =>
      action.type === 'assignTask' ? action.taskId : null,
    );
    expect(new Set(taskIds).size).toBe(taskIds.length);
  });

  it('ignores bots with auto mode off', () => {
    const state = createRun(TEST_LOCATION, {});
    for (const member of state.crew) member.autoMode = false;
    expect(planAutoBotActions(state)).toEqual([]);
  });
});
