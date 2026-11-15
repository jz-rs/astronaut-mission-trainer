import type Phaser from 'phaser';
import type { Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSprite, type SpriteKey } from '../../ui/sprites';
import { addLamp, addPillow, addSpriteOfHeight, drawLamp } from './greenhouseIcons';

/**
 * Spec 09 — One lettuce growing in its Veggie pillow, under its own pink LED lamp.
 * Sometimes it needs something, and it shows it so the kid knows what to bring:
 *   - water: it turns yellow, with a water drop over it;
 *   - light: its lamp goes off and it turns pale, with a lit lamp over it.
 * Helped with the right thing, it grows; if nobody helps in time, it withers.
 */
export type Need = 'water' | 'light';
type PotState = 'healthy' | 'needy' | 'withered';

const LAMP_TOP = 22;
const PLANT_BOTTOM = 18;
/** The pillow covers the soil at the bottom of the lettuce pictures. */
const POT_PILLOW = { width: 66, height: 26 };
/** The plant stands a bit up, so only its stem comes out of the pillow. */
const PLANT_LIFT = 4;
const BUBBLE_SIZE = 22;
const BUBBLE_OFFSET = { x: 32, y: -58 };
const BUBBLE_PLATE_RADIUS = 15;
const LAMP_ICON_SCALE = 0.45;
const LAMP_ICON_LIFT = 6;
/** A thirsty plant turns yellow; a plant without light turns pale. */
const THIRSTY_TINT = PALETTE.sun;
const PALE_TINT = PALETTE.metalLight;
const GROW_SPRITES: readonly SpriteKey[] = ['lettuceSprout', 'lettuceYoung', 'lettuceHealthy'];
const SHAKE_PIXELS = 4;
const SHAKE_MS = 50;

export class PlantPot {
  state: PotState = 'healthy';
  need: Need | null = null;
  waitedMs = 0;
  readonly body: Phaser.GameObjects.Zone;
  private growth = 0;
  private readonly sprite: Phaser.GameObjects.Image;
  private readonly lamp: Phaser.GameObjects.Graphics;
  private readonly bubble: Phaser.GameObjects.Container;
  private readonly waterIcon: Phaser.GameObjects.Image;
  private readonly lampIcon: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    readonly cell: Rect,
  ) {
    const centerX = cell.x + cell.width / 2;
    const bottom = cell.y + cell.height - PLANT_BOTTOM;
    this.sprite = addSprite(
      scene,
      centerX,
      bottom - PLANT_LIFT,
      GROW_SPRITES[0] ?? 'lettuceHealthy',
    );
    this.sprite.setOrigin(0.5, 1);
    addPillow(scene, centerX, bottom, POT_PILLOW.width, POT_PILLOW.height);
    this.lamp = addLamp(scene, centerX, cell.y + LAMP_TOP);
    const bubble = addNeedBubble(scene, centerX + BUBBLE_OFFSET.x, bottom + BUBBLE_OFFSET.y);
    ({ container: this.bubble, waterIcon: this.waterIcon, lampIcon: this.lampIcon } = bubble);
    this.body = scene.add.zone(cell.x, cell.y, cell.width, cell.height).setOrigin(0);
    this.body.setInteractive({ useHandCursor: true });
  }

  get center(): { x: number; y: number } {
    return { x: this.cell.x + this.cell.width / 2, y: this.cell.y + this.cell.height / 2 };
  }

  /** Where the O₂ the plant gives off comes out. */
  get top(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y - this.sprite.displayHeight };
  }

  contains(x: number, y: number): boolean {
    const { x: left, y: top, width, height } = this.cell;
    return x >= left && x <= left + width && y >= top && y <= top + height;
  }

  ask(need: Need): void {
    this.state = 'needy';
    this.need = need;
    this.waitedMs = 0;
    this.bubble.setVisible(true);
    this.waterIcon.setVisible(need === 'water');
    this.lampIcon.setVisible(need === 'light');
    this.sprite.setTint(need === 'water' ? THIRSTY_TINT : PALE_TINT);
    if (need === 'light') drawLamp(this.lamp, false);
  }

  /** The right thing makes it healthy and grow; the wrong one makes it shake "no". */
  help(given: Need): boolean {
    if (this.state !== 'needy') return false;
    if (given !== this.need) {
      this.shake();
      return false;
    }
    this.state = 'healthy';
    this.need = null;
    this.bubble.setVisible(false);
    drawLamp(this.lamp, true);
    this.sprite.clearTint();
    this.growth = Math.min(this.growth + 1, GROW_SPRITES.length - 1);
    this.sprite.setTexture(GROW_SPRITES[this.growth] ?? 'lettuceHealthy');
    this.sprite.setScale(this.sprite.scale * 1.2);
    this.scene.tweens.add({
      targets: this.sprite,
      scale: this.sprite.scale / 1.2,
      duration: 250,
      ease: 'Back.Out',
    });
    return true;
  }

  wither(): void {
    this.state = 'withered';
    this.need = null;
    this.bubble.setVisible(false);
    this.sprite.clearTint().setTexture('lettuceWithered');
  }

  private shake(): void {
    const { x } = this.bubble;
    this.scene.tweens.add({
      targets: this.bubble,
      x: x + SHAKE_PIXELS,
      duration: SHAKE_MS,
      yoyo: true,
      repeat: 3,
      onComplete: () => this.bubble.setX(x),
    });
  }
}

/** The bubble over a plant that says what it needs: a water drop or a lamp. */
function addNeedBubble(scene: Phaser.Scene, x: number, y: number) {
  const waterIcon = addSpriteOfHeight(scene, 0, 0, 'waterDrop', BUBBLE_SIZE);
  // A lit lamp, like the Light tool: the bubble shows what to bring, as the drop does.
  const lampIcon = addLamp(scene, 0, -LAMP_ICON_LIFT).setScale(LAMP_ICON_SCALE);
  const plate = scene.add.circle(0, 0, BUBBLE_PLATE_RADIUS, PALETTE.white, 0.9);
  plate.setStrokeStyle(2, PALETTE.metalDark);
  const container = scene.add.container(x, y, [plate, waterIcon, lampIcon]);
  container.setVisible(false).setDepth(2);
  scene.tweens.add({ targets: container, y: y - 3, yoyo: true, repeat: -1, duration: 300 });
  return { container, waterIcon, lampIcon };
}
