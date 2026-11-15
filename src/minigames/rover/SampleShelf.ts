import type Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import type { Point, Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addTube } from './roverIcons';

/**
 * Mission 5 — The rover's tube shelf: each full tube is a slot that lights up. The stones caught
 * while driving are already there, sealed; the next free slot glows, waiting for a drilled core.
 * Enough slots always stay free for the tubes of this trip.
 */
const COLUMNS = 2;
const SLOT = { width: 30, height: 52 };
const TUBE_HEIGHT = 36;
const PADDING = 8;
const RIGHT_MARGIN = 10;

export class SampleShelf {
  private readonly slots: Point[];
  private readonly glow: Phaser.GameObjects.Rectangle;
  private filled: number;

  constructor(
    private readonly scene: Phaser.Scene,
    play: Rect,
    caughtStones: number,
  ) {
    const rows = Math.ceil(ROVER_BALANCE.shelfSlots / COLUMNS);
    const width = COLUMNS * SLOT.width + PADDING * 2;
    const height = rows * SLOT.height + PADDING * 2;
    const left = play.x + play.width - width - RIGHT_MARGIN;
    const top = play.y + (play.height - height) / 2;
    drawTechPanel(scene.add.graphics(), { x: left, y: top, width, height }, PALETTE.cyan);
    this.slots = Array.from({ length: ROVER_BALANCE.shelfSlots }, (_, index) => ({
      x: left + PADDING + SLOT.width * ((index % COLUMNS) + 0.5),
      y: top + PADDING + SLOT.height * (Math.floor(index / COLUMNS) + 0.5),
    }));
    // The tubes of this trip always fit, even after a great drive.
    const keptFree = ROVER_BALANCE.tubesPerTrip;
    this.filled = Math.min(caughtStones, ROVER_BALANCE.shelfSlots - keptFree);
    this.slots.slice(0, this.filled).forEach((slot) => this.addSealedTube(slot));
    this.glow = scene.add.rectangle(0, 0, SLOT.width - 4, SLOT.height - 4);
    this.glow.setStrokeStyle(2, PALETTE.sun);
    scene.tweens.add({ targets: this.glow, alpha: 0.3, yoyo: true, repeat: -1, duration: 400 });
    this.moveGlow();
  }

  get freeSlots(): number {
    return this.slots.length - this.filled;
  }

  /** Where the sealed core will fly to. */
  get nextSlot(): Point {
    return this.slots[this.filled] ?? this.slots[this.slots.length - 1] ?? { x: 0, y: 0 };
  }

  lightNextSlot(): void {
    const slot = this.nextSlot;
    const light = this.scene.add.rectangle(slot.x, slot.y, SLOT.width - 4, SLOT.height - 4);
    light.setFillStyle(PALETTE.cyan, 0.35);
    this.filled += 1;
    if (this.freeSlots > 0) {
      this.moveGlow();
      return;
    }
    this.scene.tweens.killTweensOf(this.glow);
    this.glow.setVisible(false);
  }

  private addSealedTube(slot: Point): void {
    addTube(this.scene, TUBE_HEIGHT, 'sealed').setPosition(slot.x, slot.y);
  }

  private moveGlow(): void {
    const slot = this.nextSlot;
    this.glow.setPosition(slot.x, slot.y);
  }
}
