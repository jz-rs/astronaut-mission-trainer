import Phaser from 'phaser';
import { TASK_BALANCE } from '../../config/balance';
import type { TaskId } from '../../core/types';
import { t } from '../../i18n';
import { CORRIDOR, FONT_SIZE, ROOM_RECTS, type Point, type Rect } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { addSpriteSized, STAT_ICON_SPRITES } from '../../ui/sprites';
import { addText } from '../../ui/text';
import { drawFurniture } from './roomFurniture';

/**
 * One room of the base: floor, walls with a door to the corridor, furniture, icon and name.
 * The whole room is the touch area (far bigger than 48 px), and it blinks red when its bar is low.
 */
const WALL = 4;
const DOOR_WIDTH = 44;
const FURNITURE_HEIGHT = 44;
const BLINK_PERIOD_MS = 300;
const ALARM_ALPHA_HIGH = 0.4;
const ALARM_ALPHA_LOW = 0.12;
const WORK_ROW_INSET = 30;
const WORK_SPOTS_START_X = 168;
const WORK_SPOT_SPACING = 26;
const LABEL_ICON_X = 22;
const LABEL_ICON_SIZE = 28;
const LABEL_NAME_X = 84;
const LABEL_NAME_WRAP = 100;

export class RoomView {
  readonly rect: Rect;
  private readonly alarm: Phaser.GameObjects.Rectangle;
  private readonly isAboveCorridor: boolean;

  constructor(
    scene: Phaser.Scene,
    readonly taskId: TaskId,
    onTap: (taskId: TaskId) => void,
  ) {
    this.rect = ROOM_RECTS[taskId];
    this.isAboveCorridor = this.rect.y < CORRIDOR.y;
    this.drawRoom(scene);
    this.drawLabel(scene);
    const { x, y, width, height } = this.rect;
    this.alarm = scene.add.rectangle(x, y, width, height, PALETTE.alert).setOrigin(0).setAlpha(0);
    const zone = scene.add
      .zone(x, y, width, height)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });
    zone.on('pointerup', () => onTap(taskId));
  }

  /** Astronauts enter and leave through this x (the door to the corridor). */
  get doorX(): number {
    return this.rect.x + this.rect.width / 2;
  }

  /** Where an astronaut stands to work: right half of the room, one slot per crew member. */
  workSpot(slot: number): Point {
    return { x: this.rect.x + WORK_SPOTS_START_X + slot * WORK_SPOT_SPACING, y: this.workRowY() };
  }

  /** The free row between the furniture and the door: name on the left, workers on the right. */
  private workRowY(): number {
    return this.isAboveCorridor
      ? this.rect.y + this.rect.height - WORK_ROW_INSET
      : this.rect.y + WORK_ROW_INSET;
  }

  setAlarm(active: boolean, timeMs: number): void {
    if (!active) {
      this.alarm.setAlpha(0);
      return;
    }
    const high = Math.floor(timeMs / BLINK_PERIOD_MS) % 2 === 0;
    this.alarm.setAlpha(high ? ALARM_ALPHA_HIGH : ALARM_ALPHA_LOW);
  }

  private drawRoom(scene: Phaser.Scene): void {
    const { x, y, width, height } = this.rect;
    const accent = STAT_COLORS[TASK_BALANCE[this.taskId].stat];
    const graphics = scene.add.graphics();
    graphics
      .fillStyle(PALETTE.metal, 1)
      .fillRect(x - WALL, y - WALL, width + WALL * 2, height + WALL * 2);
    graphics.fillStyle(PALETTE.space, 1).fillRect(x, y, width, height);
    graphics.lineStyle(1, PALETTE.metalDark, 1);
    for (let tileX = x + 16; tileX < x + width; tileX += 16)
      graphics.lineBetween(tileX, y, tileX, y + height);
    for (let tileY = y + 16; tileY < y + height; tileY += 16)
      graphics.lineBetween(x, tileY, x + width, tileY);
    graphics.fillStyle(accent, 1).fillRect(x, y, width, 3); // room color strip
    this.drawDoor(graphics, accent);
    const furnitureY = this.isAboveCorridor ? y + 10 : y + height - FURNITURE_HEIGHT - 10;
    drawFurniture(graphics, this.taskId, {
      x: x + 8,
      y: furnitureY,
      width: width - 16,
      height: FURNITURE_HEIGHT,
    });
  }

  private drawDoor(graphics: Phaser.GameObjects.Graphics, accent: number): void {
    const doorX = this.rect.x + this.rect.width / 2 - DOOR_WIDTH / 2;
    const wallY = this.isAboveCorridor ? this.rect.y + this.rect.height : this.rect.y - WALL;
    graphics.fillStyle(PALETTE.space, 1).fillRect(doorX, wallY, DOOR_WIDTH, WALL);
    graphics
      .fillStyle(accent, 1)
      .fillRect(doorX - 3, wallY, 3, WALL)
      .fillRect(doorX + DOOR_WIDTH, wallY, 3, WALL);
    const connectorY = this.isAboveCorridor ? wallY + WALL : CORRIDOR.y + CORRIDOR.height;
    const connectorHeight = this.isAboveCorridor ? CORRIDOR.y - connectorY : wallY - connectorY;
    graphics.fillStyle(PALETTE.space, 1).fillRect(doorX, connectorY, DOOR_WIDTH, connectorHeight);
  }

  private drawLabel(scene: Phaser.Scene): void {
    const stat = TASK_BALANCE[this.taskId].stat;
    const labelY = this.workRowY();
    addSpriteSized(
      scene,
      this.rect.x + LABEL_ICON_X,
      labelY,
      STAT_ICON_SPRITES[stat],
      LABEL_ICON_SIZE,
    );
    addText(scene, this.rect.x + LABEL_NAME_X, labelY, t(`task.${this.taskId}.name` as const), {
      size: FONT_SIZE.small,
      color: STAT_COLORS[stat],
      wrapWidth: LABEL_NAME_WRAP,
    });
  }
}
