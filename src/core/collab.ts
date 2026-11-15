import { COLLAB_BALANCE, TASK_BALANCE } from '../config/balance';
import { findCrisisPlan, isRightChoice, PROCEDURE_PRIORITY } from './crisisProcedures';
import {
  TASK_IDS,
  type CrisisMeeting,
  type CrisisProcedureId,
  type RunState,
  type ScheduledEvent,
  type StatId,
  type TaskId,
} from './types';

/**
 * Spec 16 — Crisis meeting, like an Among Us emergency meeting but about real procedures.
 * When Earth warns of a crisis the base pauses: first the message arrives (it takes minutes to
 * travel from Earth), then the crew votes between the real procedure and a wrong idea.
 * Voting the real one softens the event and tells bots on auto what to do first.
 * Votes are GameActions, so bots and (one day) online players use the same path.
 */
export function shouldStartMeeting(event: ScheduledEvent, state: RunState): boolean {
  return COLLAB_BALANCE.meetingEnabled && findCrisisPlan(event.type) !== null && !state.meeting;
}

export function startMeeting(state: RunState, event: ScheduledEvent): void {
  const plan = findCrisisPlan(event.type);
  if (!plan) return;
  // The right answer changes side with the sol, so kids learn the procedure, not "the left one".
  const rightFirst = event.hitSol % 2 === 0;
  state.meeting = {
    eventId: event.eventId,
    options: rightFirst ? [plan.right, plan.wrong] : [plan.wrong, plan.right],
    votes: {},
    remainingMs: COLLAB_BALANCE.meetingIntroMs + COLLAB_BALANCE.meetingVoteMs,
  };
}

/** True while the message is still arriving: nobody can vote yet. */
export function isMeetingIntro(meeting: CrisisMeeting): boolean {
  return meeting.remainingMs > COLLAB_BALANCE.meetingVoteMs;
}

export function castVote(state: RunState, crewId: string, procedureId: CrisisProcedureId): void {
  const meeting = state.meeting;
  if (!meeting?.options.includes(procedureId) || isMeetingIntro(meeting)) return;
  meeting.votes[crewId] = procedureId;
}

/** Called every frame by updateRun. */
export function updateMeeting(state: RunState, deltaMs: number): void {
  const meeting = state.meeting;
  if (!meeting) return;
  meeting.remainingMs -= deltaMs;
  const everyoneVoted = Object.keys(meeting.votes).length >= state.crew.length;
  if (!everyoneVoted && meeting.remainingMs > 0) return;
  const choice = countWinner(meeting);
  const event = state.events.find((candidate) => candidate.eventId === meeting.eventId);
  if (event) {
    event.crisisChoice = choice;
    setPriority(state, choice, event.hitSol);
    state.eventNews.push({ kind: 'decided', eventId: event.eventId });
  }
  state.meeting = null;
}

function setPriority(state: RunState, choice: CrisisProcedureId | null, untilSol: number): void {
  const taskId = choice ? PROCEDURE_PRIORITY[choice] : null;
  state.priority = taskId ? { taskId, untilSol } : null;
}

/** Most votes wins. Without votes (time ran out) nobody chose. */
function countWinner(meeting: CrisisMeeting): CrisisProcedureId | null {
  const [first, second] = meeting.options;
  const count = (procedureId: CrisisProcedureId) =>
    Object.values(meeting.votes).filter((vote) => vote === procedureId).length;
  if (count(first) === 0 && count(second) === 0) return null;
  return count(second) > count(first) ? second : first;
}

/** Share of an event's damage left by the meeting: 1 without a meeting or with a wrong choice. */
export function choiceDamageFactor(event: ScheduledEvent): number {
  if (event.crisisChoice === undefined) return 1;
  return isRightChoice(event.type, event.crisisChoice) ? COLLAB_BALANCE.rightChoiceDamageFactor : 1;
}

export function taskForStat(statId: StatId): TaskId {
  return TASK_IDS.find((taskId) => TASK_BALANCE[taskId].stat === statId) ?? 'shield-wall';
}
