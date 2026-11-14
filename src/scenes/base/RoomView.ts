import type Phaser from 'phaser';
import { ALERT_BALANCE, TASK_BALANCE } from '../../config/balance';
import type { StatId, TaskId } from '../../core/types';
import { t } from '../../i18n';
import { addIconLabel } from '../../ui/iconLabel';
import { FONT_SIZE, ROOM_LAYOUTS, type Point, type Rect, type RoomLayout } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { STAT_ICON_SPRITES } from '../../ui/sprites';

/**
 * One room of the isometric base. The room itself is drawn in the map; this adds its sign
 * (icon + name) and the touch area, far bigger than 48 px. The sign blinks red when its bar is low.
 */
const LABEL_ICON_SIZE = 16;
const LABEL_PADDING = 4;
const LABEL_ALPHA = 0.8;
const BLINK_PERIOD_MS = 300;
/** Crew slots 0–3 are spread evenly on both sides of the work center. */
const MIDDLE_SLOT = 1.5;

export class RoomView {
  readonly rect: Rect;
  private readonly layout: RoomLayout;
  private readonly plate: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    readonly taskId: TaskId,
    onTap: (taskId: TaskId) => void,
  ) {
    this.layout = ROOM_LAYOUTS[taskId];
    this.rect = this.layout.rect;
    const { x, y, width, height } = this.rect;
    const zone = scene.add.zone(x, y, width, height).setOrigin(0);
    zone.setInteractive({ useHandCursor: true }).on('pointerup', () => onTap(taskId));
    this.plate = this.drawLabel(scene);
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

  /** The sign blinks red while this room's bar is low. */
  update(stats: Record<StatId, number>, timeMs: number): void {
    const isLow = stats[TASK_BALANCE[this.taskId].stat] < ALERT_BALANCE.lowStatThreshold;
    const blinkOn = isLow && Math.floor(timeMs / BLINK_PERIOD_MS) % 2 === 0;
    this.plate.setFillStyle(blinkOn ? PALETTE.alert : PALETTE.night, LABEL_ALPHA);
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
    const height = Math.max(sign.text.height, LABEL_ICON_SIZE) + LABEL_PADDING * 2;
    plate.setSize(width, height).setStrokeStyle(1, STAT_COLORS[stat]);
    return plate;
  }
}
