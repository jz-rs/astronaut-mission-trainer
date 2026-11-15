import Phaser from 'phaser';
import { SOLAR_PANELS_BALANCE } from '../../config/balance';
import type { Point } from '../../ui/layout';
import { addSprite } from '../../ui/sprites';

/**
 * Spec 07 — The Martian dust on the panels, like a scratch card: each panel is the clean sprite
 * covered by little squares cut from the dirty sprite, and wiping hides the squares.
 */
interface DustCell {
  image: Phaser.GameObjects.Image;
  center: Point;
  panelIndex: number;
}

export class DustCover {
  private cells: DustCell[] = [];

  constructor(private readonly scene: Phaser.Scene) {}

  /** Cuts the dirty sprite into squares, skipping the see-through ones around the panel. */
  cover(topLeft: Point, scale: number, panelIndex: number): void {
    const texture = this.scene.textures.getFrame('solarPanelDirty');
    const cellSize = SOLAR_PANELS_BALANCE.dustCellSize / scale;
    for (let cropX = 0; cropX < texture.width; cropX += cellSize) {
      for (let cropY = 0; cropY < texture.height; cropY += cellSize) {
        const centerX = cropX + cellSize / 2;
        const centerY = cropY + cellSize / 2;
        if (this.scene.textures.getPixelAlpha(centerX, centerY, 'solarPanelDirty') === 0) continue;
        const image = addSprite(this.scene, topLeft.x, topLeft.y, 'solarPanelDirty');
        image.setOrigin(0).setScale(scale).setCrop(cropX, cropY, cellSize, cellSize);
        const center = { x: topLeft.x + centerX * scale, y: topLeft.y + centerY * scale };
        this.cells.push({ image, center, panelIndex });
      }
    }
  }

  /** Wipes around (x, y). Returns the panels touched, so they can light up. */
  wipeAt(x: number, y: number): Set<number> {
    const touched = new Set<number>();
    for (const cell of this.cells) {
      if (!cell.image.visible) continue;
      const distance = Phaser.Math.Distance.BetweenPoints({ x, y }, cell.center);
      if (distance > SOLAR_PANELS_BALANCE.brushRadius) continue;
      cell.image.setVisible(false);
      touched.add(cell.panelIndex);
    }
    return touched;
  }

  /** A storm drops one square of dust back on a random clean spot. */
  dropDust(): number | null {
    const cleanCells = this.cells.filter((cell) => !cell.image.visible);
    const cell = Phaser.Utils.Array.GetRandom(cleanCells);
    if (!cell) return null;
    cell.image.setVisible(true);
    return cell.panelIndex;
  }

  /** From 0 (all dusty) to 1 (spotless); without a panel index, for all panels together. */
  cleanFraction(panelIndex?: number): number {
    const cells = this.cells.filter(
      (cell) => panelIndex === undefined || cell.panelIndex === panelIndex,
    );
    const clean = cells.filter((cell) => !cell.image.visible).length;
    return cells.length === 0 ? 0 : clean / cells.length;
  }
}
