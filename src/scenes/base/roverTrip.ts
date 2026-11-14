import type Phaser from 'phaser';
import type { GameSession } from '../../core/GameSession';
import { PLAYER_ID } from '../../core/run';
import {
  RoverExpeditionScene,
  type RoverStartData,
} from '../../minigames/rover/RoverExpeditionScene';

/**
 * Spec 15 — Starts a rover trip from the base: pays the energy through a GameAction,
 * opens the rover scene on top (the base keeps running) and hands the samples back.
 */
export function launchRoverTrip(
  scene: Phaser.Scene,
  session: GameSession,
  locationId: string,
  onBack: () => void,
): void {
  session.dispatch({ type: 'startExpedition', crewId: PLAYER_ID });
  const data: RoverStartData = {
    locationId,
    onFinish: (samples) => {
      if (!session.isOver()) {
        session.dispatch({ type: 'completeExpedition', crewId: PLAYER_ID, samples });
      }
      onBack();
    },
  };
  scene.scene.launch(RoverExpeditionScene.KEY, data);
}
