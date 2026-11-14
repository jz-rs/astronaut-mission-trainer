import type { GameAction } from '../core/actions';
import { canAffordTask } from '../core/stats';
import { TASK_BALANCE } from '../config/balance';
import { TASK_IDS, type RunState, type TaskId } from '../core/types';

/**
 * Decides what idle bots in auto mode should do next.
 * Rule for kids to understand: "a bot on auto goes to fix the lowest bar".
 * It returns actions instead of changing state, exactly like a human player would.
 */
export function planAutoBotActions(state: RunState): GameAction[] {
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
    (taskId) => !takenTasks.has(taskId) && canAffordTask(state.stats, taskId),
  );
  const statValue = (taskId: TaskId) => state.stats[TASK_BALANCE[taskId].stat];
  return candidates.sort((a, b) => statValue(a) - statValue(b))[0];
}
