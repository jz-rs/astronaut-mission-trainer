import { COLLAB_BALANCE, TASK_BALANCE } from '../config/balance';
import type { GameAction } from '../core/actions';
import type { RunState, TaskId } from '../core/types';

/**
 * Spec 16 — How bots take part in teamwork, with the same GameActions as a person:
 *   - in a crisis meeting every bot votes for the option whose bar is lowest;
 *   - in a lever emergency one bot on auto walks over and holds the other side.
 */
export function planTeamworkActions(state: RunState): GameAction[] {
  return [...planVotes(state), ...planLeverHelp(state)];
}

function planVotes(state: RunState): GameAction[] {
  const meeting = state.meeting;
  if (!meeting) return [];
  const statValue = (taskId: TaskId) => state.stats[TASK_BALANCE[taskId].stat];
  const choice = [...meeting.options].sort((a, b) => statValue(a) - statValue(b))[0];
  if (!choice) return [];
  return state.crew
    .filter((member) => member.isBot && !meeting.votes[member.id])
    .map((bot): GameAction => ({ type: 'castVote', crewId: bot.id, taskId: choice }));
}

function planLeverHelp(state: RunState): GameAction[] {
  const lever = state.emergency;
  if (!lever || lever.elapsedMs < COLLAB_BALANCE.botLeverDelayMs) return [];
  const botsHolding = state.crew.filter(
    (member) => member.isBot && lever.holders.includes(member.id),
  );
  if (botsHolding.length > 0) return [];
  const helper = state.crew.find((member) => member.isBot && member.autoMode);
  return helper ? [{ type: 'holdLever', crewId: helper.id, holding: true }] : [];
}
