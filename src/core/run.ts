import { CREW_BALANCE, RUN_BALANCE } from '../config/balance';
import { applyAction, type GameAction } from './actions';
import { applyDecay, createStartingStats, findEmptyStat, updateLowestStats } from './stats';
import { getBotEfficiency } from './training';
import type { CrewMember, LocationConfig, RunState, TrainingLevels } from './types';

export const PLAYER_ID = 'player';
export const BOT_IDS = ['bot-red', 'bot-green', 'bot-yellow'] as const;

export function createRun(location: LocationConfig, training: TrainingLevels): RunState {
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

  applyDecay(state.stats, state.location, deltaMs);
  advanceBotTasks(state, deltaMs);
  updateLowestStats(state.lowestStats, state.stats);
  advanceClock(state, deltaMs);
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
