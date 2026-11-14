import Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import { MINIGAME_AREA } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addSprite, addSpriteSized } from '../../ui/sprites';

/**
 * Spec 15 — The road the rover drives on: 3 lanes, rocks to dodge and shiny stones
 * (samples) to catch by driving over them. Only movement and collisions live here;
 * the scene keeps the score.
 */
const ROAD_WIDTH = 240;
const LANE_WIDTH = ROAD_WIDTH / ROVER_BALANCE.lanes;
const ROAD_LEFT = MINIGAME_AREA.x + (MINIGAME_AREA.width - ROAD_WIDTH) / 2;
const SPAWN_Y = MINIGAME_AREA.y + 12;
const ROVER_Y = MINIGAME_AREA.y + MINIGAME_AREA.height - 28;
const HIT_DISTANCE_Y = 18;
const ROCK_SIZE = 40;
const SAMPLE_SIZE = 36;
/** A collected stone grows this much (relative to its size) while it fades out. */
const COLLECT_GROWTH = 1.5;
const SAMPLE_GLOW_RADIUS = 24;

/** What the rover drove into this frame. */
export type TrackHit = 'rock' | 'sample';

interface TrackObject {
  kind: 'rock' | 'sample';
  lane: number;
  /** A rock image, or a sample container (stone + glow). */
  sprite: Phaser.GameObjects.Image | Phaser.GameObjects.Container;
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
        if (object.kind === 'sample') this.collect(object);
        else this.remove(object);
      } else if (object.sprite.y > MINIGAME_AREA.y + MINIGAME_AREA.height) {
        this.remove(object);
      }
    }
    return hits;
  }

  /** A caught stone pops into the rover: it grows a little, fades and is gone. */
  private collect(sample: TrackObject): void {
    // Stop the glow pulse first, so nothing keeps animating a stone that is gone.
    this.scene.tweens.killTweensOf(sample.sprite);
    if (sample.sprite instanceof Phaser.GameObjects.Container) {
      this.scene.tweens.killTweensOf(sample.sprite.list);
    }
    this.objects = this.objects.filter((object) => object !== sample);
    this.scene.tweens.add({
      targets: sample.sprite,
      scale: sample.sprite.scale * COLLECT_GROWTH,
      alpha: 0,
      duration: 200,
      onComplete: () => sample.sprite.destroy(),
    });
  }

  private spawn(): void {
    const kind = Math.random() < ROVER_BALANCE.sampleChance ? 'sample' : 'rock';
    const lane = Phaser.Math.Between(0, ROVER_BALANCE.lanes - 1);
    const sprite =
      kind === 'rock'
        ? addSpriteSized(this.scene, laneCenterX(lane), SPAWN_Y, 'rock', ROCK_SIZE)
        : this.addSample(lane);
    this.objects.push({ kind, lane, sprite });
  }

  /** Shiny stones sit on a pulsing cyan glow, so a kid tells them from rocks at a glance. */
  private addSample(lane: number): Phaser.GameObjects.Container {
    const glow = this.scene.add.circle(0, 0, SAMPLE_GLOW_RADIUS, PALETTE.cyan, 0.45);
    const stone = addSpriteSized(this.scene, 0, 0, 'shinySample', SAMPLE_SIZE);
    this.scene.tweens.add({
      targets: glow,
      scale: 1.3,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 300,
    });
    return this.scene.add.container(laneCenterX(lane), SPAWN_Y, [glow, stone]);
  }

  private remove(object: TrackObject): void {
    if (object.sprite instanceof Phaser.GameObjects.Container) {
      this.scene.tweens.killTweensOf(object.sprite.list);
    }
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
