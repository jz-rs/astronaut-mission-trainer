import type Phaser from 'phaser';
import type { GameSession } from '../../core/GameSession';
import type { RunState } from '../../core/types';
import { CrisisFlow } from './crisis/CrisisFlow';
import { ShelterView } from './ShelterView';

/**
 * Spec 16 — Groups the crisis tablet and the shelter. Both must be seen even if a minigame is
 * open, so the base comes to the front while they last and goes back after. The open minigame
 * is paused meanwhile: if it ended under the tablet, its result card would pause the base and
 * hide below the tablet, and nothing could move again.
 */
export class TeamworkViews {
  private readonly crisis: CrisisFlow;
  private readonly shelter: ShelterView;
  private onTop = false;
  private pausedOverlays: string[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    session: GameSession,
    private readonly overlayKeys: readonly string[],
  ) {
    this.crisis = new CrisisFlow(scene, session);
    this.shelter = new ShelterView(scene);
  }

  /** True while the crisis tablet or the shelter is on screen. */
  get isShowing(): boolean {
    return this.onTop;
  }

  /** True while a crisis card waits for the kid to read it and tap its button. */
  get pausesGame(): boolean {
    return this.crisis.pausesGame;
  }

  update(state: RunState): void {
    const sceneOpen = this.overlayKeys.some((key) => this.scene.scene.isActive(key));
    this.crisis.update(state, !sceneOpen);
    this.shelter.update(state);
    const showing = this.crisis.isOnScreen || this.shelter.isVisible;
    if (showing && !this.onTop) this.coverOverlays();
    if (!showing && this.onTop) this.restoreOverlays();
    this.onTop = showing;
  }

  private coverOverlays(): void {
    this.pausedOverlays = this.overlayKeys.filter((key) => this.scene.scene.isActive(key));
    this.pausedOverlays.forEach((key) => this.scene.scene.pause(key));
    this.scene.scene.bringToTop();
  }

  /**
   * Phaser draws scenes in list order and `launch` never reorders them. So every overlay goes
   * back above the base, not only the open one: otherwise the next minigame opens hidden
   * under the base and the player is stuck waiting for it.
   */
  private restoreOverlays(): void {
    for (const key of this.overlayKeys) this.scene.scene.bringToTop(key);
    this.pausedOverlays.forEach((key) => this.scene.scene.resume(key));
    this.pausedOverlays = [];
  }
}
