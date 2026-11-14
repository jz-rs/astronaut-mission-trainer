import type Phaser from 'phaser';
import type { GameSession } from '../core/GameSession';
import { findEmptyStat } from '../core/stats';
import { loadProgress } from '../services/progressStorage';
import { recordRunResult } from '../services/progressUpdates';
import type { ResultSceneData } from './ResultScene';
import { SCENE_KEYS } from './sceneKeys';

/**
 * Spec 11 — Closes a run: saves record and stars, then opens the result screen.
 * The base scene calls this when the session is over.
 */
export function finishRun(scene: Phaser.Scene, session: GameSession): void {
  const { state } = session;
  const result = session.getResult();
  const previousBest = loadProgress().bestScoreByLocation[state.location.id] ?? 0;
  recordRunResult(state.location.id, result);
  const data: ResultSceneData = {
    result,
    survived: state.status === 'survived',
    isNewRecord: result.score > previousBest,
    emptyStat: findEmptyStat(state.stats) ?? null,
    challenge: state.location.challenge,
    samples: state.samples,
    samplesGoal: state.location.samplesGoal,
  };
  scene.scene.start(SCENE_KEYS.result, data);
}
