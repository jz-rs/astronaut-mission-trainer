import { countStars, type RunResult } from '../core/scoring';
import { recordPerformance } from '../core/training';
import type { TaskId } from '../core/types';
import { loadProgress, saveProgress } from './progressStorage';

/** The player's best minigame result becomes the bots' training for that task. */
export function recordMinigameResult(taskId: TaskId, performance: number): void {
  const progress = loadProgress();
  saveProgress({
    ...progress,
    training: recordPerformance(progress.training, taskId, performance),
  });
}

/** Keeps the best score and the most stars ever earned on each location. */
export function recordRunResult(locationId: string, result: RunResult): void {
  const progress = loadProgress();
  const previousScore = progress.bestScoreByLocation[locationId] ?? 0;
  const previousStars = progress.starsByLocation[locationId] ?? 0;
  saveProgress({
    ...progress,
    bestScoreByLocation: {
      ...progress.bestScoreByLocation,
      [locationId]: Math.max(previousScore, result.score),
    },
    starsByLocation: {
      ...progress.starsByLocation,
      [locationId]: Math.max(previousStars, countStars(result.stars)),
    },
  });
}
