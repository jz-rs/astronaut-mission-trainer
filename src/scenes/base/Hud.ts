import Phaser from 'phaser';
import { RUN_BALANCE } from '../../config/balance';
import type { RunState } from '../../core/types';
import { t } from '../../i18n';
import { BASE_BACK_BUTTON, FONT_SIZE, GAME_WIDTH, HUD_HEIGHT, type Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addSoundToggle } from '../../ui/soundToggle';
import { addSpriteSized } from '../../ui/sprites';
import { addText } from '../../ui/text';

/**
 * Spec 04 — Top bar: "Sol N/5" with the progress of the current sol, in the middle.
 * The 4 stat bars are not here: each one lives on its room's card (RoomView), next to the
 * room that fills it. The right corner is left free for the bot faces (spec 05). Next to
 * "◀ BACK", the sound on/off button.
 */
const SOL_X = GAME_WIDTH / 2;
const SOL_TEXT_Y = 16;
const SOL_BAR_WIDTH = 96;
const SOL_BAR_HEIGHT = 5;
const SOL_BAR_Y = 28;
const SOL_ICON_SIZE = 16;
const SOL_ICON_GAP = 12;
const SOUND_BUTTON_GAP = 8;
const SOUND_BUTTON: Rect = {
  x: BASE_BACK_BUTTON.x + BASE_BACK_BUTTON.width + SOUND_BUTTON_GAP,
  y: BASE_BACK_BUTTON.y,
  width: 34,
  height: BASE_BACK_BUTTON.height,
};

export class Hud {
  private readonly solText: Phaser.GameObjects.Text;
  private readonly solBar: Phaser.GameObjects.Graphics;
  private readonly solIcon: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    const background = scene.add.graphics();
    background.fillStyle(PALETTE.night, 1).fillRect(0, 0, GAME_WIDTH, HUD_HEIGHT);
    background.fillStyle(TECH_GLOW, 1).fillRect(0, HUD_HEIGHT - 2, GAME_WIDTH, 2);
    this.solIcon = addSpriteSized(scene, SOL_X, HUD_HEIGHT / 2, 'sol', SOL_ICON_SIZE);
    this.solText = addText(scene, SOL_X, SOL_TEXT_Y, '', {
      size: FONT_SIZE.small,
      color: PALETTE.sand,
    });
    this.solBar = scene.add.graphics();
    addSoundToggle(scene, SOUND_BUTTON);
  }

  update(state: RunState): void {
    this.solText.setText(t('hud.sol', { current: state.sol, total: RUN_BALANCE.solsPerRun }));
    // The sun sits left of the block, whatever the width of the text in each language.
    const blockLeft = SOL_X - Math.max(this.solText.width, SOL_BAR_WIDTH) / 2;
    this.solIcon.setX(blockLeft - SOL_ICON_GAP);
    this.drawSolProgress(state.solElapsedMs / RUN_BALANCE.solDurationMs);
  }

  private drawSolProgress(fraction: number): void {
    const left = SOL_X - SOL_BAR_WIDTH / 2;
    this.solBar.clear();
    this.solBar
      .fillStyle(PALETTE.metalDark, 1)
      .fillRect(left, SOL_BAR_Y, SOL_BAR_WIDTH, SOL_BAR_HEIGHT);
    this.solBar
      .fillStyle(PALETTE.sun, 1)
      .fillRect(left, SOL_BAR_Y, SOL_BAR_WIDTH * fraction, SOL_BAR_HEIGHT);
  }
}
