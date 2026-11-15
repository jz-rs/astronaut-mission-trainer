import Phaser from 'phaser';
import { t } from '../../i18n';
import { floatText } from '../../ui/floatingText';
import type { Point } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addTube, drawTube } from './roverIcons';

/**
 * Mission 5 — One sample tube, open and waiting next to the rock. Once the core is in, a ring at
 * its mouth asks for the seal. Sealed: the cap goes on and it flies to the shelf. Left open:
 * Mars dust falls in and the sample is ruined. Each new tube of the trip is a new SampleTube.
 */
export const TUBE_HEIGHT = 72;
const MOUTH_RING_RADIUS = 16;
const DUST_GRAINS = 6;
const FLY_MS = 500;
const MESSAGE_BELOW = 16;

export class SampleTube {
  private readonly body: Phaser.GameObjects.Graphics;
  private readonly mouthRing: Phaser.GameObjects.Arc;
  private core: Phaser.GameObjects.Container | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    readonly at: Point,
  ) {
    this.body = addTube(scene, TUBE_HEIGHT, 'open').setPosition(at.x, at.y);
    this.mouthRing = scene.add.circle(at.x, this.mouth.y, MOUTH_RING_RADIUS);
    this.mouthRing.setStrokeStyle(3, PALETTE.sun).setVisible(false);
  }

  get mouth(): Point {
    return { x: this.at.x, y: this.at.y - TUBE_HEIGHT / 2 };
  }

  /** The core slides in and the pulsing ring asks for the seal. */
  receive(core: Phaser.GameObjects.Container): void {
    this.core = core;
    core.disableInteractive();
    this.scene.children.bringToTop(this.body);
    this.scene.tweens.add({ targets: core, x: this.at.x, y: this.at.y, duration: 150 });
    this.mouthRing.setVisible(true);
    this.scene.tweens.add({
      targets: this.mouthRing,
      scale: 1.3,
      yoyo: true,
      repeat: -1,
      duration: 300,
    });
  }

  /** The ring closes, the cap goes on and the tube (with its core) flies to `slot`. */
  seal(slot: Point): void {
    this.closeRing();
    drawTube(this.body, TUBE_HEIGHT, 'sealed');
    this.say('rover.sealed', PALETTE.cyan);
    const flash = Phaser.Display.Color.IntegerToRGB(TECH_GLOW);
    this.scene.cameras.main.flash(120, flash.r, flash.g, flash.b);
    const flying = [this.body, ...(this.core ? [this.core] : [])];
    const fly = { x: slot.x, y: slot.y, scale: 0.4, duration: FLY_MS, ease: 'Sine.InOut' };
    this.scene.tweens.add({ targets: flying, ...fly });
  }

  /** Too slow: dust falls into the open tube, which turns rusty and stays out of the shelf. */
  contaminate(): void {
    this.closeRing();
    for (let grain = 0; grain < DUST_GRAINS; grain += 1) {
      const x = this.at.x + Phaser.Math.Between(-10, 10);
      const dust = this.scene.add.circle(x, this.at.y - TUBE_HEIGHT, 2, PALETTE.marsLight);
      const fall = { y: this.at.y, alpha: 0, delay: grain * 60, duration: 400 };
      this.scene.tweens.add({ targets: dust, ...fall, onComplete: () => dust.destroy() });
    }
    drawTube(this.body, TUBE_HEIGHT, 'contaminated');
    this.say('rover.contaminated', PALETTE.alert);
  }

  /** A ruined tube is thrown away, so the next one has the spot. */
  discard(): void {
    const parts = [this.body, ...(this.core ? [this.core] : [])];
    this.scene.tweens.add({
      targets: parts,
      alpha: 0,
      duration: 200,
      onComplete: () => parts.forEach((part) => part.destroy()),
    });
  }

  private closeRing(): void {
    this.scene.tweens.killTweensOf(this.mouthRing);
    this.scene.tweens.add({
      targets: this.mouthRing,
      scale: 0,
      duration: 200,
      onComplete: () => this.mouthRing.destroy(),
    });
  }

  private say(key: 'rover.sealed' | 'rover.contaminated', color: number): void {
    const y = this.at.y + TUBE_HEIGHT / 2 + MESSAGE_BELOW;
    floatText(this.scene, this.at.x, y, t(key), color);
  }
}
