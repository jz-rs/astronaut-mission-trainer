import { RUN_BALANCE, STAT_DECAY_PER_SOL, TASK_BALANCE } from '../config/balance';
import { STAT_IDS, type LocationConfig, type StatId, type Stats, type TaskId } from './types';

export function clampStat(value: number): number {
  return Math.min(RUN_BALANCE.maxStatValue, Math.max(RUN_BALANCE.minStatValue, value));
}

export function createStartingStats(): Stats {
  return {
    oxygen: RUN_BALANCE.startingStatValue,
    food: RUN_BALANCE.startingStatValue,
    shield: RUN_BALANCE.startingStatValue,
    energy: RUN_BALANCE.startingStatValue,
  };
}

/** Stats drop continuously; the location decides how harsh each one is. */
export function applyDecay(stats: Stats, location: LocationConfig, deltaMs: number): void {
  const solFraction = deltaMs / RUN_BALANCE.solDurationMs;
  for (const statId of STAT_IDS) {
    const multiplier = location.decayMultiplier[statId] ?? 1;
    const drop = STAT_DECAY_PER_SOL[statId] * multiplier * solFraction;
    stats[statId] = clampStat(stats[statId] - drop);
  }
}

export function canAffordTask(stats: Stats, taskId: TaskId): boolean {
  return stats.energy >= TASK_BALANCE[taskId].energyCost;
}

export interface TaskEffect {
  gained: number;
  spent: number;
}

/** Applies the reward of a finished task, scaled by how well it was done, and says what changed. */
export function applyTaskResult(stats: Stats, taskId: TaskId, performance: number): TaskEffect {
  const { stat, gain, energyCost } = TASK_BALANCE[taskId];
  const energyBefore = stats.energy;
  stats.energy = clampStat(stats.energy - energyCost);
  const statBefore = stats[stat];
  stats[stat] = clampStat(stats[stat] + gain * performance);
  return { gained: stats[stat] - statBefore, spent: energyBefore - stats.energy };
}

export function updateLowestStats(lowest: Stats, current: Stats): void {
  for (const statId of STAT_IDS) {
    lowest[statId] = Math.min(lowest[statId], current[statId]);
  }
}

export function findEmptyStat(stats: Stats): StatId | undefined {
  return STAT_IDS.find((statId) => stats[statId] <= RUN_BALANCE.minStatValue);
}

export function averageStat(stats: Stats): number {
  const total = STAT_IDS.reduce((sum, statId) => sum + stats[statId], 0);
  return total / STAT_IDS.length;
}

/** Adds a change like { shield: -40 } to the stats (events, spec 14 and 16). */
export function applyStatChanges(stats: Stats, changes: Partial<Stats>, factor = 1): void {
  for (const statId of STAT_IDS) {
    stats[statId] = clampStat(stats[statId] + (changes[statId] ?? 0) * factor);
  }
}
