import { CREW_BALANCE, RUN_BALANCE } from '../config/balance';
import { applyAction, type GameAction } from './actions';
import { updateCollab } from './collab';
import { updateEvents } from './events';
import { applyDecay, createStartingStats, findEmptyStat, updateLowestStats } from './stats';
import { getBotEfficiency } from './training';
import type { CrewMember, LocationConfig, RunState, ScheduledEvent, TrainingLevels } from './types';
import { sendBotsInAtSunset } from './daylight';

export const PLAYER_ID = 'player';
export const BOT_IDS = ['bot-red', 'bot-green', 'bot-yellow'] as const;

export function createRun(
  location: LocationConfig,
  training: TrainingLevels,
  events: ScheduledEvent[] = [],
): RunState {
  return {
    location,
    training,
    sol: 1,
    solElapsedMs: 0,
    stats: createStartingStats(),
    lowestStats: createStartingStats(),
    crew: createCrew(),
    samples: 0,
    status: 'playing',
    events,
    eventNews: [],
    taskNews: [],
    roverOut: false,
    emergency: null,
    meeting: null,
    priority: null,
  };
}

function createCrew(): CrewMember[] {
  const player: CrewMember = { id: PLAYER_ID, isBot: false, autoMode: false, task: null };
  const bots = BOT_IDS.slice(0, CREW_BALANCE.botCount).map((id): CrewMember => ({
    id,
    isBot: true,
    autoMode: true,
    task: null,
  }));
  return [player, ...bots];
}

/** Advances the simulation. Called every frame by the scene, or by a server in the future. */
export function updateRun(state: RunState, deltaMs: number): void {
  if (state.status !== 'playing') return;
  updateCollab(state, deltaMs);
  if (state.meeting) return; // the crisis meeting pauses the base while everyone votes

  applyDecay(state.stats, state.location, deltaMs);
  advanceBotTasks(state, deltaMs);
  updateLowestStats(state.lowestStats, state.stats);
  advanceClock(state, deltaMs);
  sendBotsInAtSunset(state);
  updateEvents(state);
  checkEvacuation(state);
}

function advanceBotTasks(state: RunState, deltaMs: number): void {
  for (const bot of state.crew) {
    if (!bot.isBot || !bot.task) continue;
    bot.task.remainingMs -= deltaMs;
    if (bot.task.remainingMs > 0) continue;

    const { taskId } = bot.task;
    const action: GameAction = {
      type: 'completeTask',
      crewId: bot.id,
      taskId,
      performance: getBotEfficiency(state.training, taskId),
    };
    applyAction(state, action);
    bot.task = null;
  }
}

function advanceClock(state: RunState, deltaMs: number): void {
  state.solElapsedMs += deltaMs;
  if (state.solElapsedMs < RUN_BALANCE.solDurationMs) return;

  state.solElapsedMs -= RUN_BALANCE.solDurationMs;
  if (state.sol >= RUN_BALANCE.solsPerRun) {
    state.status = 'survived';
  } else {
    state.sol += 1;
  }
}

function checkEvacuation(state: RunState): void {
  if (state.status === 'playing' && findEmptyStat(state.stats)) {
    state.status = 'evacuated';
  }
}
