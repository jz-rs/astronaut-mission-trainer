import Phaser from 'phaser';
import { SOLAR_PANELS_BALANCE } from '../../config/balance';
import type { Point, Rect } from '../../ui/layout';
import { sparkleAt } from '../../ui/sparkle';
import { addSprite, SPRITE_SCALE } from '../../ui/sprites';
import { showGestureHint } from '../gestureHint';
import { MinigameScene } from '../MinigameScene';

/**
 * Spec 07 — Swipe to wipe Martian dust off the solar panels (like a scratch card).
 * Each panel is the clean sprite covered by little squares cut from the dirty sprite;
 * wiping hides the squares. Performance = fraction cleaned, with a speed bonus when everything
 * is clean. On harsh locations dust slowly falls back.
 */
const PANEL_COUNT = 3;
const PANEL_GAP = 24;
const SWIPE_SAMPLE_STEP = 4;

interface DustCell {
  image: Phaser.GameObjects.Image;
  center: Point;
  panelIndex: number;
}

export class SolarPanelsMinigame extends MinigameScene {
  static readonly KEY = 'SolarPanelsMinigame';
  protected readonly instructionKey = 'minigame.solar-panels.instruction';
  private dustCells: DustCell[] = [];
  private shinyPanels = new Set<number>();
  private panelCenters: Point[] = [];
  private lastPointer: Phaser.Math.Vector2 | null = null;
  private dustReturnProgress = 0;

  constructor() {
    super(SolarPanelsMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.dustCells = [];
    this.shinyPanels.clear();
    this.panelCenters = [];
    this.lastPointer = null;
    this.dustReturnProgress = 0;
    const panelTexture = this.textures.getFrame('solarPanelClean');
    const panelWidth = panelTexture.width * SPRITE_SCALE;
    const panelHeight = panelTexture.height * SPRITE_SCALE;
    const totalWidth = PANEL_COUNT * panelWidth + (PANEL_COUNT - 1) * PANEL_GAP;
    const startX = area.x + (area.width - totalWidth) / 2;
    const y = area.y + (area.height - panelHeight) / 2;
    for (let index = 0; index < PANEL_COUNT; index += 1) {
      const topLeft = { x: startX + index * (panelWidth + PANEL_GAP), y };
      addSprite(this, topLeft.x, topLeft.y, 'solarPanelClean').setOrigin(0);
      this.panelCenters.push({ x: topLeft.x + panelWidth / 2, y: topLeft.y + panelHeight / 2 });
      this.coverWithDust(topLeft, index);
    }
    this.input.on('pointerdown', this.handleSwipe, this);
    this.input.on('pointermove', this.handleSwipe, this);
    this.input.on('pointerup', () => (this.lastPointer = null));
    this.showSwipeHint();
  }

  /** A finger wiping across all the panels, from the first to the last. */
  private showSwipeHint(): void {
    const first = this.panelCenters[0];
    const last = this.panelCenters[this.panelCenters.length - 1];
    if (first && last) showGestureHint(this, first, last);
  }

  protected calculatePerformance(): number {
    return this.withSpeedBonus(this.cleanFraction());
  }

  protected updateGame(deltaMs: number): void {
    if (this.difficulty <= 1) return;
    const perSecond = SOLAR_PANELS_BALANCE.dustReturnPerSecond * (this.difficulty - 1);
    this.dustReturnProgress += (perSecond * deltaMs) / 1000;
    while (this.dustReturnProgress >= 1) {
      this.dustReturnProgress -= 1;
      const cleanCells = this.dustCells.filter((cell) => !cell.image.visible);
      Phaser.Utils.Array.GetRandom(cleanCells)?.image.setVisible(true);
    }
  }

  /** Cuts the dirty sprite into squares, skipping the see-through ones around the panel. */
  private coverWithDust(topLeft: Point, panelIndex: number): void {
    const texture = this.textures.getFrame('solarPanelDirty');
    const cellSize = SOLAR_PANELS_BALANCE.dustCellSize / SPRITE_SCALE;
    for (let cropX = 0; cropX < texture.width; cropX += cellSize) {
      for (let cropY = 0; cropY < texture.height; cropY += cellSize) {
        const centerX = cropX + cellSize / 2;
        const centerY = cropY + cellSize / 2;
        if (this.textures.getPixelAlpha(centerX, centerY, 'solarPanelDirty') === 0) continue;
        const image = addSprite(this, topLeft.x, topLeft.y, 'solarPanelDirty').setOrigin(0);
        image.setCrop(cropX, cropY, cellSize, cellSize);
        const center = {
          x: topLeft.x + centerX * SPRITE_SCALE,
          y: topLeft.y + centerY * SPRITE_SCALE,
        };
        this.dustCells.push({ image, center, panelIndex });
      }
    }
  }

  /** Samples the whole finger path, so a fast swipe does not skip dust. */
  private handleSwipe(pointer: Phaser.Input.Pointer): void {
    if (!pointer.isDown || this.isFinished) return;
    const current = new Phaser.Math.Vector2(pointer.x, pointer.y);
    const from = this.lastPointer ?? current;
    const distance = Phaser.Math.Distance.BetweenPoints(from, current);
    const steps = Math.max(1, Math.ceil(distance / SWIPE_SAMPLE_STEP));
    for (let step = 0; step <= steps; step += 1) {
      const point = from.clone().lerp(current, step / steps);
      this.wipeAt(point.x, point.y);
    }
    this.lastPointer = current;
    if (this.cleanFraction() >= 1) this.finish();
  }

  private wipeAt(x: number, y: number): void {
    for (const cell of this.dustCells) {
      if (!cell.image.visible) continue;
      const distance = Phaser.Math.Distance.BetweenPoints({ x, y }, cell.center);
      if (distance > SOLAR_PANELS_BALANCE.brushRadius) continue;
      cell.image.setVisible(false);
      this.celebrateIfPanelClean(cell.panelIndex);
    }
  }

  /** A sparkle the first time each panel is spotless. */
  private celebrateIfPanelClean(panelIndex: number): void {
    if (this.shinyPanels.has(panelIndex)) return;
    const isDusty = (cell: DustCell) => cell.panelIndex === panelIndex && cell.image.visible;
    const center = this.panelCenters[panelIndex];
    if (!center || this.dustCells.some(isDusty)) return;
    this.shinyPanels.add(panelIndex);
    sparkleAt(this, center.x, center.y, 'energyFlash');
  }

  private cleanFraction(): number {
    const clean = this.dustCells.filter((cell) => !cell.image.visible).length;
    return this.dustCells.length === 0 ? 0 : clean / this.dustCells.length;
  }
}
