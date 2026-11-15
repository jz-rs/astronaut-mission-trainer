import { COLLAB_BALANCE } from '../config/balance';
import { choiceDamageFactor } from './collab';
import { landEvent } from './eventDamage';
import type { RunState, ScheduledEvent, ShelterEmergency } from './types';

/**
 * Spec 16 — When a solar storm lands, real crews hide in the most shielded place (Orion builds a
 * shelter with its supplies, the ISS crew moves to its most protected modules). The crew has a few
 * seconds to get into the shield room; the storm hits when everyone is in or time runs out, and
 * it hits softer if the people playing made it in. Entering is a GameAction, like everything else.
 */
export function shouldStartShelter(event: ScheduledEvent, state: RunState): boolean {
  return COLLAB_BALANCE.shelterEnabled && event.type === 'solar-storm' && !state.shelter;
}

export function startShelter(state: RunState, event: ScheduledEvent): void {
  state.shelter = { eventId: event.eventId, elapsedMs: 0, sheltered: [] };
}

export function enterShelter(state: RunState, crewId: string): void {
  const shelter = state.shelter;
  if (!shelter || shelter.sheltered.includes(crewId)) return;
  shelter.sheltered.push(crewId);
}

/** Called every frame by updateRun, while the base keeps running. */
export function updateShelter(state: RunState, deltaMs: number): void {
  const shelter = state.shelter;
  if (!shelter) return;
  shelter.elapsedMs += deltaMs;
  const everyoneIn = state.crew.every((member) => shelter.sheltered.includes(member.id));
  if (!everyoneIn && shelter.elapsedMs < COLLAB_BALANCE.shelterWindowMs) return;
  const event = state.events.find((candidate) => candidate.eventId === shelter.eventId);
  if (event) {
    event.crewSheltered = areHumansSheltered(state, shelter);
    const shelterFactor = event.crewSheltered ? COLLAB_BALANCE.shelterDamageFactor : 1;
    landEvent(state, event, choiceDamageFactor(event) * shelterFactor);
  }
  state.shelter = null;
}

/** Bots always follow the procedure; what matters is whether the people playing got in. */
function areHumansSheltered(state: RunState, shelter: ShelterEmergency): boolean {
  return state.crew
    .filter((member) => !member.isBot)
    .every((member) => shelter.sheltered.includes(member.id));
}
