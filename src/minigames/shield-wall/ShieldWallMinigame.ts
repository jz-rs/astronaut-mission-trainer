import Phaser from 'phaser';
import { SHIELD_WALL_BALANCE } from '../../config/balance';
import type { Point, Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { showGestureHint } from '../gestureHint';
import { MinigameScene } from '../MinigameScene';
import { addRay, addShieldBlock, addWallPanel, type BlockMaterial } from './shieldDrawing';

/**
 * Spec 10 — Drag water and regolith blocks into the holes of the wall to stop radiation rays.
 * Simple on purpose: no rotation, generous snap, and tapping works too (a hole, or a block)
 * for small fingers that can't drag precisely yet. Performance = holes plugged / holes, + speed bonus.
 * Harsher locations (Olympus Mons) = more holes.
 */
const SLOT_WIDTH = 40;
/** Wall panels are square. */
const WALL_HEIGHT = SLOT_WIDTH;
const BLOCK_SIZE = SLOT_WIDTH - 4;
const WALL_OFFSET_Y = 56;
const HABITAT_OFFSET_Y = 150;
const TRAY_OFFSET_FROM_BOTTOM = 30;
const TRAY_SPACING = 64;
/** A finger that moves less than this between press and release tapped instead of dragging. */
const TAP_DISTANCE = 8;

interface Hole {
  center: Point;
  filled: boolean;
  rayBelow: Phaser.GameObjects.Image;
}

interface Block {
  body: Phaser.GameObjects.Container;
  home: Point;
}

export class ShieldWallMinigame extends MinigameScene {
  static readonly KEY = 'ShieldWallMinigame';
  protected readonly instructionKey = 'minigame.shield-wall.instruction';
  private holes: Hole[] = [];
  private blocks: Block[] = [];

  constructor() {
    super(ShieldWallMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.holes = [];
    this.blocks = [];
    const { wallSlots, holes, maxHoles } = SHIELD_WALL_BALANCE;
    const holeCount = Math.min(maxHoles, Math.round(holes * this.difficulty));
    const holeSlots = new Set(
      Phaser.Utils.Array.Shuffle([...Array(wallSlots).keys()]).slice(0, holeCount),
    );
    const wallX = area.x + (area.width - wallSlots * SLOT_WIDTH) / 2;
    const wallY = area.y + WALL_OFFSET_Y;
    this.drawHabitat(area);
    for (let slot = 0; slot < wallSlots; slot += 1) {
      const x = wallX + slot * SLOT_WIDTH;
      if (holeSlots.has(slot)) this.holes.push(this.createHole(x, wallY, area));
      else this.drawWallSlot(x, wallY);
    }
    this.createTray(area, holeCount);
    this.input.on('drag', this.handleDrag, this);
    this.input.on('dragend', this.handleDrop, this);
    const [firstBlock, firstHole] = [this.blocks[0], this.holes[0]];
    if (firstBlock && firstHole) showGestureHint(this, firstBlock.home, firstHole.center);
  }

  protected calculatePerformance(): number {
    const plugged = this.holes.filter((hole) => hole.filled).length;
    return this.withSpeedBonus(this.holes.length === 0 ? 1 : plugged / this.holes.length);
  }

  private drawHabitat(area: Rect): void {
    const centerX = area.x + area.width / 2;
    const y = area.y + HABITAT_OFFSET_Y;
    const graphics = this.add.graphics();
    graphics.fillStyle(PALETTE.metal, 1).fillEllipse(centerX, y, 220, 44);
    graphics.fillStyle(PALETTE.metalDark, 1).fillRect(centerX - 120, y, 240, 14);
    graphics.lineStyle(2, TECH_GLOW, 1).strokeEllipse(centerX, y, 220, 44);
  }

  private drawWallSlot(x: number, y: number): void {
    addWallPanel(this, x, y, SLOT_WIDTH, false);
  }

  private createHole(x: number, y: number, area: Rect): Hole {
    const center = { x: x + SLOT_WIDTH / 2, y: y + WALL_HEIGHT / 2 };
    addWallPanel(this, x, y, SLOT_WIDTH, true);
    const rayAbove = addRay(this, center.x, area.y, y);
    const rayBelow = addRay(this, center.x, y + WALL_HEIGHT, area.y + HABITAT_OFFSET_Y - 16);
    this.tweens.add({
      targets: [rayAbove, rayBelow],
      alpha: 0.4,
      yoyo: true,
      repeat: -1,
      duration: 180,
    });
    const hole: Hole = { center, filled: false, rayBelow };
    const touchZone = this.add.zone(center.x, center.y, SLOT_WIDTH, WALL_HEIGHT);
    touchZone
      .setInteractive({ useHandCursor: true })
      .on('pointerup', () => this.plugWithNextBlock(hole));
    return hole;
  }

  private plugWithNextBlock(hole: Hole): void {
    const block = this.blocks.find((candidate) => candidate.body.input?.enabled);
    if (hole.filled || !block || this.isFinished) return;
    this.plug(hole, block);
  }

  private createTray(area: Rect, blockCount: number): void {
    const y = area.y + area.height - TRAY_OFFSET_FROM_BOTTOM;
    const startX = area.x + area.width / 2 - ((blockCount - 1) * TRAY_SPACING) / 2;
    for (let index = 0; index < blockCount; index += 1) {
      const material: BlockMaterial = index % 2 === 0 ? 'water' : 'regolith';
      const home = { x: startX + index * TRAY_SPACING, y };
      const sprite = addShieldBlock(this, material, BLOCK_SIZE);
      const body = this.add
        .container(home.x, home.y, [sprite])
        .setSize(SLOT_WIDTH + 8, WALL_HEIGHT + 8);
      body.setInteractive({ draggable: true, useHandCursor: true });
      this.blocks.push({ body, home });
    }
  }

  private handleDrag(
    _pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.Container,
    x: number,
    y: number,
  ) {
    if (this.isFinished) return;
    target.setPosition(x, y).setDepth(1);
  }

  private handleDrop(pointer: Phaser.Input.Pointer, target: Phaser.GameObjects.Container): void {
    const block = this.blocks.find((candidate) => candidate.body === target);
    if (!block) return;
    const tapped = pointer.getDistance() < TAP_DISTANCE;
    const hole = tapped
      ? this.holes.find((candidate) => !candidate.filled)
      : this.findNearestOpenHole(target.x, target.y);
    if (!hole || this.isFinished) {
      this.tweens.add({ targets: target, x: block.home.x, y: block.home.y, duration: 200 });
      return;
    }
    this.plug(hole, block);
  }

  private findNearestOpenHole(x: number, y: number): Hole | undefined {
    const open = this.holes.filter((hole) => !hole.filled);
    const distance = (hole: Hole) =>
      Phaser.Math.Distance.Between(x, y, hole.center.x, hole.center.y);
    const nearest = open.sort((a, b) => distance(a) - distance(b))[0];
    return nearest && distance(nearest) <= SHIELD_WALL_BALANCE.snapDistance ? nearest : undefined;
  }

  private plug(hole: Hole, block: Block): void {
    hole.filled = true;
    hole.rayBelow.setVisible(false);
    block.body.disableInteractive();
    this.tweens.add({ targets: block.body, x: hole.center.x, y: hole.center.y, duration: 100 });
    const flash = Phaser.Display.Color.IntegerToRGB(TECH_GLOW);
    this.cameras.main.flash(120, flash.r, flash.g, flash.b);
    if (this.holes.every((candidate) => candidate.filled)) this.finish();
  }
}
