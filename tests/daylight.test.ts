import { describe, expect, it } from 'vitest';
import { planAutoBotActions } from '../src/bots/autoPilot';
import { NIGHT_BALANCE, RUN_BALANCE } from '../src/config/balance';
import { getLocation } from '../src/content/locations';
import { canStartTask, isTooDarkFor, nightAmount } from '../src/core/daylight';
import { createRun } from '../src/core/run';

/** Day and night: the panels need the Sun, for the kid and for the bots alike. */
const solMs = RUN_BALANCE.solDurationMs;

function runAt(solFraction: number) {
  const state = createRun(getLocation('jezero'), {});
  state.solElapsedMs = solMs * solFraction;
  return state;
}

describe('daylight', () => {
  it('is full day in the first half of the sol and full night near its end', () => {
    expect(nightAmount(0)).toBe(0);
    expect(nightAmount(solMs * NIGHT_BALANCE.nightStarts)).toBe(0);
    expect(nightAmount(solMs * NIGHT_BALANCE.fullNight)).toBe(1);
    expect(nightAmount(solMs)).toBe(1);
  });

  it('lets the panels be cleaned by day and at dusk, but not after sunset', () => {
    expect(canStartTask(runAt(0.2), 'solar-panels')).toBe(true);
    expect(isTooDarkFor(runAt(0.6), 'solar-panels')).toBe(false);
    expect(canStartTask(runAt(0.95), 'solar-panels')).toBe(false);
  });

  it('only blocks tasks that need the Sun', () => {
    expect(canStartTask(runAt(0.95), 'oxygen-factory')).toBe(true);
  });

  it('keeps bots on auto away from the panels at night', () => {
    const botTasksAt = (solFraction: number) => {
      const state = runAt(solFraction);
      state.stats.energy = 5; // the panels are the most urgent task
      for (const member of state.crew) member.autoMode = member.isBot;
      return planAutoBotActions(state).map((action) =>
        action.type === 'assignTask' ? action.taskId : null,
      );
    };
    expect(botTasksAt(0.2)).toContain('solar-panels');
    expect(botTasksAt(0.95)).not.toContain('solar-panels');
  });
});
