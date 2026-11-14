import { describe, expect, it } from 'vitest';
import { RUN_BALANCE, ROVER_BALANCE } from '../src/config/balance';
import { applyAction } from '../src/core/actions';
import { createRun, PLAYER_ID } from '../src/core/run';
import { TEST_LOCATION } from './helpers';

describe('rover expedition', () => {
  it('charges energy when the rover leaves', () => {
    const state = createRun(TEST_LOCATION, {});
    applyAction(state, { type: 'startExpedition', crewId: PLAYER_ID });
    expect(state.roverOut).toBe(true);
    expect(state.stats.energy).toBe(RUN_BALANCE.startingStatValue - ROVER_BALANCE.energyCost);
  });

  it('cannot leave without enough energy, or twice at the same time', () => {
    const poor = createRun(TEST_LOCATION, {});
    poor.stats.energy = ROVER_BALANCE.energyCost - 1;
    applyAction(poor, { type: 'startExpedition', crewId: PLAYER_ID });
    expect(poor.roverOut).toBe(false);

    const busy = createRun(TEST_LOCATION, {});
    applyAction(busy, { type: 'startExpedition', crewId: PLAYER_ID });
    const energyAfterFirstTrip = busy.stats.energy;
    applyAction(busy, { type: 'startExpedition', crewId: PLAYER_ID });
    expect(busy.stats.energy).toBe(energyAfterFirstTrip);
  });

  it('adds the samples when the rover comes back', () => {
    const state = createRun(TEST_LOCATION, {});
    applyAction(state, { type: 'startExpedition', crewId: PLAYER_ID });
    applyAction(state, { type: 'completeExpedition', crewId: PLAYER_ID, samples: 3 });
    expect(state.samples).toBe(3);
    expect(state.roverOut).toBe(false);
    applyAction(state, { type: 'completeExpedition', crewId: PLAYER_ID, samples: 3 });
    expect(state.samples).toBe(3);
  });
});
