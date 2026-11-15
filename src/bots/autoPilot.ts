import type { GameAction } from '../core/actions';
import { planTeamworkActions } from './teamwork';
import { canStartTask, isTooDarkFor } from '../core/daylight';
import { CREW_BALANCE, NIGHT_BALANCE, TASK_BALANCE } from '../config/balance';
import { TASK_IDS, type RunState, type TaskId } from '../core/types';

/**
 * Decides what idle bots in auto mode should do next.
 * Rule for kids to understand: "a bot on auto goes to fix the lowest bar". Like real crews on
 * Mars, once the Sun is gone they save the last bit of the battery for the night.
 * It returns actions instead of changing state, exactly like a human player would.
 */
export function planAutoBotActions(state: RunState): GameAction[] {
  return [...planTeamworkActions(state), ...planTaskActions(state)];
}

function planTaskActions(state: RunState): GameAction[] {
  const actions: GameAction[] = [];
  const takenTasks = new Set(
    state.crew.flatMap((member) => (member.task ? [member.task.taskId] : [])),
  );

  for (const bot of state.crew) {
    if (!bot.isBot || !bot.autoMode || bot.task) continue;

    const taskId = pickMostUrgentTask(state, takenTasks);
    if (!taskId) continue;

    takenTasks.add(taskId);
    actions.push({ type: 'assignTask', crewId: bot.id, taskId });
  }
  return actions;
}

function pickMostUrgentTask(state: RunState, takenTasks: Set<TaskId>): TaskId | undefined {
  const candidates = TASK_IDS.filter(
    (taskId) =>
      !takenTasks.has(taskId) &&
      canStartTask(state, taskId, CREW_BALANCE.botTaskDurationMs) &&
      !spendsNightReserve(state, taskId),
  );
  const priority = state.priority;
  if (priority && state.sol <= priority.untilSol && candidates.includes(priority.taskId)) {
    return priority.taskId; // the crew voted this in the crisis meeting (spec 16)
  }
  const statValue = (taskId: TaskId) => state.stats[TASK_BALANCE[taskId].stat];
  return candidates.sort((a, b) => statValue(a) - statValue(b))[0];
}

/**
 * Once the panels can't be used until tomorrow, nobody can recharge: bots don't use the last bit
 * of the battery, so the base gets to the morning.
 */
function spendsNightReserve(state: RunState, taskId: TaskId): boolean {
  const cost = TASK_BALANCE[taskId].energyCost;
  if (cost === 0) return false;
  const noMoreSun = isTooDarkFor(state, 'solar-panels', CREW_BALANCE.botTaskDurationMs);
  return noMoreSun && state.stats.energy - cost < NIGHT_BALANCE.nightReserve;
}
