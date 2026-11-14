import Phaser from 'phaser';
import { COLLAB_BALANCE } from '../../config/balance';
import type { GameSession } from '../../core/GameSession';
import { PLAYER_ID } from '../../core/run';
import type { RunState } from '../../core/types';
import { t } from '../../i18n';
import { FONT_SIZE, ROOM_RECTS } from '../../ui/layout';
import { CREW_COLORS, PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';

/**
 * Spec 16 — Lever for two, drawn over the shield room during a solar storm.
 * Keep the finger on the big button while a crewmate holds the other side.
 */
const DEPTH = 45;
const BUTTON = { width: 140, height: 56 };
const BAR_HEIGHT = 6;

export class LeverView {
  private readonly container: Phaser.GameObjects.Container;
  private readonly bar: Phaser.GameObjects.Graphics;
  private readonly holders: Phaser.GameObjects.Graphics;
  private readonly room = ROOM_RECTS['shield-wall'];

  constructor(scene: Phaser.Scene, session: GameSession) {
    const { x, y, width, height } = this.room;
    const panel = scene.add.graphics();
    drawTechPanel(panel, this.room, PALETTE.violet, PALETTE.space);
    const hint = addText(scene, x + width / 2, y + 16, t('collab.lever'), {
      size: FONT_SIZE.small,
      color: PALETTE.white,
    });
    const button = this.createButton(scene, session, x + width / 2, y + height / 2 + 4);
    this.bar = scene.add.graphics();
    this.holders = scene.add.graphics();
    this.container = scene.add.container(0, 0, [panel, hint, button, this.bar, this.holders]);
    this.container.setDepth(DEPTH).setVisible(false);
  }

  update(state: RunState, time: number): void {
    const lever = state.emergency;
    this.container.setVisible(lever !== null);
    if (!lever) return;
    const { x, y, width, height } = this.room;
    const progress = Math.min(1, lever.heldMs / COLLAB_BALANCE.leverHoldMs);
    this.bar.clear();
    this.bar
      .fillStyle(PALETTE.metalDark, 1)
      .fillRect(x + 20, y + height - 16, width - 40, BAR_HEIGHT);
    this.bar.fillStyle(PALETTE.green, 1);
    this.bar.fillRect(x + 20, y + height - 16, (width - 40) * progress, BAR_HEIGHT);
    this.holders.clear();
    lever.holders.forEach((crewId, index) => {
      this.holders.fillStyle(CREW_COLORS[crewId] ?? PALETTE.white, 1);
      this.holders.fillCircle(x + width - 24 - index * 18, y + 40, 6);
    });
    this.container.setAlpha(Math.sin(time / 120) > -0.6 ? 1 : 0.85);
  }

  private createButton(scene: Phaser.Scene, session: GameSession, x: number, y: number) {
    const shape = scene.add.graphics();
    shape
      .fillStyle(PALETTE.violet, 1)
      .fillRect(-BUTTON.width / 2, -BUTTON.height / 2, BUTTON.width, BUTTON.height);
    shape
      .lineStyle(3, PALETTE.white, 1)
      .strokeRect(-BUTTON.width / 2, -BUTTON.height / 2, BUTTON.width, BUTTON.height);
    const label = addText(scene, 0, 0, t('collab.leverButton'), { color: PALETTE.white });
    const button = scene.add.container(x, y, [shape, label]).setSize(BUTTON.width, BUTTON.height);
    const hold = (holding: boolean) => {
      button.setScale(holding ? 0.92 : 1);
      session.dispatch({ type: 'holdLever', crewId: PLAYER_ID, holding });
    };
    button.setInteractive({ useHandCursor: true });
    button.on('pointerdown', () => hold(true));
    button.on('pointerup', () => hold(false));
    button.on('pointerout', () => hold(false));
    return button;
  }
}
