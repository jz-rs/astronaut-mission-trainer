import { COLLAB_BALANCE } from '../config/balance';
import type { GameAction } from '../core/actions';
import type { CrisisProcedureId, RunState } from '../core/types';

/**
 * Spec 16 — How bots take part in teamwork, with the same GameActions as a person:
 *   - in a crisis meeting the player is the commander: bots vote the same as the player,
 *     right after the player votes (so the kid's choice decides, and nobody copies the bots);
 *   - when a solar storm lands every bot walks into the shelter.
 */
export function planTeamworkActions(state: RunState): GameAction[] {
  return [...planVotes(state), ...planShelter(state)];
}

function planVotes(state: RunState): GameAction[] {
  const meeting = state.meeting;
  if (!meeting) return [];
  const commanderVote = findHumanVote(state, meeting.votes);
  if (!commanderVote) return [];
  return state.crew
    .filter((member) => member.isBot && !meeting.votes[member.id])
    .map((bot): GameAction => ({ type: 'castVote', crewId: bot.id, procedureId: commanderVote }));
}

function findHumanVote(
  state: RunState,
  votes: Record<string, CrisisProcedureId>,
): CrisisProcedureId | undefined {
  const human = state.crew.find((member) => !member.isBot && votes[member.id]);
  return human ? votes[human.id] : undefined;
}

function planShelter(state: RunState): GameAction[] {
  const shelter = state.shelter;
  if (!shelter || shelter.elapsedMs < COLLAB_BALANCE.botShelterDelayMs) return [];
  return state.crew
    .filter((member) => member.isBot && !shelter.sheltered.includes(member.id))
    .map((bot): GameAction => ({ type: 'enterShelter', crewId: bot.id }));
}
