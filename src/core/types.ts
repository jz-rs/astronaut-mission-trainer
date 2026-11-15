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
  /** Share of the effect that really hit (less than 1 when the crew did the right thing, spec 16). */
  damageFactor?: number;
  /**
   * What the crisis meeting decided (spec 16). Missing = there was no meeting;
   * null = time ran out and nobody chose.
   */
  crisisChoice?: CrisisProcedureId | null;
  /** Solar storms only: whether the people playing got into the shelter in time (spec 16). */
  crewSheltered?: boolean;
}

/** What just happened, in order, so scenes can announce each thing once. */
export interface EventNews {
  /** 'decided' = the crisis meeting ended and its choice is in the event (spec 16). */
  kind: 'warning' | 'decided' | 'hit';
  eventId: string;
}

/** A finished task, so scenes can show what it changed ("+30 oxygen, -10 energy"). */
export interface TaskNews {
  crewId: string;
  taskId: TaskId;
  /** Points the task's bar really went up (less near the top of the bar). */
  gained: number;
  /** Energy points really spent. */
  spent: number;
}

/** Spec 16 — Real procedures the crew can vote for when Earth warns of a crisis. */
export const CRISIS_PROCEDURE_IDS = [
  'shelter',
  'go-outside',
  'save-energy',
  'clean-panels',
] as const;
export type CrisisProcedureId = (typeof CRISIS_PROCEDURE_IDS)[number];

/** Spec 16 — When Earth warns of a crisis, the crew votes what to do. The base is paused. */
export interface CrisisMeeting {
  eventId: string;
  options: [CrisisProcedureId, CrisisProcedureId];
  votes: Record<string, CrisisProcedureId>;
  /** Counts the message arriving first, then the vote (COLLAB_BALANCE). */
  remainingMs: number;
}

/** Spec 16 — A solar storm landed: the crew has a few seconds to get into the shielded room. */
export interface ShelterEmergency {
  eventId: string;
  elapsedMs: number;
  sheltered: string[];
}

/** What bots on auto do first until the end of a sol (the meeting's decision). */
export interface PriorityOrder {
  taskId: TaskId;
  untilSol: number;
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
  /** Every finished task, in order, so the base can show its effect on the bars. */
  taskNews: TaskNews[];
  /** Spec 15 — true while the rover is out collecting samples. */
  roverOut: boolean;
  shelter: ShelterEmergency | null;
  meeting: CrisisMeeting | null;
  priority: PriorityOrder | null;
}
