import type Phaser from 'phaser';
import { PALETTE } from '../../ui/palette';
import { addMolecule } from './molecules';
import type { OxygenStation } from './oxygenStation';

/**
 * Spec 08 — A little window on MOXIE so the kid SEES what happens inside, like the real
 * machine on Perseverance:
 *   1. the CO₂ gets hot (orange) and shakes... crack! one blue O jumps out;
 *   2. the leftover CO (grey) goes out through the grey pipe, like smoke;
 *   3. the O waits in one of two little spots for its partner;
 *   4. with two O waiting, they come together, click, and make O₂, which goes to the tank.
 * So the kid learns without reading that 2 CO₂ are needed for 1 O₂.
 */
const WINDOW_WIDTH = 80;
const WINDOW_HEIGHT = 56;
const WINDOW_OFFSET_Y = -4;
const MOLECULE_SCALE = 0.7;
const SLOT_SPREAD = 16;
const SLOT_OFFSET_Y = 12;
const TOP_OFFSET_Y = -12;
const SLOT_RADIUS = 9;
const HEAT_ALPHA = 0.65;
const HEAT_MS = 350;
const MOVE_MS = 300;
const PAIR_MS = 250;
const DEPTH = 3;

export class MoxieWindow {
  private readonly centerX: number;
  private readonly centerY: number;
  private readonly heat: Phaser.GameObjects.Rectangle;
  private waiting: Phaser.GameObjects.Container[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly station: OxygenStation,
  ) {
    this.centerX = station.machine.centerX;
    this.centerY = station.machine.centerY + WINDOW_OFFSET_Y;
    const glass = scene.add.rectangle(
      this.centerX,
      this.centerY,
      WINDOW_WIDTH,
      WINDOW_HEIGHT,
      PALETTE.night,
    );
    glass.setStrokeStyle(3, PALETTE.metalLight).setDepth(DEPTH);
    this.heat = scene.add.rectangle(
      this.centerX,
      this.centerY,
      WINDOW_WIDTH,
      WINDOW_HEIGHT,
      PALETTE.marsLight,
    );
    this.heat.setAlpha(0).setDepth(DEPTH);
    const slots = scene.add.graphics().setDepth(DEPTH);
    slots.lineStyle(2, PALETTE.metal, 1);
    for (const slot of [0, 1]) {
      const { x, y } = this.slotPosition(slot);
      slots.strokeCircle(x, y, SLOT_RADIUS);
    }
  }

  /**
   * One CO₂ goes in. `onWaiting` runs when its O is left alone waiting for a partner;
   * `onOxygen` runs with the new O₂ when two O came together.
   */
  feed(onWaiting: () => void, onOxygen: (oxygen: Phaser.GameObjects.Container) => void): void {
    this.station.shake();
    this.scene.tweens.add({ targets: this.heat, alpha: HEAT_ALPHA, duration: HEAT_MS, yoyo: true });
    const carbonDioxide = this.addInside('co2', this.centerX, this.centerY + TOP_OFFSET_Y);
    this.scene.tweens.add({
      targets: carbonDioxide,
      angle: 8,
      duration: 60,
      yoyo: true,
      repeat: 2,
    });
    this.scene.time.delayedCall(HEAT_MS, () => {
      carbonDioxide.destroy();
      this.crack(onWaiting, onOxygen);
    });
  }

  /** The CO₂ breaks: the CO leaves through the grey pipe and the O goes to a free spot. */
  private crack(
    onWaiting: () => void,
    onOxygen: (oxygen: Phaser.GameObjects.Container) => void,
  ): void {
    const topY = this.centerY + TOP_OFFSET_Y;
    this.station.sendOutside(this.addInside('co', this.centerX - SLOT_SPREAD / 2, topY));
    const atom = this.addInside('o', this.centerX + SLOT_SPREAD, topY);
    const slot = this.slotPosition(this.waiting.length % 2);
    this.waiting.push(atom);
    const pair = this.waiting.length >= 2 ? this.waiting.splice(0, 2) : null;
    this.scene.tweens.add({
      targets: atom,
      x: slot.x,
      y: slot.y,
      duration: MOVE_MS,
      ease: 'Back.Out',
      onComplete: () => (pair ? this.makeOxygen(pair, onOxygen) : onWaiting()),
    });
  }

  /** The two O come together and click: one O₂. */
  private makeOxygen(
    pair: Phaser.GameObjects.Container[],
    onOxygen: (oxygen: Phaser.GameObjects.Container) => void,
  ): void {
    const y = this.centerY + SLOT_OFFSET_Y;
    this.scene.tweens.add({
      targets: pair,
      x: this.centerX,
      y,
      duration: PAIR_MS,
      onComplete: () => {
        pair.forEach((atom) => atom.destroy());
        const oxygen = this.addInside('o2', this.centerX, y);
        this.scene.tweens.add({
          targets: oxygen,
          scale: { from: 1.2, to: MOLECULE_SCALE },
          duration: PAIR_MS,
        });
        onOxygen(oxygen);
      },
    });
  }

  private addInside(
    kind: 'co2' | 'co' | 'o' | 'o2',
    x: number,
    y: number,
  ): Phaser.GameObjects.Container {
    return addMolecule(this.scene, kind, x, y)
      .setScale(MOLECULE_SCALE)
      .setDepth(DEPTH + 1);
  }

  private slotPosition(slot: number): { x: number; y: number } {
    const side = slot === 0 ? -1 : 1;
    return { x: this.centerX + side * SLOT_SPREAD, y: this.centerY + SLOT_OFFSET_Y };
  }
}
