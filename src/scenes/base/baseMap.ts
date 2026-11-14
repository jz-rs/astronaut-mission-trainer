import Phaser from 'phaser';
import { CORRIDOR, GAME_HEIGHT, GAME_WIDTH, HUD_HEIGHT } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';

/**
 * Placeholder for the top-down base map of spec 01: Mars ground + central corridor.
 * Rooms are drawn by RoomView on top of this.
 */
const CRATER_COUNT = 14;
const ROCK_COUNT = 40;
const FLOOR_TILE = 16;
const LIGHT_SPACING = 24;

export function drawBaseMap(scene: Phaser.Scene): void {
  const graphics = scene.add.graphics();
  drawGround(graphics);
  drawCorridor(graphics);
}

function drawGround(graphics: Phaser.GameObjects.Graphics): void {
  graphics.fillStyle(PALETTE.mars, 1).fillRect(0, HUD_HEIGHT, GAME_WIDTH, GAME_HEIGHT - HUD_HEIGHT);
  for (let index = 0; index < CRATER_COUNT; index += 1) {
    const x = Phaser.Math.Between(0, GAME_WIDTH);
    const y = Phaser.Math.Between(HUD_HEIGHT, GAME_HEIGHT);
    const radius = Phaser.Math.Between(6, 16);
    graphics.fillStyle(PALETTE.marsLight, 1).fillCircle(x + 2, y + 2, radius);
    graphics.fillStyle(PALETTE.marsDark, 1).fillCircle(x, y, radius);
  }
  for (let index = 0; index < ROCK_COUNT; index += 1) {
    const color = index % 2 === 0 ? PALETTE.marsDark : PALETTE.sand;
    graphics.fillStyle(color, 1);
    graphics.fillRect(
      Phaser.Math.Between(0, GAME_WIDTH),
      Phaser.Math.Between(HUD_HEIGHT, GAME_HEIGHT),
      2,
      2,
    );
  }
}

function drawCorridor(graphics: Phaser.GameObjects.Graphics): void {
  const { x, y, width, height } = CORRIDOR;
  graphics.fillStyle(PALETTE.metal, 1).fillRect(x - 4, y - 4, width + 8, height + 8);
  graphics.fillStyle(PALETTE.space, 1).fillRect(x, y, width, height);
  graphics.lineStyle(1, PALETTE.metalDark, 1);
  for (let tileX = x; tileX < x + width; tileX += FLOOR_TILE) {
    graphics.lineBetween(tileX, y, tileX, y + height);
  }
  graphics.lineBetween(x, y + height / 2, x + width, y + height / 2);
  // LED guide lights along both walls: the "current-day technology" touch.
  graphics.fillStyle(TECH_GLOW, 1);
  for (let lightX = x + 8; lightX < x + width; lightX += LIGHT_SPACING) {
    graphics.fillRect(lightX, y + 2, 6, 2);
    graphics.fillRect(lightX, y + height - 4, 6, 2);
  }
}
