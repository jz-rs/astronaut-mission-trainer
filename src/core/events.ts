import { EVENT_BALANCE, RUN_BALANCE } from '../config/balance';
import { shouldStartLever, shouldStartMeeting, startLever, startMeeting } from './collab';
import { applyStatChanges } from './stats';
import { STAT_IDS, type MarsEvent, type RunState, type ScheduledEvent } from './types';

/**
 * Spec 14 — Real Mars events. Each run draws 2–3 from the location's deck and places
 * them on different sols. Some are announced one sol before ("Message from Earth"),
 * because a signal from Earth takes minutes to arrive and sometimes there is no time.
 */
export function scheduleEvents(
  deck: readonly MarsEvent[],
  locationId: string,
  random: () => number,
): ScheduledEvent[] {
  const { minEventsPerRun, maxEventsPerRun, firstEventSol } = EVENT_BALANCE;
  const candidates = shuffle(
    deck.filter((event) => event.locations.includes(locationId)),
    random,
  );
  const sols = shuffle(range(firstEventSol, RUN_BALANCE.solsPerRun), random);
  const count = minEventsPerRun + Math.floor(random() * (maxEventsPerRun - minEventsPerRun + 1));
  const total = Math.min(count, candidates.length, sols.length);
  return candidates.slice(0, total).map((event, index) => {
    const hitSol = sols[index] ?? RUN_BALANCE.solsPerRun;
    return createScheduledEvent(event, hitSol, pick(event.warningSolsBefore, random) ?? 0);
  });
}

function createScheduledEvent(
  event: MarsEvent,
  hitSol: number,
  solsBefore: number,
): ScheduledEvent {
  return {
    eventId: event.id,
    type: event.type,
    effect: event.effect,
    hitSol,
    warningSol: solsBefore > 0 ? Math.max(1, hitSol - solsBefore) : null,
    status: 'pending',
  };
}

/** Called every frame by updateRun, after the clock moves. */
export function updateEvents(state: RunState): void {
  for (const event of state.events) {
    if (event.status === 'pending' && event.warningSol !== null && state.sol >= event.warningSol) {
      event.status = 'warned';
      state.eventNews.push({ kind: 'warning', eventId: event.eventId });
      if (shouldStartMeeting(event, state)) startMeeting(state, event);
    }
    if (event.status !== 'hit' && hasArrived(state, event)) {
      event.status = 'hit';
      if (shouldStartLever(event, state)) startLever(state, event);
      else applyStatChanges(state.stats, event.effect);
      state.eventNews.push({ kind: 'hit', eventId: event.eventId });
    }
  }
}

function hasArrived(state: RunState, event: ScheduledEvent): boolean {
  if (state.sol !== event.hitSol) return state.sol > event.hitSol;
  return state.solElapsedMs >= RUN_BALANCE.solDurationMs * EVENT_BALANCE.hitAtSolFraction;
}

/** For the result screen: "the solar storm hit you hardest". */
export function findWorstEvent(state: RunState): string | null {
  const damage = (event: ScheduledEvent) =>
    STAT_IDS.reduce((total, statId) => total + Math.min(0, event.effect[statId] ?? 0), 0) *
    (event.damageFactor ?? 1);
  const harmful = state.events.filter((event) => event.status === 'hit' && damage(event) < 0);
  harmful.sort((a, b) => damage(a) - damage(b));
  return harmful[0]?.eventId ?? null;
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

function pick<T>(items: readonly T[], random: () => number): T | undefined {
  return items[Math.floor(random() * items.length)];
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other] as T, result[index] as T];
  }
  return result;
}
