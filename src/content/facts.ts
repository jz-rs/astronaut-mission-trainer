import type { TaskId } from '../core/types';
import type { TranslationKey } from '../i18n';

/**
 * Spec 13 — Each minigame has 3 real facts (sources in docs/DATA_SOURCES.md).
 * They rotate so replaying teaches something new.
 */
const FACT_SUFFIXES = ['fact', 'fact2', 'fact3'] as const;

export function randomFactKey(taskId: TaskId, random: () => number = Math.random): TranslationKey {
  const suffix = FACT_SUFFIXES[Math.floor(random() * FACT_SUFFIXES.length)] ?? 'fact';
  return `task.${taskId}.${suffix}`;
}
