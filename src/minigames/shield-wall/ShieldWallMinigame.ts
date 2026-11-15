import Phaser from 'phaser';
import { SHIELD_WALL_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { floatText } from '../../ui/floatingText';
import type { Point, Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { showGestureHint } from '../gestureHint';
import { showHowToCard } from '../howTo/howToCard';
import { StepGuide } from '../howTo/stepGuide';
import { MinigameScene } from '../MinigameScene';
import { RadMeter } from './radMeter';
import {
  addHabitat,
  addRay,
  addShieldBlock,
  addWallPanel,
  type BlockMaterial,
} from './shieldDrawing';
import { SHIELD_STEPS } from './shieldRecipe';

/**
 * Spec 10 — Mars has no magnetic bubble, so radiation reaches its ground. Drag water and
 * regolith blocks into the holes of the wall: each plugged hole stops a ray before it reaches
 * the crew. A RAD meter (like the one on the Curiosity rover) rises while holes are open.
 * Simple on purpose: no rotation, generous snap, and tapping a block also works.
 * Performance = holes plugged / holes, + bonus if the meter never filled.
 * Harsher locations (Olympus Mons) = more holes.
 */
const SLOT_WIDTH = 40;
/** Wall panels are square. */
const WALL_HEIGHT = SLOT_WIDTH;
const BLOCK_SIZE = SLOT_WIDTH - 4;
const WALL_OFFSET_Y = 50;
const HABITAT_FLOOR_OFFSET_Y = 160;
/** Rays that get through stop at the astronauts' heads. */
const RAY_END_ABOVE_FLOOR = 30;
const TRAY_OFFSET_FROM_BOTTOM = 32;
const TRAY_SPACING = 52;
const METER_COLUMN = 60;
const METER = { offsetX: 20, offsetY: 18, width: 20, height: 176 };
const BLOCKED_TEXT_OFFSET_Y = 32;
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
  private guide: StepGuide | null = null;
  private meter: RadMeter | null = null;

  constructor() {
    super(ShieldWallMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.holes = [];
    this.blocks = [];
    this.guide = new StepGuide(this, area, SHIELD_STEPS);
    const meterLeft = area.x + area.width - METER_COLUMN;
    const meterRect = { ...METER, x: meterLeft + METER.offsetX, y: area.y + METER.offsetY };
    this.meter = new RadMeter(this, meterRect);
    const play = { ...area, x: this.guide.right, width: meterLeft - this.guide.right };
    addHabitat(this, play.x + play.width / 2, area.y + HABITAT_FLOOR_OFFSET_Y);
    this.buildWall(play);
    this.createTray(play, this.holes.length);
    this.input.on('drag', this.handleDrag, this);
    this.input.on('dragend', this.handleDrop, this);
    this.pauseGame();
    const howTo = {
      titleKey: 'minigame.shield-wall.introTitle',
      startKey: 'minigame.shield-wall.start',
      steps: SHIELD_STEPS,
    } as const;
    showHowToCard(this, howTo, () => this.startPlaying());
  }

  /** After the intro: the game goes on and a ghost finger shows the first move. */
  private startPlaying(): void {
    this.resumeGame();
    const [firstBlock, firstHole] = [this.blocks[0], this.holes[0]];
    if (firstBlock && firstHole) showGestureHint(this, firstBlock.home, firstHole.center);
  }

  protected calculatePerformance(): number {
    const plugged = this.holes.filter((hole) => hole.filled).length;
    const completion = this.holes.length === 0 ? 1 : plugged / this.holes.length;
    return completion + (this.meter?.isFull ? 0 : SHIELD_WALL_BALANCE.lowRadiationBonus);
  }

  /** Every open hole lets radiation in, and the meter shows it. */
  protected updateGame(deltaMs: number): void {
    const meter = this.meter;
    if (!meter || meter.isFull) return;
    const open = this.holes.filter((hole) => !hole.filled).length;
    meter.add((open * SHIELD_WALL_BALANCE.radiationPerHolePerSecond * deltaMs) / 1000);
    if (meter.isFull) this.say('minigame.shield-wall.tooMuch', meter.top);
  }

  private buildWall(play: Rect): void {
    const { wallSlots, holes, maxHoles } = SHIELD_WALL_BALANCE;
    const holeCount = Math.min(maxHoles, Math.round(holes * this.difficulty));
    const shuffled = Phaser.Utils.Array.Shuffle([...Array(wallSlots).keys()]);
    const holeSlots = new Set(shuffled.slice(0, holeCount));
    const wallX = play.x + (play.width - wallSlots * SLOT_WIDTH) / 2;
    const wallY = play.y + WALL_OFFSET_Y;
    for (let slot = 0; slot < wallSlots; slot += 1) {
      const x = wallX + slot * SLOT_WIDTH;
      if (holeSlots.has(slot)) this.holes.push(this.createHole(x, wallY, play));
      else addWallPanel(this, x, wallY, SLOT_WIDTH, false);
    }
  }

  private createHole(x: number, y: number, play: Rect): Hole {
    const center = { x: x + SLOT_WIDTH / 2, y: y + WALL_HEIGHT / 2 };
    addWallPanel(this, x, y, SLOT_WIDTH, true);
    const rayAbove = addRay(this, center.x, play.y, y);
    const rayEnd = play.y + HABITAT_FLOOR_OFFSET_Y - RAY_END_ABOVE_FLOOR;
    const rayBelow = addRay(this, center.x, y + WALL_HEIGHT, rayEnd);
    const flicker = { alpha: 0.4, yoyo: true, repeat: -1, duration: 180 };
    this.tweens.add({ targets: [rayAbove, rayBelow], ...flicker });
    return { center, filled: false, rayBelow };
  }

  private createTray(play: Rect, blockCount: number): void {
    const y = play.y + play.height - TRAY_OFFSET_FROM_BOTTOM;
    const startX = play.x + play.width / 2 - ((blockCount - 1) * TRAY_SPACING) / 2;
    for (let index = 0; index < blockCount; index += 1) {
      const material: BlockMaterial = index % 2 === 0 ? 'water' : 'regolith';
      const home = { x: startX + index * TRAY_SPACING, y };
      const sprite = addShieldBlock(this, material, BLOCK_SIZE);
      const body = this.add.container(home.x, home.y, [sprite]);
      body.setSize(SLOT_WIDTH + 8, WALL_HEIGHT + 8);
      body.setInteractive({ draggable: true, useHandCursor: true });
      this.blocks.push({ body, home });
    }
  }

  private handleDrag(
    _pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.Container,
    x: number,
    y: number,
  ): void {
    if (this.isFinished) return;
    target.setPosition(x, y).setDepth(1);
  }

  /** Tapped: the block goes to the first open hole. Dragged: to the hole it was let go near. */
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

  /** The block stops the ray: the part under the wall goes out and the crew is safe there. */
  private plug(hole: Hole, block: Block): void {
    hole.filled = true;
    hole.rayBelow.setVisible(false);
    block.body.disableInteractive();
    this.tweens.add({ targets: block.body, x: hole.center.x, y: hole.center.y, duration: 100 });
    const flash = Phaser.Display.Color.IntegerToRGB(TECH_GLOW);
    this.cameras.main.flash(120, flash.r, flash.g, flash.b);
    const plugged = this.holes.filter((candidate) => candidate.filled).length;
    this.guide?.show(Math.min(plugged + 1, SHIELD_STEPS.length));
    this.say('minigame.shield-wall.blocked', {
      x: hole.center.x,
      y: hole.center.y + BLOCKED_TEXT_OFFSET_Y,
    });
    if (plugged === this.holes.length) this.finish();
  }

  private say(
    key: 'minigame.shield-wall.blocked' | 'minigame.shield-wall.tooMuch',
    at: Point,
  ): void {
    const color = key === 'minigame.shield-wall.blocked' ? PALETTE.cyan : PALETTE.alert;
    if (!this.isFinished) floatText(this, at.x, at.y, t(key), color);
  }
}
