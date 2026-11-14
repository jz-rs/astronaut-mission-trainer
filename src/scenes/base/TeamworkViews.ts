import type Phaser from 'phaser';
import type { GameSession } from '../../core/GameSession';
import type { RunState } from '../../core/types';
import { LeverView } from './LeverView';
import { MeetingView } from './MeetingView';

/**
 * Spec 16 — Groups the lever and the crisis meeting. A meeting must be seen even if a
 * minigame is open, so the base comes to the front while it lasts and goes back after.
 */
export class TeamworkViews {
  private readonly lever: LeverView;
  private readonly meeting: MeetingView;
  private meetingOnScreen = false;

  constructor(
    private readonly scene: Phaser.Scene,
    session: GameSession,
    private readonly overlayKeys: readonly string[],
  ) {
    this.lever = new LeverView(scene, session);
    this.meeting = new MeetingView(scene, session);
  }

  update(state: RunState, time: number): void {
    this.lever.update(state, time);
    const meetingNow = this.meeting.update(state);
    if (meetingNow && !this.meetingOnScreen) this.scene.scene.bringToTop();
    if (!meetingNow && this.meetingOnScreen) this.restoreOverlays();
    this.meetingOnScreen = meetingNow;
  }

  private restoreOverlays(): void {
    for (const key of this.overlayKeys) {
      if (this.scene.scene.isActive(key)) this.scene.scene.bringToTop(key);
    }
  }
}
