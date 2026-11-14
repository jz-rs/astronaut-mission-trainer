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

/** Spec 14 — Things Mars throws at the base, based on real events (data/events.json). */
export const EVENT_TYPES = ['solar-storm', 'dust-storm', 'equipment-failure', 'good'] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export interface MarsEvent {
  id: string;
  type: EventType;
  locations: string[];
  /** 0 = arrives without warning; 1 = Earth warns one sol before. One is picked per run. */
  warningSolsBefore: number[];
  effect: Partial<Stats>;
  source: string;
  realDate: string | null;
}

export interface ScheduledEvent {
  eventId: string;
  type: EventType;
  effect: Partial<Stats>;
  hitSol: number;
  warningSol: number | null;
  status: 'pending' | 'warned' | 'hit';
}

/** What just happened, in order, so scenes can announce each thing once. */
export interface EventNews {
  kind: 'warning' | 'hit';
  eventId: string;
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
  events: ScheduledEvent[];
  eventNews: EventNews[];
  /** Spec 15 — true while the rover is out collecting samples. */
  roverOut: boolean;
}
