import { NIGHT_BALANCE, RUN_BALANCE } from '../config/balance';
import { canAffordTask } from './stats';
import type { RunState, TaskId } from './types';

/**
 * Day and night on Mars (pure rules, no drawing). Each sol starts at daylight; after half of it
 * night comes. Solar panels need the Sun: nobody (kid or bot) is ever in that room after sunset,
 * like on the real missions, which charge batteries by day to get through the night. So a task
 * can only start if it will be over before the Sun sets.
 */
const SUNLIGHT_TASKS: readonly TaskId[] = ['solar-panels'];

/** 0 = full day, 1 = full night, from how much of the current sol has passed. */
export function nightAmount(solElapsedMs: number): number {
  const { nightStarts, fullNight } = NIGHT_BALANCE;
  const solFraction = solElapsedMs / RUN_BALANCE.solDurationMs;
  const progress = (solFraction - nightStarts) / (fullNight - nightStarts);
  return Math.min(1, Math.max(0, progress));
}

/** Time into the sol when the Sun sets (night reaches `noSunFrom`). */
export function sunsetMs(): number {
  const { nightStarts, fullNight, noSunFrom } = NIGHT_BALANCE;
  return RUN_BALANCE.solDurationMs * (nightStarts + noSunFrom * (fullNight - nightStarts));
}

export function isAfterSunset(state: RunState): boolean {
  return state.solElapsedMs >= sunsetMs();
}

/**
 * True when the task needs sunlight and `workMs` from now the Sun will have set: whoever went
 * would still be there at night.
 */
export function isTooDarkFor(state: RunState, taskId: TaskId, workMs = 0): boolean {
  if (!SUNLIGHT_TASKS.includes(taskId)) return false;
  return state.solElapsedMs + workMs >= sunsetMs();
}

/** A task can start if there is energy for it and, for the panels, if it ends before sunset. */
export function canStartTask(state: RunState, taskId: TaskId, workMs = 0): boolean {
  return canAffordTask(state.stats, taskId) && !isTooDarkFor(state, taskId, workMs);
}

/** At sunset any bot still on a sunlight task stops and goes back in (it gets nothing). */
export function sendBotsInAtSunset(state: RunState): void {
  if (!isAfterSunset(state)) return;
  for (const member of state.crew) {
    if (member.isBot && member.task && SUNLIGHT_TASKS.includes(member.task.taskId)) {
      member.task = null;
    }
  }
}
