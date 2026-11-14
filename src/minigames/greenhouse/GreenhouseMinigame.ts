import Phaser from 'phaser';
import { GREENHOUSE_BALANCE } from '../../config/balance';
import type { Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { MinigameScene } from '../MinigameScene';
import { drawPlant, type PlantState } from './plantDrawing';

/**
 * Spec 09 — Tap the thirsty plants (yellow, with a water drop) before they wither. Whack-a-mole.
 * Performance = plants saved / plants that got thirsty, + bonus if none withered.
 * Harsher locations = plants get thirsty more often and last less.
 */
const CELL_WIDTH = 140;
const CELL_HEIGHT = 112;
const DROP_BOUNCE_PX = 4;

interface Plant {
  state: PlantState;
  thirstyMs: number;
  body: Phaser.GameObjects.Container;
  graphics: Phaser.GameObjects.Graphics;
  drop: Phaser.GameObjects.Graphics;
}

export class GreenhouseMinigame extends MinigameScene {
  static readonly KEY = 'GreenhouseMinigame';
  protected readonly instructionKey = 'minigame.greenhouse.instruction';
  private plants: Plant[] = [];
  private nextThirstMs = 0;
  private saved = 0;
  private withered = 0;
  private gotThirsty = 0;

  constructor() {
    super(GreenhouseMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.plants = [];
    this.saved = 0;
    this.withered = 0;
    this.gotThirsty = 0;
    this.nextThirstMs = 0;
    const { columns, rows } = GREENHOUSE_BALANCE;
    const startX = area.x + (area.width - columns * CELL_WIDTH) / 2 + CELL_WIDTH / 2;
    const startY = area.y + (area.height - rows * CELL_HEIGHT) / 2 + CELL_HEIGHT / 2;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        this.plants.push(
          this.createPlant(startX + column * CELL_WIDTH, startY + row * CELL_HEIGHT),
        );
      }
    }
  }

  protected calculatePerformance(): number {
    if (this.gotThirsty === 0) return 1;
    const savedFraction = this.saved / this.gotThirsty;
    const bonus = this.withered === 0 ? GREENHOUSE_BALANCE.noWitheredBonus : 0;
    return savedFraction + bonus;
  }

  protected updateGame(deltaMs: number): void {
    const thirstyLimitMs = GREENHOUSE_BALANCE.thirstyForMs / this.difficulty;
    for (const plant of this.plants) {
      if (plant.state !== 'thirsty') continue;
      plant.thirstyMs += deltaMs;
      if (plant.thirstyMs >= thirstyLimitMs) {
        this.withered += 1;
        this.setState(plant, 'withered');
      }
    }
    this.nextThirstMs -= deltaMs;
    if (this.nextThirstMs <= 0) {
      this.nextThirstMs = GREENHOUSE_BALANCE.thirstEveryMs / this.difficulty;
      this.makeRandomPlantThirsty();
    }
    if (this.plants.every((plant) => plant.state === 'withered')) this.finish();
  }

  private createPlant(x: number, y: number): Plant {
    const frame = this.add.graphics();
    frame
      .lineStyle(1, TECH_GLOW, 0.4)
      .strokeRect(
        x - CELL_WIDTH / 2 + 6,
        y - CELL_HEIGHT / 2 + 4,
        CELL_WIDTH - 12,
        CELL_HEIGHT - 8,
      );
    const graphics = this.add.graphics();
    const drop = this.add.graphics().setVisible(false);
    drop.fillStyle(PALETTE.cyan, 1).fillTriangle(0, -10, -6, 0, 6, 0).fillCircle(0, 2, 6);
    drop.setPosition(0, -40);
    const body = this.add
      .container(x, y, [graphics, drop])
      .setSize(CELL_WIDTH - 12, CELL_HEIGHT - 8);
    body.setInteractive({ useHandCursor: true });
    const plant: Plant = { state: 'healthy', thirstyMs: 0, body, graphics, drop };
    body.on('pointerdown', () => this.water(plant));
    drawPlant(graphics, 'healthy');
    this.tweens.add({
      targets: drop,
      y: -40 - DROP_BOUNCE_PX,
      yoyo: true,
      repeat: -1,
      duration: 250,
    });
    return plant;
  }

  private makeRandomPlantThirsty(): void {
    const healthy = this.plants.filter((plant) => plant.state === 'healthy');
    const plant = Phaser.Utils.Array.GetRandom(healthy);
    if (!plant) return;
    this.gotThirsty += 1;
    plant.thirstyMs = 0;
    this.setState(plant, 'thirsty');
  }

  private water(plant: Plant): void {
    if (plant.state !== 'thirsty' || this.isFinished) return;
    this.saved += 1;
    this.setState(plant, 'healthy');
    plant.body.setScale(1.15);
    this.tweens.add({ targets: plant.body, scale: 1, duration: 200, ease: 'Back.Out' });
  }

  private setState(plant: Plant, state: PlantState): void {
    plant.state = state;
    plant.drop.setVisible(state === 'thirsty');
    drawPlant(plant.graphics, state);
  }
}
