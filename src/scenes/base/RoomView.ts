import type Phaser from 'phaser';
import { ALERT_BALANCE, RUN_BALANCE, TASK_BALANCE } from '../../config/balance';
import type { StatId, TaskId } from '../../core/types';
import { t } from '../../i18n';
import { addIconLabel } from '../../ui/iconLabel';
import {
  FONT_SIZE,
  ROOM_LAYOUTS,
  STAT_BAR_SEGMENT_GAP,
  STAT_BAR_SEGMENTS,
  type Point,
  type Rect,
  type RoomLayout,
} from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { STAT_ICON_SPRITES } from '../../ui/sprites';

/**
 * One room of the isometric base. The room itself is drawn in the map; this adds its sign
 * and the touch area, far bigger than 48 px. The sign is a small card: icon + name on top and
 * the room's bar inside it, so the kid sees how each room is doing right where it is (these
 * are the only stat bars in the game). The bar is made of blocks, like a screen meter, so it
 * reads at a glance. Its frame and bar blink red when the bar is low.
 */
const LABEL_ICON_SIZE = 16;
const LABEL_PADDING = 4;
const LABEL_ALPHA = 0.8;
const BLINK_PERIOD_MS = 300;
/** Crew slots 0–3 are spread evenly on both sides of the work center. */
const MIDDLE_SLOT = 1.5;
const BAR_HEIGHT = 8;
const BAR_GAP = 3;
const DIM_SEGMENT_ALPHA = 0.3;
const ALERT_STROKE = 3;
const FLASH_MS = 400;
const FLASH_MARGIN = 6;

export class RoomView {
  readonly rect: Rect;
  private readonly layout: RoomLayout;
  private readonly plate: Phaser.GameObjects.Rectangle;
  private readonly bar: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    readonly taskId: TaskId,
    onTap: (taskId: TaskId) => void,
  ) {
    this.layout = ROOM_LAYOUTS[taskId];
    this.rect = this.layout.rect;
    const { x, y, width, height } = this.rect;
    const zone = scene.add.zone(x, y, width, height).setOrigin(0);
    zone.setInteractive({ useHandCursor: true }).on('pointerup', () => onTap(taskId));
    this.plate = this.drawLabel(scene);
    this.bar = scene.add.graphics();
  }

  /** Astronauts walk in and out of the room through this point. */
  get door(): Point {
    return this.layout.door;
  }

  /** Where each crew member stands to work: one step apart, so they never overlap. */
  workSpot(slot: number): Point {
    const { workCenter, workStep } = this.layout;
    const offset = slot - MIDDLE_SLOT;
    return { x: workCenter.x + workStep.x * offset, y: workCenter.y + workStep.y * offset };
  }

  /** Middle of this room's bar: task effects fly here and the tutorial points at it. */
  get barCenter(): Point {
    return { x: this.plate.x, y: this.barTop + BAR_HEIGHT / 2 };
  }

  /** A short white glow on the bar, so a kid sees exactly which bar just changed. */
  flashBar(): void {
    const { x, y } = this.barCenter;
    const width = this.plate.width + FLASH_MARGIN;
    const glow = this.scene.add.rectangle(x, y, width, BAR_HEIGHT + FLASH_MARGIN, PALETTE.white);
    glow.setAlpha(0.8);
    this.scene.tweens.add({
      targets: glow,
      alpha: 0,
      duration: FLASH_MS,
      onComplete: () => glow.destroy(),
    });
  }

  /** The bar runs along the bottom of the card, inside it. */
  private get barTop(): number {
    return this.plate.y + this.plate.height / 2 - LABEL_PADDING - BAR_HEIGHT;
  }

  /** The card's frame and bar blink red while this room's bar is low. */
  update(stats: Record<StatId, number>, timeMs: number): void {
    const stat = TASK_BALANCE[this.taskId].stat;
    const isLow = stats[stat] < ALERT_BALANCE.lowStatThreshold;
    const blinkOn = isLow && Math.floor(timeMs / BLINK_PERIOD_MS) % 2 === 0;
    // Only the frame and the bar blink: a red card would hide the name (low contrast).
    this.plate.setStrokeStyle(
      isLow ? ALERT_STROKE : 1,
      blinkOn ? PALETTE.alert : STAT_COLORS[stat],
    );
    this.drawBar(stats[stat], stat, isLow, blinkOn);
  }

  /**
   * Separate blocks along the bottom of the card: lit in the stat color up to the bar's value,
   * dim after it. While the bar is low the lit blocks blink red.
   */
  private drawBar(value: number, stat: StatId, isLow: boolean, blinkOn: boolean): void {
    const width = this.plate.width - LABEL_PADDING * 2;
    const left = this.plate.x - width / 2;
    const segmentWidth =
      (width - STAT_BAR_SEGMENT_GAP * (STAT_BAR_SEGMENTS - 1)) / STAT_BAR_SEGMENTS;
    // Any bar above 0 shows at least one block, so "almost empty" never looks empty.
    const lit = Math.ceil((value / RUN_BALANCE.maxStatValue) * STAT_BAR_SEGMENTS);
    const litColor = blinkOn ? PALETTE.alert : STAT_COLORS[stat];
    this.bar.clear();
    for (let segment = 0; segment < STAT_BAR_SEGMENTS; segment += 1) {
      const isLit = segment < lit;
      this.bar.fillStyle(
        isLit ? litColor : isLow ? PALETTE.alert : PALETTE.metal,
        isLit ? 1 : DIM_SEGMENT_ALPHA,
      );
      const x = left + segment * (segmentWidth + STAT_BAR_SEGMENT_GAP);
      this.bar.fillRect(x, this.barTop, segmentWidth, BAR_HEIGHT);
    }
  }

  private drawLabel(scene: Phaser.Scene): Phaser.GameObjects.Rectangle {
    const stat = TASK_BALANCE[this.taskId].stat;
    const { label } = this.layout;
    const plate = scene.add.rectangle(label.x, label.y, 1, 1, PALETTE.night, LABEL_ALPHA);
    const sign = addIconLabel(
      scene,
      label.x,
      label.y,
      STAT_ICON_SPRITES[stat],
      LABEL_ICON_SIZE,
      t(`task.${this.taskId}.name` as const),
      { size: FONT_SIZE.small, color: STAT_COLORS[stat] },
    );
    const width = sign.text.width + LABEL_ICON_SIZE + LABEL_PADDING * 3;
    const rowHeight = Math.max(sign.text.height, LABEL_ICON_SIZE);
    const height = rowHeight + BAR_GAP + BAR_HEIGHT + LABEL_PADDING * 2;
    // The name row stays on the layout point; the card grows down to hold the bar.
    const top = label.y - rowHeight / 2 - LABEL_PADDING;
    plate
      .setSize(width, height)
      .setY(top + height / 2)
      .setStrokeStyle(1, STAT_COLORS[stat]);
    return plate;
  }
}
