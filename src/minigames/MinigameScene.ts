import Phaser from 'phaser';
import { MINIGAME_BALANCE } from '../config/balance';
import { clampPerformance } from '../core/training';
import type { TaskId } from '../core/types';
import { t, type TranslationKey } from '../i18n';
import { COLORS } from '../ui/palette';
import { GAME_HEIGHT, GAME_WIDTH } from '../ui/layout';
import { textStyle } from '../ui/textStyles';

export const MINIGAME_FINISHED_EVENT = 'minigame-finished';

export interface MinigameLaunchData {
  taskId: TaskId;
}

export interface MinigameResult {
  taskId: TaskId;
  /** 0 = nothing done, 1 = good, up to 1.2 = perfect. */
  performance: number;
}

const PANEL_MARGIN = 24;
const TIMER_BAR_HEIGHT = 6;

/**
 * Base class for every minigame. A minigame only has to:
 *  1. build its content inside `this.playArea` in `buildGame()`
 *  2. return a 0..1.2 score in `measurePerformance()`
 *  3. call `this.finish()` early if the player completes it before the timer
 * Opening/closing, the timer, the result message and the fact are handled here.
 */
export abstract class MinigameScene extends Phaser.Scene {
  protected taskId!: TaskId;
  protected playArea!: Phaser.Geom.Rectangle;
  private timerBar!: Phaser.GameObjects.Rectangle;
  private elapsedMs = 0;
  private isFinished = false;

  protected abstract readonly instructionKey: TranslationKey;
  protected abstract buildGame(): void;
  protected abstract measurePerformance(): number;

  init(data: MinigameLaunchData): void {
    this.taskId = data.taskId;
    this.elapsedMs = 0;
    this.isFinished = false;
  }

  create(): void {
    this.drawFrame();
    this.buildGame();
  }

  update(_time: number, deltaMs: number): void {
    if (this.isFinished) return;
    this.elapsedMs += deltaMs;
    this.timerBar.scaleX = Math.max(0, 1 - this.timeProgress());
    if (this.timeProgress() >= 1) this.finish();
  }

  /** 0 at the start, 1 when time is up. Useful for time bonuses. */
  protected timeProgress(): number {
    return this.elapsedMs / MINIGAME_BALANCE.durationMs;
  }

  protected finish(): void {
    if (this.isFinished) return;
    this.isFinished = true;
    const performance = clampPerformance(this.measurePerformance());
    this.showResult(performance);
    this.time.delayedCall(MINIGAME_BALANCE.resultDisplayMs, () => this.close(performance));
  }

  private close(performance: number): void {
    const result: MinigameResult = { taskId: this.taskId, performance };
    this.game.events.emit(MINIGAME_FINISHED_EVENT, result);
    this.scene.stop();
  }

  private drawFrame(): void {
    this.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, COLORS.background, 0.7)
      .setOrigin(0)
      .setInteractive();
    const width = GAME_WIDTH - PANEL_MARGIN * 2;
    const height = GAME_HEIGHT - PANEL_MARGIN * 2;
    this.add
      .rectangle(PANEL_MARGIN, PANEL_MARGIN, width, height, COLORS.panel)
      .setOrigin(0)
      .setStrokeStyle(3, COLORS.panelBorder);
    this.add
      .text(GAME_WIDTH / 2, PANEL_MARGIN + 18, t(this.instructionKey), textStyle('normal'))
      .setOrigin(0.5);
    this.timerBar = this.add
      .rectangle(PANEL_MARGIN, PANEL_MARGIN + 34, width, TIMER_BAR_HEIGHT, COLORS.energy)
      .setOrigin(0);
    this.playArea = new Phaser.Geom.Rectangle(
      PANEL_MARGIN + 16,
      PANEL_MARGIN + 50,
      width - 32,
      height - 66,
    );
  }

  private showResult(performance: number): void {
    const centerX = GAME_WIDTH / 2;
    this.add
      .rectangle(centerX, GAME_HEIGHT / 2, 480, 120, COLORS.background, 0.95)
      .setStrokeStyle(2, COLORS.panelBorder);
    this.add
      .text(
        centerX,
        GAME_HEIGHT / 2 - 26,
        t(resultMessageKey(performance)),
        textStyle('large', COLORS.energy),
      )
      .setOrigin(0.5);
    const fact = this.add.text(
      centerX,
      GAME_HEIGHT / 2 + 18,
      `💡 ${t(factKey(this.taskId))}`,
      textStyle('small'),
    );
    fact.setOrigin(0.5).setWordWrapWidth(440).setLineSpacing(6);
  }
}

function resultMessageKey(performance: number): TranslationKey {
  if (performance >= MINIGAME_BALANCE.perfectThreshold) return 'minigame.result.perfect';
  if (performance >= MINIGAME_BALANCE.goodThreshold) return 'minigame.result.good';
  return 'minigame.result.tryAgain';
}

function factKey(taskId: TaskId): TranslationKey {
  return `task.${taskId}.fact`;
}
