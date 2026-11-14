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
 *   - draws the X to leave early: no result, no reward and no energy spent (`onExit`);
 *   - shows "PERFECT! / Well done! / Almost!" plus what it teaches (resultCard.ts), and reports
 *     and closes when the kid taps GO ON.
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
import { clampPerformance } from '../core/training';
import type { TaskId } from '../core/types';
import { t, type TranslationKey } from '../i18n';
import { showResultCard } from './resultCard';
import {
  FONT_SIZE,
  GAME_HEIGHT,
  GAME_WIDTH,
  HUD_HEIGHT,
  MINIGAME_AREA,
  MINIGAME_PANEL,
  type Rect,
} from '../ui/layout';
import { addCloseButton } from '../ui/closeButton';
import { addIconLabel } from '../ui/iconLabel';
import { PALETTE, STAT_COLORS } from '../ui/palette';
import { roomBackgroundKey } from '../ui/biomes';
import { STAT_ICON_SPRITES } from '../ui/sprites';
import { addScanlines, drawTechPanel } from '../ui/techFrame';

export interface MinigameResult {
  taskId: TaskId;
  performance: number;
}

export interface MinigameStartData {
  taskId: TaskId;
  /** 1 = normal. Comes from the location decay multiplier of this task's bar. */
  difficulty: number;
  /** Level the base is on: its rooms show a real photo of that place through the window. */
  locationId?: string;
  onFinish: (result: MinigameResult) => void;
  /** The kid tapped the X: the task was not done. */
  onExit?: () => void;
}

const DIM_ALPHA = 0.55;
const TIME_BAR_HEIGHT = 6;
const INSTRUCTION_ICON_SIZE = 16;
/** The room picture is taller than the play area: skip this much of its top (texture pixels). */
const ROOM_CROP_TOP = 130;

export abstract class MinigameScene extends Phaser.Scene {
  protected taskId: TaskId = 'solar-panels';
  protected difficulty = 1;
  private locationId: string | undefined;
  private onFinish: MinigameStartData['onFinish'] = () => undefined;
  private onExit: () => void = () => undefined;
  private elapsedMs = 0;
  private finished = false;
  private timeBar: Phaser.GameObjects.Graphics | null = null;
  private closeButton: Phaser.GameObjects.Container | null = null;

  protected abstract readonly instructionKey: TranslationKey;
  protected abstract buildGame(area: Rect): void;
  /** 0 to 1 for partial work; use `withSpeedBonus` to reward finishing early. */
  protected abstract calculatePerformance(): number;
  /** Optional per-frame hook for moving things. */
  protected updateGame?(deltaMs: number): void;

  init(data: MinigameStartData): void {
    this.taskId = data.taskId;
    this.difficulty = data.difficulty;
    this.locationId = data.locationId;
    this.onFinish = data.onFinish;
    this.onExit = data.onExit ?? (() => undefined);
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
    this.closeButton?.setVisible(false); // the result card has its own GO ON button
    const performance = clampPerformance(this.calculatePerformance());
    showResultCard(this, this.taskId, performance, () => {
      this.onFinish({ taskId: this.taskId, performance });
      this.scene.stop();
    });
  }

  /** Leaving early closes at once: nothing is reported as done. */
  private exit(): void {
    if (this.finished) return;
    this.finished = true;
    this.onExit();
    this.scene.stop();
  }

  private drawFrame(): void {
    const dim = this.add.rectangle(0, HUD_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PALETTE.night);
    dim.setOrigin(0).setAlpha(DIM_ALPHA).setInteractive(); // swallows taps meant for the base
    const statColor = STAT_COLORS[TASK_BALANCE[this.taskId].stat];
    drawTechPanel(this.add.graphics(), MINIGAME_PANEL, statColor);
    this.drawRoom();
    const icon = STAT_ICON_SPRITES[TASK_BALANCE[this.taskId].stat];
    addIconLabel(
      this,
      GAME_WIDTH / 2,
      MINIGAME_PANEL.y + 18,
      icon,
      INSTRUCTION_ICON_SIZE,
      t(this.instructionKey),
      { size: FONT_SIZE.medium },
    );
    this.timeBar = this.add.graphics();
    this.drawTimeBar();
    this.closeButton = addCloseButton(this, () => this.exit());
  }

  /** The empty room of this task fills the play area; the minigame sprites go on top. */
  private drawRoom(): void {
    const roomKey = roomBackgroundKey(this.taskId, this.locationId);
    const room = this.add.image(MINIGAME_AREA.x, 0, roomKey).setOrigin(0);
    const scale = MINIGAME_AREA.width / room.width;
    room.setCrop(0, ROOM_CROP_TOP, room.width, MINIGAME_AREA.height / scale);
    room.setScale(scale).setY(MINIGAME_AREA.y - ROOM_CROP_TOP * scale);
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
}
