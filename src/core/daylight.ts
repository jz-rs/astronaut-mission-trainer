import { NIGHT_BALANCE, RUN_BALANCE } from '../config/balance';
import { canAffordTask } from './stats';
import type { RunState, TaskId } from './types';

/**
 * Day and night on Mars (pure rules, no drawing). Each sol starts at daylight; after half of it
 * night comes. Solar panels need the Sun: once it has set, nobody (kid or bot) can work on them,
 * like on the real missions, which charge batteries by day to get through the night.
 */
const SUNLIGHT_TASKS: readonly TaskId[] = ['solar-panels'];

/** 0 = full day, 1 = full night, from how much of the current sol has passed. */
export function nightAmount(solElapsedMs: number): number {
  const { nightStarts, fullNight } = NIGHT_BALANCE;
  const solFraction = solElapsedMs / RUN_BALANCE.solDurationMs;
  const progress = (solFraction - nightStarts) / (fullNight - nightStarts);
  return Math.min(1, Math.max(0, progress));
}

/** True when the task needs sunlight and the Sun has already set. */
export function isTooDarkFor(state: RunState, taskId: TaskId): boolean {
  if (!SUNLIGHT_TASKS.includes(taskId)) return false;
  return nightAmount(state.solElapsedMs) >= NIGHT_BALANCE.noSunFrom;
}

/** A task can start if there is energy for it and, for the panels, if there is Sun. */
export function canStartTask(state: RunState, taskId: TaskId): boolean {
  return canAffordTask(state.stats, taskId) && !isTooDarkFor(state, taskId);
}
