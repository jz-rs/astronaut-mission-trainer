import { ROVER_BALANCE } from '../config/balance';
import { clampStat } from './stats';
import type { RunState } from './types';

/**
 * Spec 15 — Risking energy for points: the rover leaves the base (paying energy up front)
 * while the base keeps running, and comes back with samples.
 */
export function canStartExpedition(state: RunState): boolean {
  return !state.roverOut && state.stats.energy >= ROVER_BALANCE.energyCost;
}

export function startExpedition(state: RunState): void {
  if (!canStartExpedition(state)) return;
  state.stats.energy = clampStat(state.stats.energy - ROVER_BALANCE.energyCost);
  state.roverOut = true;
}

export function completeExpedition(state: RunState, samples: number): void {
  if (!state.roverOut) return;
  state.roverOut = false;
  state.samples += Math.max(0, Math.floor(samples));
}
