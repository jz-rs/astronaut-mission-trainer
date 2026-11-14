import Phaser from 'phaser';
import { ALERT_BALANCE, RUN_BALANCE } from '../../config/balance';
import { STAT_IDS, type RunState, type StatId } from '../../core/types';
import { t } from '../../i18n';
import { FONT_SIZE, GAME_WIDTH, HUD_HEIGHT } from '../../ui/layout';
import { PALETTE, STAT_COLORS, TECH_GLOW } from '../../ui/palette';
import { addSprite, addSpriteSized, STAT_ICON_SPRITES } from '../../ui/sprites';
import { addText } from '../../ui/text';

/**
 * Spec 04 — Top bar: the 4 bars with icon and color (a low bar blinks red) and "Sol N/5"
 * with the progress of the current sol. The right corner is left free for the bot faces (spec 05).
 */
const BAR_START_X = 8;
const BAR_SLOT_WIDTH = 104;
const BAR_WIDTH = 72;
const BAR_HEIGHT = 12;
const BAR_Y = 16;
const ICON_OFFSET_X = 10;
const BAR_OFFSET_X = 22;
const SOL_X = 462;
const SOL_BAR_WIDTH = 72;
const SOL_BAR_Y = 28;
const BLINK_PERIOD_MS = 250;
const SOL_ICON_X = 424;
const SOL_ICON_SIZE = 14;

export class Hud {
  private readonly bars: Phaser.GameObjects.Graphics;
  private readonly solText: Phaser.GameObjects.Text;
  private readonly solBar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    const background = scene.add.graphics();
    background.fillStyle(PALETTE.night, 1).fillRect(0, 0, GAME_WIDTH, HUD_HEIGHT);
    background.fillStyle(TECH_GLOW, 1).fillRect(0, HUD_HEIGHT - 2, GAME_WIDTH, 2);
    STAT_IDS.forEach((statId, index) => {
      const iconX = BAR_START_X + index * BAR_SLOT_WIDTH + ICON_OFFSET_X;
      addSprite(scene, iconX, BAR_Y + BAR_HEIGHT / 2, STAT_ICON_SPRITES[statId]);
    });
    addSpriteSized(scene, SOL_ICON_X, BAR_Y + BAR_HEIGHT / 2, 'sol', SOL_ICON_SIZE);
    this.bars = scene.add.graphics();
    this.solText = addText(scene, SOL_X, BAR_Y, '', {
      size: FONT_SIZE.small,
      color: PALETTE.sand,
    });
    this.solBar = scene.add.graphics();
  }

  update(state: RunState, timeMs: number): void {
    const blinkOn = Math.floor(timeMs / BLINK_PERIOD_MS) % 2 === 0;
    this.bars.clear();
    STAT_IDS.forEach((statId, index) => this.drawBar(statId, index, state.stats[statId], blinkOn));
    this.solText.setText(t('hud.sol', { current: state.sol, total: RUN_BALANCE.solsPerRun }));
    this.drawSolProgress(state.solElapsedMs / RUN_BALANCE.solDurationMs);
  }

  private drawBar(statId: StatId, index: number, value: number, blinkOn: boolean): void {
    const x = BAR_START_X + index * BAR_SLOT_WIDTH + BAR_OFFSET_X;
    const isLow = value < ALERT_BALANCE.lowStatThreshold;
    const color = isLow && blinkOn ? PALETTE.alert : STAT_COLORS[statId];
    const fillWidth = (BAR_WIDTH - 4) * (value / RUN_BALANCE.maxStatValue);
    this.bars
      .fillStyle(isLow ? PALETTE.alert : PALETTE.metal, 1)
      .fillRect(x, BAR_Y, BAR_WIDTH, BAR_HEIGHT);
    this.bars.fillStyle(PALETTE.night, 1).fillRect(x + 2, BAR_Y + 2, BAR_WIDTH - 4, BAR_HEIGHT - 4);
    this.bars.fillStyle(color, 1).fillRect(x + 2, BAR_Y + 2, fillWidth, BAR_HEIGHT - 4);
  }

  private drawSolProgress(fraction: number): void {
    const left = SOL_X - SOL_BAR_WIDTH / 2;
    this.solBar.clear();
    this.solBar.fillStyle(PALETTE.metalDark, 1).fillRect(left, SOL_BAR_Y, SOL_BAR_WIDTH, 4);
    this.solBar.fillStyle(PALETTE.sun, 1).fillRect(left, SOL_BAR_Y, SOL_BAR_WIDTH * fraction, 4);
  }
}
