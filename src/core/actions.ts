import { CREW_BALANCE } from '../config/balance';
import { castVote, holdLever } from './collab';
import { completeExpedition, startExpedition } from './expedition';
import { applyTaskResult, canAffordTask } from './stats';
import { clampPerformance } from './training';
import type { CrewMember, RunState, TaskId } from './types';

/**
 * Everything a crew member can do. Humans (local or, later, online) and bots
 * send exactly the same actions, so swapping a bot for a person changes nothing here.
 */
export type GameAction =
  | { type: 'assignTask'; crewId: string; taskId: TaskId }
  | { type: 'completeTask'; crewId: string; taskId: TaskId; performance: number }
  | { type: 'setAutoMode'; crewId: string; enabled: boolean }
  | { type: 'startExpedition'; crewId: string }
  | { type: 'completeExpedition'; crewId: string; samples: number }
  | { type: 'holdLever'; crewId: string; holding: boolean }
  | { type: 'castVote'; crewId: string; taskId: TaskId };

export function applyAction(state: RunState, action: GameAction): void {
  if (state.status !== 'playing') return;
  const member = findCrewMember(state, action.crewId);

  switch (action.type) {
    case 'assignTask':
      assignTask(state, member, action.taskId);
      break;
    case 'completeTask':
      completeTask(state, member, action.taskId, action.performance);
      break;
    case 'setAutoMode':
      member.autoMode = action.enabled;
      break;
    case 'startExpedition':
      startExpedition(state);
      break;
    case 'completeExpedition':
      completeExpedition(state, action.samples);
      break;
    case 'holdLever':
      holdLever(state, member.id, action.holding);
      break;
    case 'castVote':
      castVote(state, member.id, action.taskId);
      break;
  }
}

function findCrewMember(state: RunState, crewId: string): CrewMember {
  const member = state.crew.find((candidate) => candidate.id === crewId);
  if (!member) throw new Error(`Unknown crew member: ${crewId}`);
  return member;
}

/** Bots work on a timer; the player plays the minigame instead, so they never get a timer. */
function assignTask(state: RunState, member: CrewMember, taskId: TaskId): void {
  if (!member.isBot || !canAffordTask(state.stats, taskId)) return;
  member.task = { taskId, remainingMs: CREW_BALANCE.botTaskDurationMs };
}

function completeTask(
  state: RunState,
  member: CrewMember,
  taskId: TaskId,
  performance: number,
): void {
  if (!canAffordTask(state.stats, taskId)) return;
  const effect = applyTaskResult(state.stats, taskId, clampPerformance(performance));
  state.taskNews.push({ crewId: member.id, taskId, ...effect });
  member.task = null;
}
