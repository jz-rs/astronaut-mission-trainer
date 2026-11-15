import type { Language } from '../i18n';
import type { TrainingLevels } from '../core/types';

/**
 * Progress that survives between runs (training, records, stars).
 * Browser storage can be blocked (private mode, kiosks), so every access is guarded
 * and the game keeps working with an in-memory copy.
 */
export interface PlayerProgress {
  language: Language;
  training: TrainingLevels;
  bestScoreByLocation: Record<string, number>;
  starsByLocation: Record<string, number>;
  /** Locations whose unlock party the Mars map already played (spec 12). */
  celebratedUnlocks: string[];
  /** The guided first sol (TutorialGuide) is shown until it is finished once. */
  tutorialDone: boolean;
  /** Spec 18 — The guide's welcome in the cabin plays by itself only the first time. */
  welcomeSeen: boolean;
  /** Spec 18 — The first landing waits until every page of the mission manual was seen. */
  manualDone: boolean;
}

const STORAGE_KEY = 'astronaut-mission-trainer/progress/v1';

const EMPTY_PROGRESS: PlayerProgress = {
  language: 'es',
  training: {},
  bestScoreByLocation: {},
  starsByLocation: {},
  celebratedUnlocks: [],
  tutorialDone: false,
  welcomeSeen: false,
  manualDone: false,
};

let cachedProgress: PlayerProgress | null = null;

export function loadProgress(): PlayerProgress {
  if (cachedProgress) return cachedProgress;
  cachedProgress = { ...EMPTY_PROGRESS, ...readFromStorage() };
  return cachedProgress;
}

export function saveProgress(progress: PlayerProgress): void {
  cachedProgress = progress;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable: progress lives only for this session.
  }
}

function readFromStorage(): Partial<PlayerProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<PlayerProgress>) : {};
  } catch {
    return {};
  }
}
