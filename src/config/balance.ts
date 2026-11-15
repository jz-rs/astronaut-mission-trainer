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

/**
 * Day and night on Mars: when the sol bar passes `nightStarts`, the base and the rooms get darker
 * until `fullNight`; the next sol starts at daylight again.
 */
export const NIGHT_BALANCE = {
  nightStarts: 0.5,
  fullNight: 0.9,
  /** How dark full night gets on top of the violet tint (0 = no change, 1 = black). */
  maxShade: 0.3,
  /**
   * From this much night on (0 to 1) the Sun has set: the solar panels can't be worked on until
   * the next sol. 0.75 = the last 20 % of each sol.
   */
  noSunFrom: 0.75,
} as const;

/**
 * How much each stat drops during one full sol, before location multipliers.
 * Tuned with tests/balance.test.ts (ROADMAP T5): a kid still learning survives Jezero,
 * but bots alone are not enough.
 */
export const STAT_DECAY_PER_SOL: Stats = {
  oxygen: 45,
  food: 35,
  shield: 40,
  energy: 22,
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
  /** The result card waits this long before showing GO ON, so fast taps don't skip the fact. */
  factMinDisplayMs: 800,
  /** ... and continues alone after this, because the base keeps running behind it. */
  factMaxDisplayMs: 12_000,
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

/** The guided first sol (TutorialGuide): how long each explanation arrow stays. */
export const TUTORIAL_BALANCE = {
  explainStepMs: 4_000,
} as const;

/** A bar below this value blinks red, and so does its room (spec 04). */
export const ALERT_BALANCE = {
  lowStatThreshold: 30,
  /** Below this the base map already looks worried (thirsty plants, dusty panels). */
  worriedStatThreshold: 55,
} as const;

export const SOLAR_PANELS_BALANCE = {
  dustCellSize: 10,
  brushRadius: 16,
  /** Dust cells that fall back per second for each point of difficulty above 1. */
  dustReturnPerSecond: 8,
  /** Energy bolts a spotless panel sends to the battery per second (a dusty one sends none). */
  boltsPerSecond: 1.5,
  /** Share of sunlight still coming through the window at full night (bolts and rays). */
  nightLight: 0.25,
  /** From this much night on, the mission says it is getting dark. */
  nightWarning: 0.3,
} as const;

export const OXYGEN_FACTORY_BALANCE = {
  /** O₂ molecules to fill the tank: each one needs 2 CO₂ split in MOXIE. */
  oxygenGoal: 3,
  moleculesOnScreen: 3,
  moleculeSpeed: 30,
  atomRadius: 11,
} as const;

export const GREENHOUSE_BALANCE = {
  columns: 3,
  rows: 2,
  thirstEveryMs: 1_300,
  thirstyForMs: 2_800,
  noWitheredBonus: 0.2,
} as const;

export const SHIELD_WALL_BALANCE = {
  wallSlots: 10,
  holes: 4,
  maxHoles: 6,
  snapDistance: 40,
} as const;

/** Spec 14 — How many real events hit each run, and when. */
export const EVENT_BALANCE = {
  minEventsPerRun: 2,
  maxEventsPerRun: 3,
  /** Sol 1 is calm so the player can learn the base first. */
  firstEventSol: 2,
  /** Events land in the middle of their sol. */
  hitAtSolFraction: 0.5,
} as const;

/** Spec 15 — The rover trip: costly in energy, the only way to get samples. */
export const ROVER_BALANCE = {
  energyCost: 20,
  durationMs: 15_000,
  resultDisplayMs: 3_000,
  lanes: 3,
  scrollSpeedPxPerSecond: 90,
  spawnEveryMs: 800,
  /** Share of spawned things that are shiny samples instead of rocks. */
  sampleChance: 0.45,
  samplesLostPerRock: 1,
  rockStunMs: 600,
} as const;

/** Spec 16 — Teamwork moments. Set the flags to false to turn them off if they are not polished. */
export const COLLAB_BALANCE = {
  leverEnabled: true,
  meetingEnabled: true,
  leverHoldersNeeded: 2,
  leverHoldMs: 3_000,
  leverWindowMs: 12_000,
  /** Time a bot takes to walk to the lever before it can hold it. */
  botLeverDelayMs: 2_500,
  /** Holding the lever together leaves only this share of the storm damage. */
  leverSavedDamageFactor: 0.25,
  meetingVoteMs: 10_000,
} as const;

export const SCORING = {
  pointsPerAverageStatPoint: 10,
  pointsPerSample: 100,
} as const;
