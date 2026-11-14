import type Phaser from 'phaser';
import type { TaskId } from '../../core/types';
import type { Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';

/**
 * Placeholder furniture so each room is recognizable without reading,
 * until the room art of spec 01 replaces it. Drawn in the half of the room away from the door.
 */
type FurnitureDrawer = (graphics: Phaser.GameObjects.Graphics, area: Rect) => void;

const FURNITURE: Record<TaskId, FurnitureDrawer> = {
  'oxygen-factory': drawOxygenTanks,
  greenhouse: drawPlantTrays,
  'solar-panels': drawSolarPanels,
  'shield-wall': drawShieldBlocks,
};

export function drawFurniture(
  graphics: Phaser.GameObjects.Graphics,
  taskId: TaskId,
  area: Rect,
): void {
  FURNITURE[taskId](graphics, area);
}

function drawOxygenTanks(graphics: Phaser.GameObjects.Graphics, area: Rect): void {
  for (let index = 0; index < 4; index += 1) {
    const x = area.x + 16 + index * 30;
    graphics.fillStyle(PALETTE.metalLight, 1).fillRect(x, area.y, 22, area.height);
    graphics
      .fillStyle(TECH_GLOW, 1)
      .fillRect(x + 4, area.y + area.height / 2, 14, area.height / 2 - 4);
  }
  graphics.fillStyle(PALETTE.metal, 1).fillRect(area.x + 140, area.y + 10, 100, 8);
  graphics.fillStyle(PALETTE.metalDark, 1).fillRect(area.x + 180, area.y, 50, area.height);
  graphics.fillStyle(TECH_GLOW, 1).fillRect(area.x + 186, area.y + 6, 38, 14); // control screen
}

function drawPlantTrays(graphics: Phaser.GameObjects.Graphics, area: Rect): void {
  for (let row = 0; row < 2; row += 1) {
    const y = area.y + row * (area.height / 2 + 2);
    graphics.fillStyle(PALETTE.metal, 1).fillRect(area.x + 10, y + 10, area.width - 20, 10);
    graphics.fillStyle(PALETTE.violet, 1).fillRect(area.x + 10, y, area.width - 20, 2); // grow lights
    for (let plantX = area.x + 18; plantX < area.x + area.width - 16; plantX += 18) {
      graphics.fillStyle(PALETTE.green, 1).fillCircle(plantX, y + 8, 6);
    }
  }
}

function drawSolarPanels(graphics: Phaser.GameObjects.Graphics, area: Rect): void {
  for (let index = 0; index < 4; index += 1) {
    const x = area.x + 12 + index * 60;
    graphics.fillStyle(PALETTE.metal, 1).fillRect(x - 2, area.y - 2, 48, area.height + 4);
    graphics.fillStyle(PALETTE.space, 1).fillRect(x, area.y, 44, area.height);
    graphics.lineStyle(1, TECH_GLOW, 0.7).strokeRect(x, area.y, 22, area.height / 2);
    graphics.strokeRect(x + 22, area.y + area.height / 2, 22, area.height / 2);
    graphics.fillStyle(PALETTE.marsLight, 0.6).fillRect(x + 4, area.y + 4, 10, 6); // dust spots
  }
}

function drawShieldBlocks(graphics: Phaser.GameObjects.Graphics, area: Rect): void {
  const blockWidth = 28;
  for (let x = area.x + 8; x < area.x + area.width - blockWidth; x += blockWidth + 2) {
    const isWater = Math.round((x - area.x) / blockWidth) % 2 === 0;
    graphics
      .fillStyle(isWater ? PALETTE.cyan : PALETTE.mars, 1)
      .fillRect(x, area.y, blockWidth, area.height);
    graphics.lineStyle(1, PALETTE.night, 1).strokeRect(x, area.y, blockWidth, area.height);
  }
  graphics
    .fillStyle(PALETTE.violet, 1)
    .fillRect(area.x + 8, area.y + area.height + 2, area.width - 16, 2);
}
