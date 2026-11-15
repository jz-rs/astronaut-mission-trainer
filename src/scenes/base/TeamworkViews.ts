import type Phaser from 'phaser';
import type { GameSession } from '../../core/GameSession';
import type { RunState } from '../../core/types';
import { CrisisFlow } from './crisis/CrisisFlow';
import { ShelterView } from './ShelterView';

/**
 * Spec 16 — Groups the crisis tablet and the shelter. Both must be seen even if a minigame is
 * open, so the base comes to the front while they last and goes back after.
 */
export class TeamworkViews {
  private readonly crisis: CrisisFlow;
  private readonly shelter: ShelterView;
  private onTop = false;

  constructor(
    private readonly scene: Phaser.Scene,
    session: GameSession,
    private readonly overlayKeys: readonly string[],
  ) {
    this.crisis = new CrisisFlow(scene, session);
    this.shelter = new ShelterView(scene);
  }

  /** True while a crisis card waits for the kid to read it and tap its button. */
  get pausesGame(): boolean {
    return this.crisis.pausesGame;
  }

  update(state: RunState): void {
    this.crisis.update(state);
    this.shelter.update(state);
    const showing = this.crisis.isOnScreen || this.shelter.isVisible;
    if (showing && !this.onTop) this.scene.scene.bringToTop();
    if (!showing && this.onTop) this.restoreOverlays();
    this.onTop = showing;
  }

  /**
   * Phaser draws scenes in list order and `launch` never reorders them. So every overlay goes
   * back above the base, not only the open one: otherwise the next minigame opens hidden
   * under the base and the player is stuck waiting for it.
   */
  private restoreOverlays(): void {
    for (const key of this.overlayKeys) this.scene.scene.bringToTop(key);
  }
}
