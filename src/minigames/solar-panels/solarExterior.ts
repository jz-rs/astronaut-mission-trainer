/** Biome art carries the landscape; layered pixel tints follow the running sol and storm. */
import Phaser from 'phaser';
import { NIGHT_BALANCE, RUN_BALANCE } from '../../config/balance';
import type { MinigameEnvironment } from '../MinigameScene';
import { solarExteriorKey, biomeLook, FROST_TEXTURE_KEY } from '../../ui/biomes';
import { ASTRONAUT_SCALE, type Point, type Rect } from '../../ui/layout';
import { astronautFrameKey } from '../../ui/astronautFrames';
import { NightShade } from '../../ui/nightfall';
import { PALETTE } from '../../ui/palette';
import { addSprite } from '../../ui/sprites';

const SKY_HEIGHT = 72;
const SUN_SIZE = 24;
const WEATHER_COUNT = 32;
const WEATHER_SPEED = 46;

/** Keep the player's existing suit and scale beside the outdoor equipment. */
export function addSolarAstronaut(scene: Phaser.Scene, area: Rect): Phaser.GameObjects.Image {
  return scene.add
    .image(
      area.x + area.width - 92,
      area.y + area.height - 10,
      astronautFrameKey('violet', 'front'),
    )
    .setOrigin(0.5, 1)
    .setScale(ASTRONAUT_SCALE);
}

export class SolarExterior {
  readonly sun: Phaser.GameObjects.Image;
  private readonly sunset: Phaser.GameObjects.Graphics;
  private readonly night: NightShade;
  private readonly storm: Phaser.GameObjects.Rectangle;
  private readonly weather: Phaser.GameObjects.Rectangle[] = [];
  private readonly snow: boolean;
  private readonly dusty: boolean;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly area: Rect,
    locationId?: string,
  ) {
    scene.add
      .image(area.x, area.y, solarExteriorKey(locationId))
      .setOrigin(0)
      .setDisplaySize(area.width, area.height);
    this.sunset = scene.add.graphics();
    this.sun = addSprite(scene, 0, 0, 'sol').setDisplaySize(SUN_SIZE, SUN_SIZE);
    this.night = new NightShade(scene, area);
    this.storm = scene.add
      .rectangle(area.x, area.y, area.width, area.height, PALETTE.metalDark)
      .setOrigin(0)
      .setAlpha(0);
    const look = biomeLook(locationId ?? 'jezero');
    this.snow = look.weather === 'snow';
    this.dusty = look.weather === 'dust';
  }

  /** Weather sits above the panels while the sky and landscape stay behind them. */
  addWeather(): void {
    for (let index = 0; index < WEATHER_COUNT; index++) {
      const grain = this.scene.add
        .rectangle(
          this.area.x + Math.random() * this.area.width,
          this.area.y + Math.random() * this.area.height,
          this.snow ? 2 : 5,
          2,
          this.snow ? PALETTE.white : PALETTE.sand,
        )
        .setDepth(2)
        .setVisible(false);
      this.weather.push(grain);
    }
    if (this.snow && this.scene.textures.exists(FROST_TEXTURE_KEY)) {
      this.scene.add
        .image(this.area.x, this.area.y, FROST_TEXTURE_KEY)
        .setOrigin(0)
        .setDisplaySize(this.area.width, this.area.height)
        .setAlpha(0.35)
        .setDepth(2);
    }
  }

  update(environment: MinigameEnvironment, seconds = 0): Point {
    const fraction = Math.min(1, Math.max(0, environment.solElapsedMs / RUN_BALANCE.solDurationMs));
    this.sun.setPosition(this.area.x + 200 + fraction * 150, this.area.y + 17 + fraction * 72);
    const sunset = Math.sin(Math.PI * environment.nightAmount);
    this.drawSunset(sunset);
    this.night.setAmount(environment.nightAmount);
    this.sun.setAlpha(
      environment.dustStorm || environment.nightAmount >= NIGHT_BALANCE.noSunFrom ? 0 : 1,
    );
    this.storm.setAlpha(environment.dustStorm ? 0.7 : 0);
    this.moveWeather(seconds, environment.dustStorm);
    return { x: this.sun.x, y: this.sun.y };
  }

  private drawSunset(amount: number): void {
    this.sunset.clear();
    for (let layer = 3; layer > 0; layer--) {
      const width = 24 + layer * 20;
      const top = Math.max(this.area.y, this.sun.y - width / 2);
      const bottom = Math.min(this.area.y + SKY_HEIGHT, this.sun.y + width / 2);
      if (bottom <= top) continue;
      this.sunset
        .fillStyle(PALETTE.cyan, amount * 0.12)
        .fillRect(this.sun.x - width / 2, top, width, bottom - top);
    }
  }

  private moveWeather(seconds: number, storm: boolean): void {
    for (const grain of this.weather) {
      grain.setVisible(this.snow || this.dusty || storm);
      grain.y += seconds * WEATHER_SPEED;
      grain.x += seconds * (this.snow ? 8 : WEATHER_SPEED);
      if (grain.y > this.area.y + this.area.height) grain.y = this.area.y;
      if (grain.x > this.area.x + this.area.width) grain.x = this.area.x;
    }
  }
}
