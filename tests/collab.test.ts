import { describe, expect, it } from 'vitest';
import { COLLAB_BALANCE, RUN_BALANCE } from '../src/config/balance';
import { planAutoBotActions } from '../src/bots/autoPilot';
import { applyAction } from '../src/core/actions';
import { findWorstEvent } from '../src/core/events';
import { createRun, PLAYER_ID, updateRun } from '../src/core/run';
import type { ScheduledEvent } from '../src/core/types';
import { TEST_LOCATION } from './helpers';

const STORM: ScheduledEvent = {
  eventId: 'storm',
  type: 'solar-storm',
  effect: { shield: -40 },
  hitSol: 1,
  warningSol: null,
  status: 'pending',
};

function stormRun() {
  const state = createRun(TEST_LOCATION, {}, [{ ...STORM }]);
  state.solElapsedMs = RUN_BALANCE.solDurationMs / 2;
  updateRun(state, 1); // the storm lands and the lever emergency starts
  return state;
}

function dispatchBots(state: ReturnType<typeof createRun>) {
  for (const action of planAutoBotActions(state)) applyAction(state, action);
}

describe('lever for two', () => {
  it('starts an emergency instead of hitting right away', () => {
    const state = stormRun();
    expect(state.emergency?.eventId).toBe('storm');
  });

  it('holding it together leaves only a little damage', () => {
    const state = stormRun();
    const before = state.stats.shield;
    applyAction(state, { type: 'holdLever', crewId: PLAYER_ID, holding: true });
    updateRun(state, COLLAB_BALANCE.botLeverDelayMs);
    dispatchBots(state); // a bot on auto comes to hold the other side
    expect(state.emergency?.holders).toHaveLength(2);
    updateRun(state, COLLAB_BALANCE.leverHoldMs);
    expect(state.emergency).toBeNull();
    expect(state.eventNews.at(-1)?.kind).toBe('saved');
    expect(before - state.stats.shield).toBeLessThan(
      40 * COLLAB_BALANCE.leverSavedDamageFactor + 5,
    );
  });

  it('alone, the full storm hits when time runs out', () => {
    const state = stormRun();
    const before = state.stats.shield;
    applyAction(state, { type: 'holdLever', crewId: PLAYER_ID, holding: true });
    updateRun(state, COLLAB_BALANCE.leverWindowMs);
    expect(state.emergency).toBeNull();
    expect(before - state.stats.shield).toBeGreaterThanOrEqual(40);
  });
});

describe('crisis meeting', () => {
  const WARNED: ScheduledEvent = { ...STORM, hitSol: 2, warningSol: 1 };

  it('pauses the base while everyone votes, and bots vote with actions', () => {
    const state = createRun(TEST_LOCATION, {}, [{ ...WARNED }]);
    updateRun(state, 1);
    expect(state.meeting?.options).toEqual(['shield-wall', 'solar-panels']);
    const elapsed = state.solElapsedMs;
    updateRun(state, 1000);
    expect(state.solElapsedMs).toBe(elapsed);
    dispatchBots(state);
    expect(Object.keys(state.meeting?.votes ?? {})).toHaveLength(3);
  });

  it('the majority decides what bots on auto do first', () => {
    const state = createRun(TEST_LOCATION, {}, [{ ...WARNED }]);
    updateRun(state, 1);
    state.stats.energy = 10; // bots will vote for solar panels, the lowest bar
    dispatchBots(state);
    applyAction(state, { type: 'castVote', crewId: PLAYER_ID, taskId: 'shield-wall' });
    updateRun(state, 1);
    expect(state.meeting).toBeNull();
    expect(state.priority).toEqual({ taskId: 'solar-panels', untilSol: 2 });
  });
});

describe('result after teamwork', () => {
  it('does not blame a storm the crew stopped together', () => {
    const state = createRun(TEST_LOCATION, {}, [{ ...STORM }]);
    state.events.push({
      ...STORM,
      eventId: 'mold',
      type: 'equipment-failure',
      effect: { food: -25 },
    });
    state.solElapsedMs = RUN_BALANCE.solDurationMs / 2;
    updateRun(state, 1);
    applyAction(state, { type: 'holdLever', crewId: PLAYER_ID, holding: true });
    applyAction(state, { type: 'holdLever', crewId: 'bot-red', holding: true });
    updateRun(state, COLLAB_BALANCE.leverHoldMs);
    expect(findWorstEvent(state)).toBe('mold');
  });
});
