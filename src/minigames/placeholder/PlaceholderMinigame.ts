import type Phaser from 'phaser';
import { PLACEHOLDER_MINIGAME_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { createButton } from '../../ui/Button';
import { FONT_SIZE, rectCenter, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addText } from '../../ui/text';
import { MinigameScene } from '../MinigameScene';

/**
 * Provisional minigame ("tap 5 times") for rooms whose real minigame is not ready,
 * so the whole game is playable from day one (spec 06). Also the simplest example to copy.
 */
export class PlaceholderMinigame extends MinigameScene {
  static readonly KEY = 'PlaceholderMinigame';
  protected readonly instructionKey = 'minigame.placeholder.instruction';
  private taps = 0;
  private counter: Phaser.GameObjects.Text | null = null;

  constructor() {
    super(PlaceholderMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.taps = 0;
    const center = rectCenter(area);
    this.counter = addText(this, center.x, area.y + 30, this.counterLabel(), {
      size: FONT_SIZE.large,
      color: PALETTE.cyan,
    });
    createButton(this, {
      x: center.x,
      y: center.y + 20,
      width: 160,
      height: 80,
      label: t('minigame.placeholder.button'),
      fontSize: FONT_SIZE.large,
      onPress: () => this.handleTap(),
    });
  }

  protected calculatePerformance(): number {
    return this.withSpeedBonus(this.taps / PLACEHOLDER_MINIGAME_BALANCE.tapsGoal);
  }

  private handleTap(): void {
    if (this.isFinished) return;
    this.taps += 1;
    this.counter?.setText(this.counterLabel());
    if (this.taps >= PLACEHOLDER_MINIGAME_BALANCE.tapsGoal) this.finish();
  }

  private counterLabel(): string {
    return `${this.taps}/${PLACEHOLDER_MINIGAME_BALANCE.tapsGoal}`;
  }
}
