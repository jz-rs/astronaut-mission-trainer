import { COLLAB_BALANCE, TASK_BALANCE } from '../config/balance';
import { applyStatChanges } from './stats';
import {
  STAT_IDS,
  TASK_IDS,
  type RunState,
  type ScheduledEvent,
  type StatId,
  type TaskId,
} from './types';

/**
 * Spec 16 — The two moments where the crew acts together:
 *   - Lever: a solar storm lands and 2 astronauts must hold the lever at once for a few
 *     seconds. Together the shield holds; otherwise the full storm hits.
 *   - Crisis meeting: when Earth warns of an event, the run pauses and everyone votes
 *     between 2 tasks. Bots on auto do the winner first until the event's sol ends.
 * Votes and holds are GameActions, so bots and (one day) online players use the same path.
 */
export function shouldStartLever(event: ScheduledEvent, state: RunState): boolean {
  return COLLAB_BALANCE.leverEnabled && event.type === 'solar-storm' && !state.emergency;
}

export function startLever(state: RunState, event: ScheduledEvent): void {
  state.emergency = { eventId: event.eventId, elapsedMs: 0, heldMs: 0, holders: [] };
}

export function shouldStartMeeting(event: ScheduledEvent, state: RunState): boolean {
  return COLLAB_BALANCE.meetingEnabled && event.type !== 'good' && !state.meeting;
}

export function startMeeting(state: RunState, event: ScheduledEvent): void {
  const urgent = taskForStat(mostDamagedStat(event));
  const alternative: TaskId = urgent === 'solar-panels' ? 'shield-wall' : 'solar-panels';
  state.meeting = {
    eventId: event.eventId,
    options: [urgent, alternative],
    votes: {},
    remainingMs: COLLAB_BALANCE.meetingVoteMs,
  };
}

export function holdLever(state: RunState, crewId: string, holding: boolean): void {
  const lever = state.emergency;
  if (!lever) return;
  const others = lever.holders.filter((id) => id !== crewId);
  lever.holders = holding ? [...others, crewId] : others;
}

export function castVote(state: RunState, crewId: string, taskId: TaskId): void {
  if (!state.meeting?.options.includes(taskId)) return;
  state.meeting.votes[crewId] = taskId;
}

/** Called every frame by updateRun. */
export function updateCollab(state: RunState, deltaMs: number): void {
  updateLever(state, deltaMs);
  updateMeeting(state, deltaMs);
}

function updateLever(state: RunState, deltaMs: number): void {
  const lever = state.emergency;
  if (!lever) return;
  lever.elapsedMs += deltaMs;
  if (lever.holders.length >= COLLAB_BALANCE.leverHoldersNeeded) lever.heldMs += deltaMs;
  const saved = lever.heldMs >= COLLAB_BALANCE.leverHoldMs;
  if (!saved && lever.elapsedMs < COLLAB_BALANCE.leverWindowMs) return;
  const event = state.events.find((candidate) => candidate.eventId === lever.eventId);
  const factor = saved ? COLLAB_BALANCE.leverSavedDamageFactor : 1;
  if (event) {
    applyStatChanges(state.stats, event.effect, factor);
    event.damageFactor = factor;
  }
  if (saved) state.eventNews.push({ kind: 'saved', eventId: lever.eventId });
  state.emergency = null;
}

function updateMeeting(state: RunState, deltaMs: number): void {
  const meeting = state.meeting;
  if (!meeting) return;
  meeting.remainingMs -= deltaMs;
  const everyoneVoted = Object.keys(meeting.votes).length >= state.crew.length;
  if (!everyoneVoted && meeting.remainingMs > 0) return;
  const event = state.events.find((candidate) => candidate.eventId === meeting.eventId);
  state.priority = {
    taskId: countWinner(meeting.options, meeting.votes),
    untilSol: event?.hitSol ?? state.sol,
  };
  state.meeting = null;
}

/** Most votes wins; a tie goes to the first option (the one that fights the event). */
function countWinner(options: [TaskId, TaskId], votes: Record<string, TaskId>): TaskId {
  const [first, second] = options;
  const count = (taskId: TaskId) => Object.values(votes).filter((vote) => vote === taskId).length;
  return count(second) > count(first) ? second : first;
}

function mostDamagedStat(event: ScheduledEvent): StatId {
  const loss = (statId: StatId) => event.effect[statId] ?? 0;
  return [...STAT_IDS].sort((a, b) => loss(a) - loss(b))[0] ?? 'shield';
}

export function taskForStat(statId: StatId): TaskId {
  return TASK_IDS.find((taskId) => TASK_BALANCE[taskId].stat === statId) ?? 'shield-wall';
}
