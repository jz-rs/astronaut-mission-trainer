import rawEvents from '../../data/events.json';
import { scheduleEvents } from '../core/events';
import type { MarsEvent, ScheduledEvent } from '../core/types';

/** Spec 14 — Events are content (data/events.json, written by spec 13), drawn at random per run. */
export const MARS_EVENTS: readonly MarsEvent[] = rawEvents as MarsEvent[];

export function drawEventsForRun(locationId: string): ScheduledEvent[] {
  return scheduleEvents(MARS_EVENTS, locationId, Math.random);
}
