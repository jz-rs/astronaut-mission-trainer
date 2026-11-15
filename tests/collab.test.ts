import { describe, expect, it } from 'vitest';
import { COLLAB_BALANCE, RUN_BALANCE } from '../src/config/balance';
import { planAutoBotActions } from '../src/bots/autoPilot';
import { applyAction } from '../src/core/actions';
import { findWorstEvent } from '../src/core/events';
import { createRun, PLAYER_ID, updateRun } from '../src/core/run';
import type { RunState, ScheduledEvent } from '../src/core/types';
import { TEST_LOCATION } from './helpers';

const SOLAR_STORM: ScheduledEvent = {
  eventId: 'storm',
  type: 'solar-storm',
  effect: { shield: -40 },
  hitSol: 1,
  warningSol: null,
  status: 'pending',
};
const WARNED_STORM: ScheduledEvent = { ...SOLAR_STORM, hitSol: 2, warningSol: 1 };
const WARNED_DUST: ScheduledEvent = {
  ...WARNED_STORM,
  eventId: 'dust',
  type: 'dust-storm',
  effect: { energy: -40 },
};

function dispatchBots(state: RunState) {
  for (const action of planAutoBotActions(state)) applyAction(state, action);
}

/** Starts a run whose warned event opens the meeting, and skips the message from Earth. */
function meetingRun(event: ScheduledEvent): RunState {
  const state = createRun(TEST_LOCATION, {}, [{ ...event }]);
  updateRun(state, 1);
  updateRun(state, COLLAB_BALANCE.meetingIntroMs);
  return state;
}

function vote(
  state: RunState,
  procedureId: 'shelter' | 'go-outside' | 'save-energy' | 'clean-panels',
) {
  applyAction(state, { type: 'castVote', crewId: PLAYER_ID, procedureId });
  dispatchBots(state);
  updateRun(state, 1);
}

/** Moves the clock to the moment the event lands on its sol. */
function landEventNow(state: RunState) {
  state.sol = state.events[0]?.hitSol ?? 1;
  state.solElapsedMs = RUN_BALANCE.solDurationMs / 2;
  updateRun(state, 1);
}

describe('crisis meeting', () => {
  it('offers the real procedure and a wrong idea, and pauses the base', () => {
    const state = meetingRun(WARNED_STORM);
    expect([...(state.meeting?.options ?? [])].sort()).toEqual(['go-outside', 'shelter']);
    const elapsed = state.solElapsedMs;
    updateRun(state, 1000);
    expect(state.solElapsedMs).toBe(elapsed);
  });

  it('nobody can vote while the message from Earth is still arriving', () => {
    const state = createRun(TEST_LOCATION, {}, [{ ...WARNED_STORM }]);
    updateRun(state, 1);
    applyAction(state, { type: 'castVote', crewId: PLAYER_ID, procedureId: 'shelter' });
    expect(state.meeting?.votes).toEqual({});
  });

  it('bots vote the same as the player, right after the player', () => {
    const state = meetingRun(WARNED_STORM);
    dispatchBots(state);
    expect(state.meeting?.votes).toEqual({});
    vote(state, 'go-outside');
    expect(state.meeting).toBeNull();
    expect(state.events[0]?.crisisChoice).toBe('go-outside');
    expect(state.eventNews.at(-1)?.kind).toBe('decided');
  });

  it('the right procedure softens the event and sets what bots do first', () => {
    const state = meetingRun(WARNED_DUST);
    vote(state, 'save-energy');
    expect(state.priority).toBeNull(); // saving energy means no extra trips
    const before = state.stats.energy;
    landEventNow(state);
    expect(before - state.stats.energy).toBeLessThanOrEqual(
      40 * COLLAB_BALANCE.rightChoiceDamageFactor + 1,
    );
  });

  it('a wrong idea leaves the full damage and sends bots to that task', () => {
    const state = meetingRun(WARNED_DUST);
    vote(state, 'clean-panels');
    expect(state.priority).toEqual({ taskId: 'solar-panels', untilSol: 2 });
    const before = state.stats.energy;
    landEventNow(state);
    expect(before - state.stats.energy).toBeGreaterThanOrEqual(39);
  });

  it('if time runs out nobody chose', () => {
    const state = meetingRun(WARNED_DUST);
    updateRun(state, COLLAB_BALANCE.meetingVoteMs);
    expect(state.meeting).toBeNull();
    expect(state.events[0]?.crisisChoice).toBeNull();
  });
});

describe('shelter during a solar storm', () => {
  function stormRun() {
    const state = createRun(TEST_LOCATION, {}, [{ ...SOLAR_STORM }]);
    landEventNow(state);
    return state;
  }

  it('starts instead of hitting right away, and the base keeps running', () => {
    const state = stormRun();
    expect(state.shelter?.eventId).toBe('storm');
    const elapsed = state.solElapsedMs;
    updateRun(state, 100);
    expect(state.solElapsedMs).toBeGreaterThan(elapsed);
  });

  it('getting in with the crew leaves only part of the damage', () => {
    const state = stormRun();
    applyAction(state, { type: 'enterShelter', crewId: PLAYER_ID });
    updateRun(state, COLLAB_BALANCE.botShelterDelayMs);
    dispatchBots(state); // bots walk in by themselves
    updateRun(state, 1);
    expect(state.shelter).toBeNull();
    expect(state.events[0]?.crewSheltered).toBe(true);
    // The bars keep decaying while the crew walks in, so compare the storm's share, not the bar.
    expect(state.events[0]?.damageFactor).toBe(COLLAB_BALANCE.shelterDamageFactor);
  });

  it('staying outside, the full storm hits when time runs out', () => {
    const state = stormRun();
    const before = state.stats.shield;
    updateRun(state, COLLAB_BALANCE.shelterWindowMs);
    expect(state.shelter).toBeNull();
    expect(state.events[0]?.crewSheltered).toBe(false);
    expect(before - state.stats.shield).toBeGreaterThanOrEqual(40);
  });

  it('the right vote and the shelter add up', () => {
    const state = meetingRun(WARNED_STORM);
    vote(state, 'shelter');
    landEventNow(state);
    applyAction(state, { type: 'enterShelter', crewId: PLAYER_ID });
    updateRun(state, COLLAB_BALANCE.shelterWindowMs);
    const factor = COLLAB_BALANCE.rightChoiceDamageFactor * COLLAB_BALANCE.shelterDamageFactor;
    expect(state.events[0]?.damageFactor).toBe(factor);
  });
});

describe('result after teamwork', () => {
  it('does not blame a storm the crew stopped together', () => {
    const state = createRun(TEST_LOCATION, {}, [{ ...SOLAR_STORM }]);
    state.events.push({
      ...SOLAR_STORM,
      eventId: 'mold',
      type: 'equipment-failure',
      effect: { food: -25 },
    });
    landEventNow(state);
    applyAction(state, { type: 'enterShelter', crewId: PLAYER_ID });
    updateRun(state, COLLAB_BALANCE.shelterWindowMs);
    expect(findWorstEvent(state)).toBe('mold');
  });
});
