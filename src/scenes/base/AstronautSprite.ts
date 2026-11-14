import Phaser from 'phaser';
import { ensureAstronautTexture } from '../../ui/astronautTexture';
import { ASTRONAUT_SCALE, CORRIDOR, WALK_SPEED_PX_PER_SECOND, type Point } from '../../ui/layout';

/** A place to walk to. `doorX` is set when the place is inside a room. */
export interface WalkTarget {
  spot: Point;
  doorX: number | null;
}

const STEP_BOB_PX = 2;
const STEP_DURATION_MS = 120;

/**
 * One astronaut drawn on the base. It walks out through its room door, along the corridor
 * and in through the target door, so it never crosses a wall.
 */
export class AstronautSprite {
  readonly image: Phaser.GameObjects.Image;
  private readonly bob: Phaser.Tweens.Tween;
  private walk: Phaser.Tweens.TweenChain | null = null;
  /** Door of the room it is in, or null when it is in the corridor. */
  private doorX: number | null = null;

  constructor(
    private readonly scene: Phaser.Scene,
    spot: Point,
    visorColor: number,
  ) {
    const texture = ensureAstronautTexture(scene, visorColor);
    this.image = scene.add.image(spot.x, spot.y, texture).setScale(ASTRONAUT_SCALE);
    this.bob = scene.tweens.add({
      targets: this.image,
      displayOriginY: this.image.displayOriginY + STEP_BOB_PX / ASTRONAUT_SCALE,
      yoyo: true,
      repeat: -1,
      duration: STEP_DURATION_MS,
      paused: true,
    });
  }

  get isWalking(): boolean {
    return this.walk !== null;
  }

  walkTo(target: WalkTarget, onArrive?: () => void): void {
    this.walk?.stop();
    const steps = this.buildSteps(this.planPath(target));
    this.doorX = target.doorX;
    this.bob.resume();
    this.walk = this.scene.tweens.chain({
      targets: this.image,
      tweens: steps,
      onComplete: () => {
        this.bob.pause();
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
    const image = this.image;
    let from: Point = { x: image.x, y: image.y };
    return path.map((point) => {
      const distance = Phaser.Math.Distance.BetweenPoints(from, point);
      const flip = point.x === from.x ? image.flipX : point.x < from.x;
      from = point;
      return {
        x: point.x,
        y: point.y,
        duration: Math.max(1, (distance / WALK_SPEED_PX_PER_SECOND) * 1000),
        onStart: () => image.setFlipX(flip),
      };
    });
  }
}
