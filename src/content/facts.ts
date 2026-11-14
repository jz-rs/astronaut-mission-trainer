import type { TaskId } from '../core/types';
import type { TranslationKey } from '../i18n';

/**
 * Spec 13 — What a minigame teaches when it ends. The first time, `why` connects what the kid
 * just did with the real science ("water stops radiation, that's why you used water blocks").
 * After that, the 3 real facts rotate so replaying teaches something new.
 * Sources in docs/DATA_SOURCES.md.
 */
const FACT_ORDER = ['why', 'fact', 'fact2', 'fact3'] as const;

const timesShown = new Map<TaskId, number>();

export function nextFactKey(taskId: TaskId): TranslationKey {
  const count = timesShown.get(taskId) ?? 0;
  timesShown.set(taskId, count + 1);
  const suffix = FACT_ORDER[count % FACT_ORDER.length] ?? 'why';
  return `task.${taskId}.${suffix}`;
}

/** Any of the 3 real facts of a task, e.g. for the result screen. */
const REAL_FACT_SUFFIXES = ['fact', 'fact2', 'fact3'] as const;

export function randomFactKey(taskId: TaskId, random: () => number = Math.random): TranslationKey {
  const suffix = REAL_FACT_SUFFIXES[Math.floor(random() * REAL_FACT_SUFFIXES.length)] ?? 'fact';
  return `task.${taskId}.${suffix}`;
}
