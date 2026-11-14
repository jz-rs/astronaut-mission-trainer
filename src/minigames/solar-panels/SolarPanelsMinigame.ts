import Phaser from 'phaser';
import { COLORS, PALETTE } from '../../ui/palette';
import { MinigameScene } from '../MinigameScene';

export const SOLAR_PANELS_SCENE_KEY = 'SolarPanelsMinigame';

const PANEL_COUNT = 3;
const PANEL_GAP = 16;
const DUST_CELL_SIZE = 16;
const WIPE_RADIUS = 22;
/** Finishing fast gives up to +20% (a "perfect"), which also trains the bots better. */
const MAX_TIME_BONUS = 0.2;

/**
 * "Wipe the dust off the panels": drag your finger across the dusty panels.
 * Teaches that Martian dust is the biggest enemy of solar power.
 */
export class SolarPanelsMinigame extends MinigameScene {
  protected readonly instructionKey = 'minigame.solar-panels.instruction';
  private dustCells: Phaser.GameObjects.Rectangle[] = [];
  private cleanedCount = 0;

  constructor() {
    super({ key: SOLAR_PANELS_SCENE_KEY });
  }

  protected buildGame(): void {
    this.dustCells = [];
    this.cleanedCount = 0;
    this.drawPanelsWithDust();
    this.input.on('pointerdown', this.wipeAt, this);
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) this.wipeAt(pointer);
    });
  }

  protected measurePerformance(): number {
    const cleanedRatio = this.cleanedCount / this.dustCells.length;
    const isFullyClean = this.cleanedCount === this.dustCells.length;
    const timeBonus = isFullyClean ? MAX_TIME_BONUS * (1 - this.timeProgress()) : 0;
    return cleanedRatio + timeBonus;
  }

  private drawPanelsWithDust(): void {
    const area = this.playArea;
    const panelWidth = (area.width - PANEL_GAP * (PANEL_COUNT - 1)) / PANEL_COUNT;
    for (let index = 0; index < PANEL_COUNT; index++) {
      const panelX = area.x + index * (panelWidth + PANEL_GAP);
      this.add
        .rectangle(panelX, area.y, panelWidth, area.height, PALETTE.metalDark)
        .setOrigin(0)
        .setStrokeStyle(2, COLORS.panelBorder);
      this.drawSolarCells(panelX, area.y, panelWidth, area.height);
      this.coverWithDust(panelX, area.y, panelWidth, area.height);
    }
  }

  private drawSolarCells(x: number, y: number, width: number, height: number): void {
    const grid = this.add.grid(
      x + width / 2,
      y + height / 2,
      width - 8,
      height - 8,
      24,
      24,
      PALETTE.sky,
      0.35,
    );
    grid.setOutlineStyle(PALETTE.deepSpace);
  }

  private coverWithDust(x: number, y: number, width: number, height: number): void {
    for (let cellY = y; cellY < y + height; cellY += DUST_CELL_SIZE) {
      for (let cellX = x; cellX < x + width; cellX += DUST_CELL_SIZE) {
        const shade = Phaser.Math.RND.pick([PALETTE.mars, PALETTE.marsLight, PALETTE.sand]);
        const cellWidth = Math.min(DUST_CELL_SIZE, x + width - cellX);
        const cellHeight = Math.min(DUST_CELL_SIZE, y + height - cellY);
        this.dustCells.push(
          this.add.rectangle(cellX, cellY, cellWidth, cellHeight, shade, 0.95).setOrigin(0),
        );
      }
    }
  }

  private wipeAt(pointer: Phaser.Input.Pointer): void {
    for (const cell of this.dustCells) {
      if (!cell.visible) continue;
      const distance = Phaser.Math.Distance.Between(
        pointer.x,
        pointer.y,
        cell.getCenter().x,
        cell.getCenter().y,
      );
      if (distance > WIPE_RADIUS) continue;
      cell.setVisible(false);
      this.cleanedCount++;
    }
    if (this.cleanedCount === this.dustCells.length) this.finish();
  }
}
