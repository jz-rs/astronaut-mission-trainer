import { CREW_BALANCE } from '../config/balance';
import type { TaskId, TrainingLevels } from './types';

/**
 * Bots learn from the player: their efficiency on a task is the player's best
 * performance on it, but never worse than an untrained bot.
 */
export function getBotEfficiency(training: TrainingLevels, taskId: TaskId): number {
  const bestPlayerPerformance = training[taskId] ?? 0;
  return Math.max(CREW_BALANCE.untrainedBotEfficiency, bestPlayerPerformance);
}

export function clampPerformance(performance: number): number {
  return Math.min(CREW_BALANCE.maxPerformance, Math.max(0, performance));
}

/** Returns new training levels if this result beats the previous best. */
export function recordPerformance(
  training: TrainingLevels,
  taskId: TaskId,
  performance: number,
): TrainingLevels {
  const previousBest = training[taskId] ?? 0;
  if (performance <= previousBest) return training;
  return { ...training, [taskId]: clampPerformance(performance) };
}
