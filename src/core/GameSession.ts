import { planAutoBotActions } from '../bots/autoPilot';
import { applyAction, type GameAction } from './actions';
import { createRun, updateRun } from './run';
import { calculateResult, type RunResult } from './scoring';
import type { LocationConfig, RunState, TrainingLevels } from './types';

/**
 * The single entry point scenes use to talk to the game logic.
 * Scenes read `state` to draw, and send `GameAction`s to change it.
 */
export class GameSession {
  readonly state: RunState;

  constructor(location: LocationConfig, training: TrainingLevels) {
    this.state = createRun(location, training);
  }

  dispatch(action: GameAction): void {
    applyAction(this.state, action);
  }

  update(deltaMs: number): void {
    for (const action of planAutoBotActions(this.state)) {
      this.dispatch(action);
    }
    updateRun(this.state, deltaMs);
  }

  isOver(): boolean {
    return this.state.status !== 'playing';
  }

  getResult(): RunResult {
    return calculateResult(this.state);
  }
}
