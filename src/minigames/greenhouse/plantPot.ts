import type Phaser from 'phaser';
import type { Point } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSprite, type SpriteKey } from '../../ui/sprites';
import { addLamp, addSpriteOfHeight } from './greenhouseIcons';

/**
 * Spec 09 — One lettuce growing in a bed of the greenhouse room (soil brought from Earth), under
 * the pink LED lamp of the room. Sometimes it needs something, and it shows it so the kid knows
 * what to bring:
 *   - water: it turns yellow, with a water drop over it;
 *   - light: the plant goes dark (its lamp went off), with a lit lamp next to it.
 * Helped with the right thing, it grows; if nobody helps in time, it withers.
 */
export type Need = 'water' | 'light';
type PotState = 'healthy' | 'needy' | 'withered';

/** The beds of the picture are small: the lettuces are shown a bit smaller to fit in them. */
const PLANT_SCALE = 0.7;
/** The soil mound of the lettuce pictures sits in the middle of its bed. */
const PLANT_DROP = 8;
/** The touch area around a plant (bigger than the plant, for small fingers). */
const TOUCH = { width: 76, height: 76 };
/** The bubble sits right next to the top of the plant, so it is clearly its bubble. */
const BUBBLE_BESIDE = { x: 20, y: 2 };
const BOB_PIXELS = 3;
const BUBBLE_SIZE = 22;
const BUBBLE_PLATE_RADIUS = 15;
const LAMP_ICON_SCALE = 0.45;
const LAMP_ICON_LIFT = 6;
/** A thirsty plant turns yellow; a plant without light goes dark. */
const THIRSTY_TINT = PALETTE.sun;
const DARK_TINT = PALETTE.metal;
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
  private readonly bubble: Phaser.GameObjects.Container;
  private readonly waterIcon: Phaser.GameObjects.Image;
  private readonly lampIcon: Phaser.GameObjects.Graphics;

  /** `base` is where the plant stands: the middle of its bed on the screen. */
  constructor(
    private readonly scene: Phaser.Scene,
    private readonly base: Point,
  ) {
    const { x, y } = base;
    this.sprite = addSprite(scene, x, y + PLANT_DROP, GROW_SPRITES[0] ?? 'lettuceHealthy');
    this.sprite.setOrigin(0.5, 1).setScale(this.sprite.scale * PLANT_SCALE);
    const bubble = addNeedBubble(scene);
    ({ container: this.bubble, waterIcon: this.waterIcon, lampIcon: this.lampIcon } = bubble);
    this.body = scene.add.zone(x, y - TOUCH.height / 4, TOUCH.width, TOUCH.height);
    this.body.setInteractive({ useHandCursor: true });
  }

  get center(): Point {
    return { x: this.base.x, y: this.base.y };
  }

  /** Where the O₂ the plant gives off comes out. */
  get top(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y - this.sprite.displayHeight };
  }

  contains(x: number, y: number): boolean {
    return this.body.getBounds().contains(x, y);
  }

  ask(need: Need): void {
    this.state = 'needy';
    this.need = need;
    this.waitedMs = 0;
    this.showBubble();
    this.waterIcon.setVisible(need === 'water');
    this.lampIcon.setVisible(need === 'light');
    this.sprite.setTint(need === 'water' ? THIRSTY_TINT : DARK_TINT);
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

  /** Next to the top of the plant, which is higher as it grows. */
  private showBubble(): void {
    const { x, y } = this.top;
    const bubbleY = y + BUBBLE_BESIDE.y;
    this.scene.tweens.killTweensOf(this.bubble);
    this.bubble.setPosition(x + BUBBLE_BESIDE.x, bubbleY).setVisible(true);
    const bob = { y: bubbleY - BOB_PIXELS, yoyo: true, repeat: -1, duration: 300 };
    this.scene.tweens.add({ targets: this.bubble, ...bob });
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

/** The bubble next to a plant that says what it needs: a water drop or a lamp. */
function addNeedBubble(scene: Phaser.Scene) {
  const waterIcon = addSpriteOfHeight(scene, 0, 0, 'waterDrop', BUBBLE_SIZE);
  // A lit lamp, like the Light tool: the bubble shows what to bring, as the drop does.
  const lampIcon = addLamp(scene, 0, -LAMP_ICON_LIFT).setScale(LAMP_ICON_SCALE);
  const plate = scene.add.circle(0, 0, BUBBLE_PLATE_RADIUS, PALETTE.white, 0.9);
  plate.setStrokeStyle(2, PALETTE.metalDark);
  const container = scene.add.container(0, 0, [plate, waterIcon, lampIcon]);
  container.setVisible(false).setDepth(2);
  return { container, waterIcon, lampIcon };
}
