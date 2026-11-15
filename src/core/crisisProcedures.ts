import type { CrisisProcedureId, EventType, TaskId } from './types';

/**
 * Spec 16 — What real crews do when Earth warns of each crisis, and the wrong idea it is
 * compared with. Only events in this table get a crisis meeting.
 *   - Solar storm: everyone goes to the most shielded place (Orion and the ISS have shelters);
 *     going outside is exactly what flight rules forbid.
 *   - Dust storm: rovers save energy and wait it out (InSight, Opportunity); cleaning the panels
 *     in the middle of the storm is useless, the dust keeps falling.
 */
export interface CrisisPlan {
  right: CrisisProcedureId;
  wrong: CrisisProcedureId;
}

const CRISIS_PLANS: Partial<Record<EventType, CrisisPlan>> = {
  'solar-storm': { right: 'shelter', wrong: 'go-outside' },
  'dust-storm': { right: 'save-energy', wrong: 'clean-panels' },
};

/**
 * Task bots on auto do first after the meeting. Saving energy means no extra trips, so it asks
 * for none.
 */
export const PROCEDURE_PRIORITY: Record<CrisisProcedureId, TaskId | null> = {
  shelter: 'shield-wall',
  'go-outside': 'solar-panels',
  'save-energy': null,
  'clean-panels': 'solar-panels',
};

export function findCrisisPlan(type: EventType): CrisisPlan | null {
  return CRISIS_PLANS[type] ?? null;
}

export function isRightChoice(type: EventType, choice: CrisisProcedureId | null): boolean {
  return choice !== null && findCrisisPlan(type)?.right === choice;
}
