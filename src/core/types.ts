/**
 * Shared domain types for a single run (one landing on one Mars location).
 * This folder must never import Phaser: it is pure game logic.
 */

export const STAT_IDS = ['oxygen', 'food', 'shield', 'energy'] as const;
export type StatId = (typeof STAT_IDS)[number];
export type Stats = Record<StatId, number>;

export const TASK_IDS = ['oxygen-factory', 'solar-panels', 'greenhouse', 'shield-wall'] as const;
export type TaskId = (typeof TASK_IDS)[number];

/** Best performance the player achieved per task. Bots learn from it. */
export type TrainingLevels = Partial<Record<TaskId, number>>;

export interface CrewTask {
  taskId: TaskId;
  remainingMs: number;
}

export interface CrewMember {
  id: string;
  isBot: boolean;
  autoMode: boolean;
  task: CrewTask | null;
}

export type RunStatus = 'playing' | 'survived' | 'evacuated';

export interface LocationChallenge {
  stat: StatId;
  minimum: number;
}

export interface LocationConfig {
  id: string;
  order: number;
  starsToUnlock: number;
  samplesGoal: number;
  challenge: LocationChallenge;
  /** Multiplies the base decay of each stat. 1 = normal, 2 = twice as fast. */
  decayMultiplier: Partial<Stats>;
}

export interface RunState {
  location: LocationConfig;
  training: TrainingLevels;
  sol: number;
  solElapsedMs: number;
  stats: Stats;
  /** Lowest value each stat reached during the run. Used for the location challenge star. */
  lowestStats: Stats;
  crew: CrewMember[];
  samples: number;
  status: RunStatus;
}
