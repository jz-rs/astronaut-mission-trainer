import { describe, expect, it } from 'vitest';
import { planAutoBotActions } from '../src/bots/autoPilot';
import { TASK_BALANCE } from '../src/config/balance';
import { getLocation } from '../src/content/locations';
import { applyAction } from '../src/core/actions';
import { createRun, PLAYER_ID, updateRun } from '../src/core/run';
import { calculateResult } from '../src/core/scoring';
import { canAffordTask } from '../src/core/stats';
import { TASK_IDS, type RunState, type TaskId } from '../src/core/types';

/**
 * ROADMAP "T5 — Balance" as tests: whole runs simulated with the real rules (no random events),
 * so a change in balance.ts that makes the game unwinnable, or too easy, fails here.
 */
const STEP_MS = 100;
/** A kid who is still learning: plays a minigame every 24 s (walk + play + read) and gets "Almost!". */
const LEARNING_KID = { everyMs: 24_000, performance: 0.5 };
/** Below this energy the player goes clean the panels first. */
const PLAYER_LOW_ENERGY = 30;

interface PlayerHabit {
  everyMs: number;
  performance: number;
}

function choosePlayerTask(state: RunState): TaskId | undefined {
  if (state.stats.energy < PLAYER_LOW_ENERGY) return 'solar-panels';
  const statOf = (taskId: TaskId) => state.stats[TASK_BALANCE[taskId].stat];
  const affordable = TASK_IDS.filter((taskId) => canAffordTask(state.stats, taskId));
  return affordable.sort((a, b) => statOf(a) - statOf(b))[0];
}

function simulateRun(locationId: string, player: PlayerHabit | null, botsOnAuto = true): RunState {
  const state = createRun(getLocation(locationId), {});
  for (const member of state.crew) member.autoMode = member.isBot && botsOnAuto;
  let elapsedMs = 0;
  while (state.status === 'playing') {
    for (const action of planAutoBotActions(state)) applyAction(state, action);
    updateRun(state, STEP_MS);
    elapsedMs += STEP_MS;
    if (player && elapsedMs % player.everyMs === 0) {
      const taskId = choosePlayerTask(state);
      if (taskId) {
        applyAction(state, {
          type: 'completeTask',
          crewId: PLAYER_ID,
          taskId,
          performance: player.performance,
        });
      }
    }
  }
  return state;
}

describe('balance (ROADMAP T5)', () => {
  it('loses before sol 3 in Jezero when nobody does anything', () => {
    const state = simulateRun('jezero', null, false);
    expect(state.status).toBe('evacuated');
    expect(state.sol).toBeLessThan(3);
  });

  it('is not enough to leave every bot on auto without playing', () => {
    expect(simulateRun('jezero', null).status).toBe('evacuated');
  });

  it('lets a kid who is still learning survive Jezero', () => {
    expect(simulateRun('jezero', LEARNING_KID).status).toBe('survived');
  });

  it('makes Gale harder than Jezero for the same kid', () => {
    const jezero = simulateRun('jezero', LEARNING_KID);
    const gale = simulateRun('gale', LEARNING_KID);
    expect(calculateResult(gale).score).toBeLessThan(calculateResult(jezero).score);
  });
});
