/**
 * CONTRACT between the base (spec 04) and every minigame (specs 07–10, 15). See spec 06.
 *
 * Input  (MinigameStartData): which task it is, how hard the location is, and a callback.
 * Output (MinigameResult):    { taskId, performance } with performance from 0 to 1.2
 *                             (1 = good, above perfectThreshold = PERFECT).
 *
 * This base class does everything that is common, so a minigame only builds its little game:
 *   - dims the base and draws the panel, the one-line instruction and the time bar;
 *   - ends the game when time runs out (or when the minigame calls `finish()`);
 *   - shows "PERFECT! / Well done! / Almost!" plus the real fact, then reports and closes.
 *
 * To write a new minigame:
 *   1. Create `src/minigames/<name>/<Name>Minigame.ts` extending MinigameScene.
 *   2. Implement `instructionKey`, `buildGame(area)` and `calculatePerformance()`.
 *      Optionally override `updateGame(deltaMs)` and call `finish()` when the goal is reached.
 *   3. Add ONE line to `registry.ts`.
 * Do not change this file without telling A and B (AGENTS.md §1.2).
 */
import Phaser from 'phaser';
import { MINIGAME_BALANCE, TASK_BALANCE } from '../config/balance';
import { randomFactKey } from '../content/facts';
import { clampPerformance } from '../core/training';
import type { TaskId } from '../core/types';
import { t, type TranslationKey } from '../i18n';
import {
  FONT_SIZE,
  GAME_HEIGHT,
  GAME_WIDTH,
  HUD_HEIGHT,
  MINIGAME_AREA,
  MINIGAME_PANEL,
  STAT_ICONS,
  type Rect,
} from '../ui/layout';
import { PALETTE, STAT_COLORS } from '../ui/palette';
import { addScanlines, drawTechPanel } from '../ui/techFrame';
import { addText } from '../ui/text';

export interface MinigameResult {
  taskId: TaskId;
  performance: number;
}

export interface MinigameStartData {
  taskId: TaskId;
  /** 1 = normal. Comes from the location decay multiplier of this task's bar. */
  difficulty: number;
  onFinish: (result: MinigameResult) => void;
}

const DIM_ALPHA = 0.55;
const TIME_BAR_HEIGHT = 6;
const RESULT_DEPTH = 100;

export abstract class MinigameScene extends Phaser.Scene {
  protected taskId: TaskId = 'solar-panels';
  protected difficulty = 1;
  private onFinish: MinigameStartData['onFinish'] = () => undefined;
  private elapsedMs = 0;
  private finished = false;
  private timeBar: Phaser.GameObjects.Graphics | null = null;

  protected abstract readonly instructionKey: TranslationKey;
  protected abstract buildGame(area: Rect): void;
  /** 0 to 1 for partial work; use `withSpeedBonus` to reward finishing early. */
  protected abstract calculatePerformance(): number;
  /** Optional per-frame hook for moving things. */
  protected updateGame?(deltaMs: number): void;

  init(data: MinigameStartData): void {
    this.taskId = data.taskId;
    this.difficulty = data.difficulty;
    this.onFinish = data.onFinish;
    this.elapsedMs = 0;
    this.finished = false;
  }

  create(): void {
    this.drawFrame();
    this.buildGame(MINIGAME_AREA);
    addScanlines(this);
  }

  update(_time: number, deltaMs: number): void {
    if (this.finished) return;
    this.elapsedMs += deltaMs;
    this.drawTimeBar();
    if (this.elapsedMs >= MINIGAME_BALANCE.durationMs) {
      this.finish();
      return;
    }
    this.updateGame?.(deltaMs);
  }

  protected get isFinished(): boolean {
    return this.finished;
  }

  protected get timeLeftFraction(): number {
    return Math.max(0, 1 - this.elapsedMs / MINIGAME_BALANCE.durationMs);
  }

  /** completion = 1 means the goal was reached; extra points the faster it was done. */
  protected withSpeedBonus(completion: number): number {
    if (completion < 1) return completion;
    const { speedBonusMax, fullBonusTimeLeftFraction } = MINIGAME_BALANCE;
    const speed = Math.min(1, this.timeLeftFraction / fullBonusTimeLeftFraction);
    return 1 + speedBonusMax * speed;
  }

  protected finish(): void {
    if (this.finished) return;
    this.finished = true;
    const performance = clampPerformance(this.calculatePerformance());
    this.showResult(performance);
    this.time.delayedCall(MINIGAME_BALANCE.resultDisplayMs, () => {
      this.onFinish({ taskId: this.taskId, performance });
      this.scene.stop();
    });
  }

  private drawFrame(): void {
    const dim = this.add.rectangle(0, HUD_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PALETTE.night);
    dim.setOrigin(0).setAlpha(DIM_ALPHA).setInteractive(); // swallows taps meant for the base
    const statColor = STAT_COLORS[TASK_BALANCE[this.taskId].stat];
    drawTechPanel(this.add.graphics(), MINIGAME_PANEL, statColor);
    const icon = STAT_ICONS[TASK_BALANCE[this.taskId].stat];
    addText(this, GAME_WIDTH / 2, MINIGAME_PANEL.y + 18, `${icon} ${t(this.instructionKey)}`, {
      size: FONT_SIZE.medium,
    });
    this.timeBar = this.add.graphics();
    this.drawTimeBar();
  }

  private drawTimeBar(): void {
    if (!this.timeBar) return;
    const width = MINIGAME_AREA.width;
    const y = MINIGAME_PANEL.y + 34;
    const color = this.timeLeftFraction < 0.25 ? PALETTE.alert : PALETTE.cyan;
    this.timeBar.clear();
    this.timeBar
      .fillStyle(PALETTE.metalDark, 1)
      .fillRect(MINIGAME_AREA.x, y, width, TIME_BAR_HEIGHT);
    this.timeBar
      .fillStyle(color, 1)
      .fillRect(MINIGAME_AREA.x, y, width * this.timeLeftFraction, TIME_BAR_HEIGHT);
  }

  private showResult(performance: number): void {
    const { perfectThreshold, goodThreshold } = MINIGAME_BALANCE;
    const [messageKey, color]: [TranslationKey, number] =
      performance >= perfectThreshold
        ? ['minigame.result.perfect', PALETTE.sun]
        : performance >= goodThreshold
          ? ['minigame.result.good', PALETTE.green]
          : ['minigame.result.tryAgain', PALETTE.marsLight];

    const cover = this.add.graphics().setDepth(RESULT_DEPTH);
    drawTechPanel(cover, MINIGAME_AREA, color, PALETTE.space);
    const centerX = MINIGAME_AREA.x + MINIGAME_AREA.width / 2;
    const message = addText(this, centerX, MINIGAME_AREA.y + 80, t(messageKey), {
      size: FONT_SIZE.large,
      color,
    });
    message.setDepth(RESULT_DEPTH).setScale(0);
    this.tweens.add({ targets: message, scale: 1, duration: 250, ease: 'Back.Out' });
    const fact = t(randomFactKey(this.taskId));
    addText(this, centerX, MINIGAME_AREA.y + 150, fact, {
      size: FONT_SIZE.small,
      color: PALETTE.cyan,
      wrapWidth: MINIGAME_AREA.width - 60,
    }).setDepth(RESULT_DEPTH);
  }
}
