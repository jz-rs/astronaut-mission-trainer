import Phaser from 'phaser';
import {
  astronautFrameKey,
  walkAnimationKey,
  type Facing,
  type SuitColor,
} from '../../ui/astronautFrames';
import {
  ASTRONAUT_SCALE,
  CORRIDOR_CENTER,
  WALK_SPEED_PX_PER_SECOND,
  type Point,
} from '../../ui/layout';

/** A place to walk to. `door` is set when the place is inside a room. */
export interface WalkTarget {
  spot: Point;
  door: Point | null;
  outdoorRoute?: readonly Point[];
}

/**
 * One astronaut drawn on the base, standing on its feet point. It walks out through its room door,
 * through the center of the X-shaped corridor and in through the target door, so it stays on the
 * floor. It shows its back when walking up and is mirrored when walking left (the sprites look right).
 */
export class AstronautSprite {
  readonly image: Phaser.GameObjects.Sprite;
  private walk: Phaser.Tweens.TweenChain | null = null;
  /** Door of the room it is in, or null when it is in the corridor. */
  private door: Point | null = null;
  private facing: Facing = 'front';
  private outdoorRoute: readonly Point[] = [];

  constructor(
    private readonly scene: Phaser.Scene,
    spot: Point,
    private readonly suitColor: SuitColor,
  ) {
    this.image = scene.add
      .sprite(spot.x, spot.y, astronautFrameKey(suitColor, 'front'))
      .setOrigin(0.5, 1)
      .setScale(ASTRONAUT_SCALE);
  }

  get isWalking(): boolean {
    return this.walk !== null;
  }

  walkTo(target: WalkTarget, onArrive?: () => void): void {
    this.walk?.stop();
    const steps = this.buildSteps(this.planPath(target));
    this.door = target.door;
    this.outdoorRoute = target.outdoorRoute ?? [];
    this.walk = this.scene.tweens.chain({
      targets: this.image,
      tweens: steps,
      onComplete: () => {
        this.image.stop().setTexture(astronautFrameKey(this.suitColor, this.facing));
        this.walk = null;
        onArrive?.();
      },
    });
  }

  /** Out through the current door, across the corridor center, in through the target door. */
  private planPath(target: WalkTarget): Point[] {
    const sameRoom = this.door !== null && this.door === target.door;
    if (sameRoom) return [target.spot];
    const path: Point[] = [];
    if (this.door) path.push(...[...this.outdoorRoute].reverse(), this.door);
    path.push(CORRIDOR_CENTER);
    if (target.door) path.push(target.door);
    path.push(...(target.outdoorRoute ?? []));
    path.push(target.spot);
    return path;
  }

  private buildSteps(path: Point[]) {
    let from: Point = { x: this.image.x, y: this.image.y };
    return path.map((point) => {
      const distance = Phaser.Math.Distance.BetweenPoints(from, point);
      const start = from;
      from = point;
      return {
        x: point.x,
        y: point.y,
        duration: Math.max(1, (distance / WALK_SPEED_PX_PER_SECOND) * 1000),
        onStart: () => this.faceTowards(start, point),
      };
    });
  }

  private faceTowards(from: Point, to: Point): void {
    if (from.x === to.x && from.y === to.y) return;
    if (to.x !== from.x) this.image.setFlipX(to.x < from.x);
    this.facing = to.y < from.y ? 'back' : 'front';
    this.image.play(walkAnimationKey(this.suitColor, this.facing), true);
  }
}
