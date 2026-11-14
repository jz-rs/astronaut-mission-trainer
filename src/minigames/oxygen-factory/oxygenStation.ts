import Phaser from 'phaser';
import { OXYGEN_FACTORY_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { FONT_SIZE, type Point, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSprite } from '../../ui/sprites';
import { addText } from '../../ui/text';

/**
 * Spec 08 — The right side of the oxygen minigame: MOXIE (the oven that splits CO₂ at 800 °C),
 * the pipe where the leftover CO goes outside, and the O₂ tank that fills up as the kid wins.
 */
const RIGHT_MARGIN = 12;
const TANK_WIDTH = 44;
const TANK_GAP = 22;
const TANK_SLOT_HEIGHT = 30;
const TANK_PADDING = 4;
const PLATE_PADDING = 4;
const PLATE_ALPHA = 0.8;
const LABEL_GAP = 12;
const VENT_LENGTH = 26;
const DROP_MARGIN = 20;

export class OxygenStation {
  readonly machine = new Phaser.Geom.Rectangle();
  readonly tank = new Phaser.Geom.Rectangle();
  readonly ventExit: Point;
  private readonly machineImage: Phaser.GameObjects.Image;
  private readonly tankFill: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    area: Rect,
  ) {
    const tankHeight = OXYGEN_FACTORY_BALANCE.oxygenGoal * TANK_SLOT_HEIGHT + TANK_PADDING * 2;
    const tankX = area.x + area.width - RIGHT_MARGIN - TANK_WIDTH;
    this.tank.setTo(
      tankX,
      area.y + (area.height - tankHeight) / 2 + LABEL_GAP,
      TANK_WIDTH,
      tankHeight,
    );
    this.machineImage = addSprite(scene, 0, 0, 'oxygenMachineOff');
    const { displayWidth: width, displayHeight: height } = this.machineImage;
    const machineX = tankX - TANK_GAP - width;
    this.machine.setTo(machineX, area.y + (area.height - height) / 2 + LABEL_GAP, width, height);
    this.machineImage.setPosition(this.machine.centerX, this.machine.centerY);
    this.ventExit = { x: this.machine.right - 10, y: area.y + 4 };
    this.drawVent();
    this.drawTankShell();
    this.tankFill = scene.add.graphics().setDepth(1);
    this.addLabels();
    this.setTankLevel(0);
  }

  private addLabels(): void {
    const { machine, tank } = this;
    const name = t('minigame.oxygen-factory.machine');
    this.addLabel(machine.centerX, machine.top - LABEL_GAP, name, PALETTE.cyan);
    const heat = t('minigame.oxygen-factory.oven');
    this.addLabel(machine.centerX, machine.bottom + LABEL_GAP, heat, PALETTE.sun);
    this.addLabel(
      tank.centerX,
      tank.top - LABEL_GAP,
      t('minigame.oxygen-factory.tank'),
      PALETTE.cyan,
    );
  }

  /** Where a CO₂ comes out split: the left side of the oven. */
  get outlet(): Point {
    return { x: this.machine.left, y: this.machine.centerY };
  }

  /** Generous drop zone around MOXIE, so small fingers don't miss it. */
  isOnMachine(x: number, y: number): boolean {
    const zone = Phaser.Geom.Rectangle.Clone(this.machine);
    return Phaser.Geom.Rectangle.Inflate(zone, DROP_MARGIN, DROP_MARGIN).contains(x, y);
  }

  switchOn(): void {
    this.machineImage.setTexture('oxygenMachineOn');
  }

  setTankLevel(oxygenMade: number): void {
    const { oxygenGoal } = OXYGEN_FACTORY_BALANCE;
    const innerX = this.tank.x + TANK_PADDING;
    const innerWidth = this.tank.width - TANK_PADDING * 2;
    this.tankFill.clear();
    for (let slot = 0; slot < oxygenGoal; slot += 1) {
      const y = this.tank.bottom - TANK_PADDING - (slot + 1) * TANK_SLOT_HEIGHT;
      this.tankFill.fillStyle(slot < oxygenMade ? PALETTE.cyan : PALETTE.metalDark, 1);
      this.tankFill.fillRect(innerX, y + 1, innerWidth, TANK_SLOT_HEIGHT - 2);
    }
  }

  private drawTankShell(): void {
    const shell = this.scene.add.graphics();
    shell
      .fillStyle(PALETTE.night, 1)
      .fillRect(this.tank.x, this.tank.y, this.tank.width, this.tank.height);
    shell
      .lineStyle(2, PALETTE.metalLight, 1)
      .strokeRect(this.tank.x, this.tank.y, this.tank.width, this.tank.height);
  }

  /** A pipe from the top of MOXIE to the edge of the room: the CO goes out through it. */
  private drawVent(): void {
    const pipe = this.scene.add.graphics();
    const x = this.ventExit.x;
    pipe
      .fillStyle(PALETTE.metal, 1)
      .fillRect(x - 5, this.ventExit.y, 10, this.machine.top - this.ventExit.y);
    pipe.fillStyle(PALETTE.metalDark, 1).fillRect(x - 8, this.ventExit.y, 16, 4);
    const label = t('minigame.oxygen-factory.outside');
    this.addLabel(
      x - VENT_LENGTH - label.length * 3,
      this.ventExit.y + 8,
      label,
      PALETTE.metalLight,
    );
  }

  /** A short label on a dark plate, so it stays readable over the busy room picture. */
  private addLabel(x: number, y: number, content: string, color: number): void {
    const label = addText(this.scene, x, y, content, { size: FONT_SIZE.small, color }).setDepth(2);
    const plate = this.scene.add.rectangle(
      x,
      y,
      label.width + PLATE_PADDING * 2,
      label.height + PLATE_PADDING * 2,
      PALETTE.night,
    );
    plate.setAlpha(PLATE_ALPHA).setDepth(1);
  }
}
