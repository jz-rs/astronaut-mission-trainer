import Phaser from 'phaser';
import { OXYGEN_FACTORY_BALANCE } from '../../config/balance';
import { t, type TranslationKey } from '../../i18n';
import type { Point, Rect } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { addSprite } from '../../ui/sprites';
import { addPlateLabel } from '../../ui/plateLabel';

/**
 * Spec 08 — The right side of the oxygen minigame: MOXIE, the grey pipe where the leftover CO
 * goes outside, the blue pipe that carries the O₂ and the tank that fills up as the kid wins.
 * Pipes have the color of what goes through them: grey = leftover, blue = oxygen.
 */
const RIGHT_MARGIN = 12;
const TANK_WIDTH = 44;
const TANK_GAP = 22;
const TANK_SLOT_HEIGHT = 30;
const TANK_PADDING = 4;
const LABEL_GAP = 12;
const PIPE_WIDTH = 10;
/** Dark edge around the pipes so they stand out over the room picture. */
const PIPE_OUTLINE = 2;
const DROP_MARGIN = 20;
const VENT_MS = 900;
const TANK_MS = 500;
const SHAKE_PIXELS = 3;
const SHAKE_MS = 40;

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
    const tankY = area.y + (area.height - tankHeight) / 2 + LABEL_GAP;
    this.tank.setTo(tankX, tankY, TANK_WIDTH, tankHeight);
    this.machineImage = addSprite(scene, 0, 0, 'oxygenMachineOff');
    const { displayWidth: width, displayHeight: height } = this.machineImage;
    const machineY = area.y + (area.height - height) / 2 + LABEL_GAP;
    this.machine.setTo(tankX - TANK_GAP - width, machineY, width, height);
    this.machineImage.setPosition(this.machine.centerX, this.machine.centerY);
    this.ventExit = { x: this.machine.right - 10, y: area.y + 4 };
    this.drawPipes();
    this.drawTankShell();
    this.tankFill = scene.add.graphics().setDepth(1);
    this.addLabels();
    this.setTankLevel(0);
  }

  /** Generous drop zone around MOXIE, so small fingers don't miss it. */
  isOnMachine(x: number, y: number): boolean {
    const zone = Phaser.Geom.Rectangle.Clone(this.machine);
    return Phaser.Geom.Rectangle.Inflate(zone, DROP_MARGIN, DROP_MARGIN).contains(x, y);
  }

  /** A CO₂ went in: MOXIE switches on and shakes. */
  shake(): void {
    const { centerX } = this.machine;
    this.machineImage.setTexture('oxygenMachineOn').setX(centerX);
    this.scene.tweens.add({
      targets: this.machineImage,
      x: centerX + SHAKE_PIXELS,
      duration: SHAKE_MS,
      yoyo: true,
      repeat: 3,
      onComplete: () => this.machineImage.setX(centerX),
    });
  }

  /** The leftover CO goes up the grey pipe and leaves the base, like smoke. */
  sendOutside(carbonMonoxide: Phaser.GameObjects.Container): void {
    this.scene.tweens.chain({
      targets: carbonMonoxide,
      tweens: [
        { x: this.ventExit.x, y: this.machine.top, duration: VENT_MS / 3 },
        { y: this.ventExit.y, alpha: 0, scale: 1.4, duration: VENT_MS },
      ],
      onComplete: () => carbonMonoxide.destroy(),
    });
  }

  /** A new O₂ travels through the blue pipe into the tank. */
  storeOxygen(oxygen: Phaser.GameObjects.Container, onStored: () => void): void {
    this.scene.tweens.add({
      targets: oxygen,
      x: this.tank.centerX,
      y: this.tank.centerY,
      scale: 0.6,
      duration: TANK_MS,
      onComplete: () => {
        oxygen.destroy();
        onStored();
      },
    });
  }

  setTankLevel(oxygenMade: number): void {
    const innerX = this.tank.x + TANK_PADDING;
    const innerWidth = this.tank.width - TANK_PADDING * 2;
    this.tankFill.clear();
    for (let slot = 0; slot < OXYGEN_FACTORY_BALANCE.oxygenGoal; slot += 1) {
      const y = this.tank.bottom - TANK_PADDING - (slot + 1) * TANK_SLOT_HEIGHT;
      this.tankFill.fillStyle(slot < oxygenMade ? STAT_COLORS.oxygen : PALETTE.metalDark, 1);
      this.tankFill.fillRect(innerX, y + 1, innerWidth, TANK_SLOT_HEIGHT - 2);
    }
  }

  private drawPipes(): void {
    const { ventExit, machine, tank } = this;
    const ventHeight = machine.top - ventExit.y;
    this.drawPipe(ventExit.x - PIPE_WIDTH / 2, ventExit.y, PIPE_WIDTH, ventHeight, PALETTE.metal);
    const tankPipeWidth = tank.left - machine.right + 8;
    const tankPipeY = tank.centerY - PIPE_WIDTH / 2;
    this.drawPipe(machine.right - 4, tankPipeY, tankPipeWidth, PIPE_WIDTH, STAT_COLORS.oxygen);
  }

  private drawPipe(x: number, y: number, width: number, height: number, color: number): void {
    const pipe = this.scene.add.graphics();
    pipe.fillStyle(PALETTE.night, 1);
    pipe.fillRect(
      x - PIPE_OUTLINE,
      y - PIPE_OUTLINE,
      width + PIPE_OUTLINE * 2,
      height + PIPE_OUTLINE * 2,
    );
    pipe.fillStyle(color, 1).fillRect(x, y, width, height);
  }

  private drawTankShell(): void {
    const shell = this.scene.add.graphics();
    const { x, y, width, height } = this.tank;
    shell.fillStyle(PALETTE.night, 1).fillRect(x, y, width, height);
    shell.lineStyle(2, PALETTE.metalLight, 1).strokeRect(x, y, width, height);
  }

  private addLabels(): void {
    const { scene, machine, tank, ventExit } = this;
    const label = (x: number, y: number, key: TranslationKey, color: number) =>
      addPlateLabel(scene, x, y, t(key), color);
    label(
      machine.centerX,
      machine.top - LABEL_GAP,
      'minigame.oxygen-factory.machine',
      PALETTE.cyan,
    );
    label(machine.centerX, machine.bottom + LABEL_GAP, 'minigame.oxygen-factory.oven', PALETTE.sun);
    label(tank.centerX, tank.top - LABEL_GAP, 'minigame.oxygen-factory.tank', STAT_COLORS.oxygen);
    const outsideWidth = t('minigame.oxygen-factory.outside').length * 4;
    const outsideX = ventExit.x - outsideWidth - PIPE_WIDTH;
    label(outsideX, ventExit.y + 8, 'minigame.oxygen-factory.outside', PALETTE.metalLight);
  }
}
