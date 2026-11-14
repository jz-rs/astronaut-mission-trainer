import Phaser from 'phaser';
import {
  astronautFrameKey,
  walkAnimationKey,
  type Facing,
  type SuitColor,
} from '../../ui/astronautFrames';
import { ASTRONAUT_SCALE, CORRIDOR, WALK_SPEED_PX_PER_SECOND, type Point } from '../../ui/layout';

/** A place to walk to. `doorX` is set when the place is inside a room. */
export interface WalkTarget {
  spot: Point;
  doorX: number | null;
}

/**
 * One astronaut drawn on the base. It walks out through its room door, along the corridor
 * and in through the target door, so it never crosses a wall. It shows its back when walking up
 * and is mirrored when walking left (the sprites look to the right).
 */
export class AstronautSprite {
  readonly image: Phaser.GameObjects.Sprite;
  private walk: Phaser.Tweens.TweenChain | null = null;
  /** Door of the room it is in, or null when it is in the corridor. */
  private doorX: number | null = null;
  private facing: Facing = 'front';

  constructor(
    private readonly scene: Phaser.Scene,
    spot: Point,
    private readonly suitColor: SuitColor,
  ) {
    this.image = scene.add
      .sprite(spot.x, spot.y, astronautFrameKey(suitColor, 'front'))
      .setScale(ASTRONAUT_SCALE);
  }

  get isWalking(): boolean {
    return this.walk !== null;
  }

  walkTo(target: WalkTarget, onArrive?: () => void): void {
    this.walk?.stop();
    const steps = this.buildSteps(this.planPath(target));
    this.doorX = target.doorX;
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

  /** Out through the current door, along the corridor, in through the target door. */
  private planPath(target: WalkTarget): Point[] {
    const corridorY = CORRIDOR.y + CORRIDOR.height / 2;
    const exitX = this.doorX ?? this.image.x;
    const enterX = target.doorX ?? target.spot.x;
    return [
      { x: exitX, y: this.image.y },
      { x: exitX, y: corridorY },
      { x: enterX, y: corridorY },
      { x: enterX, y: target.spot.y },
      target.spot,
    ];
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
