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
  /** Finishing a minigame early adds up to this bonus over 1.0 ... */
  speedBonusMax: 0.2,
  /** ... and the full bonus needs this fraction of the time still left. */
  fullBonusTimeLeftFraction: 0.5,
} as const;

export const PLACEHOLDER_MINIGAME_BALANCE = {
  tapsGoal: 5,
} as const;

/** A bar below this value blinks red, and so does its room (spec 04). */
export const ALERT_BALANCE = {
  lowStatThreshold: 30,
} as const;

export const SOLAR_PANELS_BALANCE = {
  dustCellSize: 10,
  brushRadius: 16,
  /** Dust cells that fall back per second for each point of difficulty above 1. */
  dustReturnPerSecond: 8,
} as const;

export const OXYGEN_FACTORY_BALANCE = {
  bubblesGoal: 6,
  bubblesOnScreen: 3,
  bubbleSpeed: 35,
  bubbleRadius: 22,
} as const;

export const GREENHOUSE_BALANCE = {
  columns: 3,
  rows: 2,
  thirstEveryMs: 1_300,
  thirstyForMs: 2_800,
  noWitheredBonus: 0.2,
} as const;

export const SCORING = {
  pointsPerAverageStatPoint: 10,
  pointsPerSample: 100,
} as const;
