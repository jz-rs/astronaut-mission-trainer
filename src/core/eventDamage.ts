import { applyStatChanges } from './stats';
import type { RunState, ScheduledEvent } from './types';

/**
 * Spec 14/16 — The moment an event really changes the bars. `factor` is the share of its effect
 * that hits: less than 1 when the crew did the right thing in time.
 */
export function landEvent(state: RunState, event: ScheduledEvent, factor: number): void {
  applyStatChanges(state.stats, event.effect, factor);
  event.damageFactor = factor;
  state.eventNews.push({ kind: 'hit', eventId: event.eventId });
}
