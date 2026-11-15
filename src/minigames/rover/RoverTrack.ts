import Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import { MINIGAME_AREA } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSprite } from '../../ui/sprites';
import { addRockTarget, addSandPit } from './trackPieces';

/**
 * Spec 15 + Mission 5 — The road the rover drives on: 3 lanes, rocks to catch by driving over
 * them (each one is a sample, like the one it will drill later) and soft sand to dodge (the
 * rover Spirit got stuck in soft sand in 2009 and never got out). How each one looks lives in
 * trackPieces.ts. Only movement and collisions live here; the scene keeps the score.
 */
const ROAD_WIDTH = 240;
const LANE_WIDTH = ROAD_WIDTH / ROVER_BALANCE.lanes;
const ROAD_LEFT = MINIGAME_AREA.x + (MINIGAME_AREA.width - ROAD_WIDTH) / 2;
const SPAWN_Y = MINIGAME_AREA.y + 12;
const ROVER_Y = MINIGAME_AREA.y + MINIGAME_AREA.height - 28;
const HIT_DISTANCE_Y = 18;
/** A collected rock grows this much (relative to its size) while it fades out. */
const COLLECT_GROWTH = 1.5;

/** What the rover drove into this frame. */
export type TrackHit = 'rock' | 'sand';

interface TrackObject {
  kind: TrackHit;
  lane: number;
  sprite: Phaser.GameObjects.Container;
}

export function laneCenterX(lane: number): number {
  return ROAD_LEFT + LANE_WIDTH * lane + LANE_WIDTH / 2;
}

export class RoverTrack {
  readonly rover: Phaser.GameObjects.Image;
  private lane = 1;
  private objects: TrackObject[] = [];
  private sinceSpawnMs = 0;

  constructor(private readonly scene: Phaser.Scene) {
    this.drawRoad();
    this.rover = addSprite(scene, laneCenterX(this.lane), ROVER_Y, 'rover');
  }

  get roverX(): number {
    return this.rover.x;
  }

  moveRover(direction: -1 | 1): void {
    this.lane = Phaser.Math.Clamp(this.lane + direction, 0, ROVER_BALANCE.lanes - 1);
    this.scene.tweens.add({ targets: this.rover, x: laneCenterX(this.lane), duration: 120 });
  }

  /** Moves everything down and reports what reached the rover in its lane. */
  update(deltaMs: number): TrackHit[] {
    this.sinceSpawnMs += deltaMs;
    if (this.sinceSpawnMs >= ROVER_BALANCE.spawnEveryMs) {
      this.sinceSpawnMs = 0;
      this.spawn();
    }
    const step = (ROVER_BALANCE.scrollSpeedPxPerSecond * deltaMs) / 1000;
    const hits: TrackHit[] = [];
    for (const object of [...this.objects]) {
      object.sprite.y += step;
      const reachedRover = Math.abs(object.sprite.y - ROVER_Y) < HIT_DISTANCE_Y;
      if (reachedRover && object.lane === this.lane) {
        hits.push(object.kind);
        if (object.kind === 'rock') this.collect(object);
        else this.remove(object);
      } else if (object.sprite.y > MINIGAME_AREA.y + MINIGAME_AREA.height) {
        this.remove(object);
      }
    }
    return hits;
  }

  /** The first thing on the road is always a rock in another lane, to show what to catch. */
  spawnFirstRock(lane: number): void {
    this.sinceSpawnMs = 0;
    this.add('rock', lane);
  }

  /** A caught rock pops into the rover: it grows a little, fades and is gone. */
  private collect(rock: TrackObject): void {
    this.scene.tweens.killTweensOf(rock.sprite.list); // its target and tube stop looping
    this.objects = this.objects.filter((object) => object !== rock);
    this.scene.tweens.add({
      targets: rock.sprite,
      scale: rock.sprite.scale * COLLECT_GROWTH,
      alpha: 0,
      duration: 200,
      onComplete: () => rock.sprite.destroy(),
    });
  }

  /** Stuck in the sand: the rover wiggles in place for a moment. */
  slip(): void {
    this.scene.tweens.add({ targets: this.rover, angle: 8, yoyo: true, repeat: 2, duration: 80 });
  }

  private spawn(): void {
    const kind: TrackHit = Math.random() < ROVER_BALANCE.rockChance ? 'rock' : 'sand';
    this.add(kind, Phaser.Math.Between(0, ROVER_BALANCE.lanes - 1));
  }

  private add(kind: TrackHit, lane: number): void {
    const x = laneCenterX(lane);
    const sprite =
      kind === 'rock' ? addRockTarget(this.scene, x, SPAWN_Y) : addSandPit(this.scene, x, SPAWN_Y);
    this.objects.push({ kind, lane, sprite });
  }

  private remove(object: TrackObject): void {
    this.scene.tweens.killTweensOf(object.sprite.list);
    object.sprite.destroy();
    this.objects = this.objects.filter((candidate) => candidate !== object);
  }

  private drawRoad(): void {
    const { y, height } = MINIGAME_AREA;
    const road = this.scene.add.graphics();
    road.fillStyle(PALETTE.marsDark, 1).fillRect(MINIGAME_AREA.x, y, MINIGAME_AREA.width, height);
    road.fillStyle(PALETTE.mars, 1).fillRect(ROAD_LEFT, y, ROAD_WIDTH, height);
    road.lineStyle(2, PALETTE.marsLight, 0.6);
    for (let lane = 1; lane < ROVER_BALANCE.lanes; lane += 1) {
      road.lineBetween(ROAD_LEFT + lane * LANE_WIDTH, y, ROAD_LEFT + lane * LANE_WIDTH, y + height);
    }
  }
}
