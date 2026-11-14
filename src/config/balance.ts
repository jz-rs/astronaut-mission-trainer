import type { StatId, Stats, TaskId } from '../core/types';

/**
 * Every gameplay number lives here, so balancing the game never requires touching logic.
 * Units: stats go from 0 to 100, time is in milliseconds.
 */

export const RUN_BALANCE = {
  solDurationMs: 60_000,
  solsPerRun: 5,
  startingStatValue: 70,
  maxStatValue: 100,
  minStatValue: 0,
} as const;

/** How much each stat drops during one full sol, before location multipliers. */
export const STAT_DECAY_PER_SOL: Stats = {
  oxygen: 60,
  food: 45,
  shield: 50,
  energy: 25,
};

export interface TaskBalance {
  stat: StatId;
  /** Stat points gained with a performance of 1.0 (a "good" result). */
  gain: number;
  energyCost: number;
}

export const TASK_BALANCE: Record<TaskId, TaskBalance> = {
  'oxygen-factory': { stat: 'oxygen', gain: 30, energyCost: 10 },
  'solar-panels': { stat: 'energy', gain: 35, energyCost: 0 },
  greenhouse: { stat: 'food', gain: 30, energyCost: 10 },
  'shield-wall': { stat: 'shield', gain: 30, energyCost: 10 },
};

export const CREW_BALANCE = {
  botCount: 3,
  botTaskDurationMs: 20_000,
  /** Bots start at this efficiency and improve as the player sets better scores. */
  untrainedBotEfficiency: 0.6,
  /** A perfect minigame gives a bonus above 1.0. */
  maxPerformance: 1.2,
} as const;

export const MINIGAME_BALANCE = {
  durationMs: 12_000,
  resultDisplayMs: 1_800,
  perfectThreshold: 1.1,
  goodThreshold: 0.7,
} as const;

export const SCORING = {
  pointsPerAverageStatPoint: 10,
  pointsPerSample: 100,
} as const;
