import Phaser from 'phaser';
import { ROVER_BALANCE } from '../../config/balance';
import { MINIGAME_AREA, MIN_TOUCH_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';

/**
 * Spec 15 — The road the rover drives on: 3 lanes, rocks to dodge and shiny stones
 * (samples) to tap. Only movement and collisions live here; the scene keeps the score.
 */
const ROAD_WIDTH = 240;
const LANE_WIDTH = ROAD_WIDTH / ROVER_BALANCE.lanes;
const ROAD_LEFT = MINIGAME_AREA.x + (MINIGAME_AREA.width - ROAD_WIDTH) / 2;
const SPAWN_Y = MINIGAME_AREA.y + 12;
const ROVER_Y = MINIGAME_AREA.y + MINIGAME_AREA.height - 28;
const HIT_DISTANCE_Y = 18;
const OBJECT_RADIUS = 11;

export type TrackHit = 'rock' | 'none';

interface TrackObject {
  kind: 'rock' | 'sample';
  lane: number;
  graphics: Phaser.GameObjects.Graphics;
}

export function laneCenterX(lane: number): number {
  return ROAD_LEFT + LANE_WIDTH * lane + LANE_WIDTH / 2;
}

export class RoverTrack {
  readonly rover: Phaser.GameObjects.Graphics;
  private lane = 1;
  private objects: TrackObject[] = [];
  private sinceSpawnMs = 0;

  constructor(private readonly scene: Phaser.Scene) {
    this.drawRoad();
    this.rover = scene.add.graphics({ x: laneCenterX(this.lane), y: ROVER_Y });
    drawRover(this.rover);
  }

  get roverX(): number {
    return this.rover.x;
  }

  moveRover(direction: -1 | 1): void {
    this.lane = Phaser.Math.Clamp(this.lane + direction, 0, ROVER_BALANCE.lanes - 1);
    this.scene.tweens.add({ targets: this.rover, x: laneCenterX(this.lane), duration: 120 });
  }

  /** Moves everything down and reports if a rock reached the rover. */
  update(deltaMs: number): TrackHit {
    this.sinceSpawnMs += deltaMs;
    if (this.sinceSpawnMs >= ROVER_BALANCE.spawnEveryMs) {
      this.sinceSpawnMs = 0;
      this.spawn();
    }
    const step = (ROVER_BALANCE.scrollSpeedPxPerSecond * deltaMs) / 1000;
    let hit: TrackHit = 'none';
    for (const object of [...this.objects]) {
      object.graphics.y += step;
      const reachedRover = Math.abs(object.graphics.y - ROVER_Y) < HIT_DISTANCE_Y;
      if (object.kind === 'rock' && reachedRover && object.lane === this.lane) {
        hit = 'rock';
        this.remove(object);
      } else if (object.graphics.y > MINIGAME_AREA.y + MINIGAME_AREA.height) {
        this.remove(object);
      }
    }
    return hit;
  }

  /** Returns true if a shiny stone was under the finger (and collects it). */
  collectSampleAt(x: number, y: number): boolean {
    const sample = this.objects.find(
      (object) =>
        object.kind === 'sample' &&
        Phaser.Math.Distance.Between(x, y, object.graphics.x, object.graphics.y) <
          MIN_TOUCH_SIZE / 2,
    );
    if (!sample) return false;
    this.scene.tweens.add({ targets: sample.graphics, scale: 2, alpha: 0, duration: 200 });
    this.objects = this.objects.filter((object) => object !== sample);
    return true;
  }

  private spawn(): void {
    const kind = Math.random() < ROVER_BALANCE.sampleChance ? 'sample' : 'rock';
    const lane = Phaser.Math.Between(0, ROVER_BALANCE.lanes - 1);
    const graphics = this.scene.add.graphics({ x: laneCenterX(lane), y: SPAWN_Y });
    if (kind === 'rock') drawRock(graphics);
    else drawSample(this.scene, graphics);
    this.objects.push({ kind, lane, graphics });
  }

  private remove(object: TrackObject): void {
    object.graphics.destroy();
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

function drawRover(graphics: Phaser.GameObjects.Graphics): void {
  graphics.fillStyle(PALETTE.white, 1).fillRect(-14, -10, 28, 18);
  graphics.fillStyle(PALETTE.cyan, 1).fillRect(-8, -16, 16, 6);
  graphics.fillStyle(PALETTE.night, 1);
  for (const wheelX of [-16, 12]) {
    graphics.fillRect(wheelX, -12, 4, 8);
    graphics.fillRect(wheelX, 2, 4, 8);
  }
}

function drawRock(graphics: Phaser.GameObjects.Graphics): void {
  graphics.fillStyle(PALETTE.night, 1).fillCircle(2, 2, OBJECT_RADIUS);
  graphics.fillStyle(PALETTE.metalDark, 1).fillCircle(0, 0, OBJECT_RADIUS);
}

function drawSample(scene: Phaser.Scene, graphics: Phaser.GameObjects.Graphics): void {
  const size = OBJECT_RADIUS;
  graphics.fillStyle(PALETTE.sun, 1);
  graphics.fillTriangle(0, -size, size, 0, -size, 0).fillTriangle(0, size, size, 0, -size, 0);
  graphics.lineStyle(2, PALETTE.white, 1).strokeCircle(0, 0, size + 3);
  scene.tweens.add({ targets: graphics, alpha: 0.6, yoyo: true, repeat: -1, duration: 250 });
}
