import { describe, expect, it } from 'vitest';
import { EVENT_BALANCE, RUN_BALANCE } from '../src/config/balance';
import { MARS_EVENTS } from '../src/content/events';
import { findWorstEvent, scheduleEvents } from '../src/core/events';
import { createRun, updateRun } from '../src/core/run';
import type { MarsEvent } from '../src/core/types';
import { TEST_LOCATION } from './helpers';

/** Small deterministic random generator so draws can be tested. */
function seededRandom(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const STORM: MarsEvent = {
  id: 'storm',
  type: 'solar-storm',
  locations: ['test'],
  warningSolsBefore: [1],
  effect: { shield: -40 },
  source: 'https://example.org',
  realDate: null,
};
const SURPRISE: MarsEvent = { ...STORM, id: 'surprise', warningSolsBefore: [0] };

function runWith(event: MarsEvent, hitSol: number) {
  const [scheduled] = scheduleEvents([event], 'test', () => 0);
  if (!scheduled) throw new Error('nothing scheduled');
  scheduled.hitSol = hitSol;
  scheduled.warningSol = event.warningSolsBefore[0] ? hitSol - 1 : null;
  return createRun(TEST_LOCATION, {}, [scheduled]);
}

describe('Mars events', () => {
  it('draws 2 or 3 events of the location, each on a different sol after sol 1', () => {
    const events = scheduleEvents(MARS_EVENTS, 'jezero', seededRandom(7));
    expect(events.length).toBeGreaterThanOrEqual(EVENT_BALANCE.minEventsPerRun);
    expect(events.length).toBeLessThanOrEqual(EVENT_BALANCE.maxEventsPerRun);
    const sols = events.map((event) => event.hitSol);
    expect(new Set(sols).size).toBe(sols.length);
    expect(Math.min(...sols)).toBeGreaterThanOrEqual(EVENT_BALANCE.firstEventSol);
    const jezeroIds = MARS_EVENTS.filter((event) => event.locations.includes('jezero'));
    for (const event of events) {
      expect(jezeroIds.map(({ id }) => id)).toContain(event.eventId);
    }
  });

  it('gives two runs in the same place different events', () => {
    const describeRun = (seed: number) =>
      scheduleEvents(MARS_EVENTS, 'jezero', seededRandom(seed))
        .map((event) => `${event.eventId}@${event.hitSol}`)
        .join();
    const runs = new Set([1, 2, 3, 4, 5].map(describeRun));
    expect(runs.size).toBeGreaterThan(1);
  });

  it('warns one sol before when the event has a warning', () => {
    const state = runWith(STORM, 3);
    state.sol = 2;
    updateRun(state, 1);
    expect(state.eventNews).toEqual([{ kind: 'warning', eventId: 'storm' }]);
    expect(state.stats.shield).toBeGreaterThan(RUN_BALANCE.startingStatValue - 1);
  });

  it('arrives without warning when the event has none, and applies its effect', () => {
    const state = runWith(SURPRISE, 2);
    state.sol = 2;
    const before = state.stats.shield;
    updateRun(state, RUN_BALANCE.solDurationMs * EVENT_BALANCE.hitAtSolFraction);
    expect(state.eventNews).toEqual([{ kind: 'hit', eventId: 'surprise' }]);
    expect(state.stats.shield).toBeLessThan(before - 39);
    expect(findWorstEvent(state)).toBe('surprise');
  });
});
