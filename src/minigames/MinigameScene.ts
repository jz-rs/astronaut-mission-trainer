/**
 * CONTRACT between the base (spec 04) and every minigame (specs 07–10, 15). See spec 06.
 *
 * Input  (MinigameStartData): which task it is, how hard the location is, and a callback.
 * Output (MinigameResult):    { taskId, performance } with performance from 0 to 1.2
 *                             (1 = good, above perfectThreshold = PERFECT).
 *
 * This base class does everything that is common, so a minigame only builds its little game:
 *   - dims the base and draws the panel, the one-line instruction and the time bar;
 *   - draws the room, as dark as the base when night comes (`nightAmount`, ui/nightfall.ts);
 *   - ends the game when time runs out (or when the minigame calls `finish()`);
 *   - draws the X to leave early: no result, no reward and no energy spent (`onExit`);
 *   - optionally pauses the whole game (`pauseGame` / `resumeGame`): its own clock AND the base
 *     behind it, so the survival bars don't drop while a minigame explains how it is played;
 *   - shows "PERFECT! / Well done! / Almost!" plus what it teaches (resultCard.ts), with the
 *     base paused so it can be read calmly, and reports and closes when the kid taps GO ON.
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
import { SCENE_KEYS } from '../scenes/sceneKeys';
import { showResultCard } from './resultCard';
import {
  FONT_SIZE,
  GAME_HEIGHT,
  GAME_WIDTH,
  HUD_HEIGHT,
  MINIGAME_AREA,
  MINIGAME_PANEL,
  type Point,
  type Rect,
} from '../ui/layout';
import { addCloseButton } from '../ui/closeButton';
import { addIconLabel } from '../ui/iconLabel';
import { PALETTE, STAT_COLORS } from '../ui/palette';
import { roomBackgroundKey } from '../ui/biomes';
import { NightShade } from '../ui/nightfall';
import { STAT_ICON_SPRITES } from '../ui/sprites';
import { addScanlines, drawTechPanel } from '../ui/techFrame';

import type { MinigameEnvironment, MinigameStartData } from './minigameTypes';
export type { MinigameEnvironment, MinigameResult, MinigameStartData } from './minigameTypes';

const DIM_ALPHA = 0.55;
const TIME_BAR_HEIGHT = 6;
const INSTRUCTION_ICON_SIZE = 16;
/** The room picture is taller than the play area: skip this much of its top (texture pixels). */
const ROOM_CROP_TOP = 130;

export abstract class MinigameScene extends Phaser.Scene {
  protected taskId: TaskId = 'solar-panels';
  protected difficulty = 1;
  /** 0 = day, 1 = night: the room is already darkened; a minigame may use it (less sunlight). */
  protected nightAmount = 0;
  protected locationId: string | undefined;
  protected readEnvironment: (() => MinigameEnvironment) | undefined;
  private onFinish: MinigameStartData['onFinish'] = () => undefined;
  private onExit: () => void = () => undefined;
  private elapsedMs = 0;
  private finished = false;
  private gamePaused = false;
  /**
   * Whether THIS minigame paused the base. Phaser applies pause/resume of another scene at the
   * end of the frame, so asking "is the base paused?" right after pausing still says no: the X
   * paused and resumed in the same frame, the resume was skipped, and the base stayed frozen.
   */
  private holdsBasePaused = false;
  private roomScale = 1;
  private roomKey = '';
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
    this.readEnvironment = data.readEnvironment;
    this.nightAmount = data.nightAmount ?? 0;
    this.onFinish = data.onFinish;
    this.onExit = data.onExit ?? (() => undefined);
    this.elapsedMs = 0;
    this.finished = false;
    this.gamePaused = false;
    this.holdsBasePaused = false;
  }

  create(): void {
    this.drawFrame();
    this.buildGame(MINIGAME_AREA);
    addScanlines(this);
  }

  update(_time: number, deltaMs: number): void {
    if (this.finished || this.gamePaused) return;
    this.elapsedMs += deltaMs;
    this.drawTimeBar();
    if (this.elapsedMs >= MINIGAME_BALANCE.durationMs) {
      this.finish();
      return;
    }
    this.updateGame?.(deltaMs);
  }

  /**
   * Freezes the minigame clock, its per-frame hook and the base behind it (bars, events, bots),
   * so the kid can learn without losing anything. Nothing moves until `resumeGame()`.
   */
  protected pauseGame(): void {
    this.gamePaused = true;
    if (this.holdsBasePaused || !this.scene.isActive(SCENE_KEYS.base)) return;
    this.scene.pause(SCENE_KEYS.base);
    this.holdsBasePaused = true;
  }

  protected resumeGame(): void {
    this.gamePaused = false;
    if (!this.holdsBasePaused) return;
    this.scene.resume(SCENE_KEYS.base);
    this.holdsBasePaused = false;
  }

  protected get isFinished(): boolean {
    return this.finished;
  }

  protected get isPlaying(): boolean {
    return !this.finished && !this.gamePaused;
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
    this.pauseGame(); // the base waits while the kid reads what the mission taught
    this.closeButton?.setVisible(false); // the result card has only its big GO ON button
    const performance = clampPerformance(this.calculatePerformance());
    showResultCard(this, this.taskId, performance, () => {
      this.leaveGame(() => this.onFinish({ taskId: this.taskId, performance }));
    });
  }

  /** Leaving early closes at once: nothing is reported as done. */
  private exit(): void {
    if (this.finished) return;
    this.finished = true;
    this.pauseGame();
    this.leaveGame(this.onExit);
  }

  /** Outdoor missions can cross an airlock; indoor missions keep closing immediately. */
  protected playExitTransition(onComplete: () => void): void {
    onComplete();
  }

  private leaveGame(report: () => void): void {
    this.closeButton?.setVisible(false);
    this.playExitTransition(() => {
      this.resumeGame();
      report();
      this.scene.stop();
    });
  }

  private drawFrame(): void {
    const dim = this.add.rectangle(0, HUD_HEIGHT, GAME_WIDTH, GAME_HEIGHT, PALETTE.night);
    dim.setOrigin(0).setAlpha(DIM_ALPHA).setInteractive(); // swallows taps meant for the base
    const statColor = STAT_COLORS[TASK_BALANCE[this.taskId].stat];
    drawTechPanel(this.add.graphics(), MINIGAME_PANEL, statColor);
    this.drawBackground(MINIGAME_AREA);
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
  protected drawBackground(area: Rect): void {
    this.drawRoom(area);
  }

  private drawRoom(area: Rect): void {
    const roomKey = roomBackgroundKey(this.taskId, this.locationId);
    const room = this.add.image(area.x, 0, roomKey).setOrigin(0);
    const scale = area.width / room.width;
    room.setCrop(0, ROOM_CROP_TOP, room.width, area.height / scale);
    room.setScale(scale).setY(area.y - ROOM_CROP_TOP * scale);
    this.roomScale = scale;
    this.roomKey = roomKey;
    new NightShade(this, area, this.nightAmount);
  }

  /**
   * Draws again, on top, the part of the room picture inside `outline` (picture pixels), so the
   * minigame sprites can stand behind it: e.g. a plant under a lamp that hangs in front of it.
   */
  protected addRoomPiece(outline: readonly Point[]): Phaser.GameObjects.Image {
    const { x, y } = this.roomPoint(0, 0);
    const piece = this.add.image(x, y, this.roomKey).setOrigin(0).setScale(this.roomScale);
    const shape = this.make.graphics({}, false).fillStyle(PALETTE.white, 1);
    shape.fillPoints(
      outline.map((point) => this.roomPoint(point.x, point.y)),
      true,
    );
    return piece.setMask(shape.createGeometryMask());
  }

  /** Where a pixel of the room picture (e.g. its window) lands on the screen. */
  protected roomPoint(pictureX: number, pictureY: number): Point {
    return {
      x: MINIGAME_AREA.x + pictureX * this.roomScale,
      y: MINIGAME_AREA.y + (pictureY - ROOM_CROP_TOP) * this.roomScale,
    };
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
