import Phaser from 'phaser';
import { SOLAR_PANELS_BALANCE } from '../../config/balance';
import type { Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { MinigameScene } from '../MinigameScene';

/**
 * Spec 07 — Swipe to wipe Martian dust off the solar panels (like a scratch card).
 * Performance = fraction cleaned, with a speed bonus when everything is clean.
 * On harsh locations dust slowly falls back.
 */
const PANEL_COUNT = 3;
const PANEL_WIDTH = 140;
const PANEL_HEIGHT = 160;
const PANEL_GAP = 24;
const PANEL_GRID_STEP = 20;
const SWIPE_SAMPLE_STEP = 4;
const DUST_COLORS = [PALETTE.marsDark, PALETTE.mars, PALETTE.marsLight, PALETTE.sand];

export class SolarPanelsMinigame extends MinigameScene {
  static readonly KEY = 'SolarPanelsMinigame';
  protected readonly instructionKey = 'minigame.solar-panels.instruction';
  private dustCells: Phaser.GameObjects.Rectangle[] = [];
  private lastPointer: Phaser.Math.Vector2 | null = null;
  private dustReturnProgress = 0;

  constructor() {
    super(SolarPanelsMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.dustCells = [];
    this.lastPointer = null;
    this.dustReturnProgress = 0;
    const totalWidth = PANEL_COUNT * PANEL_WIDTH + (PANEL_COUNT - 1) * PANEL_GAP;
    const startX = area.x + (area.width - totalWidth) / 2;
    const y = area.y + (area.height - PANEL_HEIGHT) / 2;
    for (let index = 0; index < PANEL_COUNT; index += 1) {
      const panel = {
        x: startX + index * (PANEL_WIDTH + PANEL_GAP),
        y,
        width: PANEL_WIDTH,
        height: PANEL_HEIGHT,
      };
      this.drawPanel(panel);
      this.coverWithDust(panel);
    }
    this.input.on('pointerdown', this.handleSwipe, this);
    this.input.on('pointermove', this.handleSwipe, this);
    this.input.on('pointerup', () => (this.lastPointer = null));
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
      const cleanCells = this.dustCells.filter((cell) => !cell.visible);
      Phaser.Utils.Array.GetRandom(cleanCells)?.setVisible(true);
    }
  }

  private drawPanel(panel: Rect): void {
    const graphics = this.add.graphics();
    graphics
      .fillStyle(PALETTE.metal, 1)
      .fillRect(panel.x - 4, panel.y - 4, panel.width + 8, panel.height + 8);
    graphics.fillStyle(PALETTE.space, 1).fillRect(panel.x, panel.y, panel.width, panel.height);
    graphics.lineStyle(1, TECH_GLOW, 0.6);
    for (let x = panel.x; x <= panel.x + panel.width; x += PANEL_GRID_STEP) {
      graphics.lineBetween(x, panel.y, x, panel.y + panel.height);
    }
    for (let y = panel.y; y <= panel.y + panel.height; y += PANEL_GRID_STEP) {
      graphics.lineBetween(panel.x, y, panel.x + panel.width, y);
    }
  }

  private coverWithDust(panel: Rect): void {
    const size = SOLAR_PANELS_BALANCE.dustCellSize;
    for (let x = panel.x; x < panel.x + panel.width; x += size) {
      for (let y = panel.y; y < panel.y + panel.height; y += size) {
        const color = Phaser.Utils.Array.GetRandom(DUST_COLORS);
        this.dustCells.push(this.add.rectangle(x, y, size, size, color).setOrigin(0));
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
    const half = SOLAR_PANELS_BALANCE.dustCellSize / 2;
    for (const cell of this.dustCells) {
      if (!cell.visible) continue;
      const distance = Phaser.Math.Distance.Between(x, y, cell.x + half, cell.y + half);
      if (distance <= SOLAR_PANELS_BALANCE.brushRadius) cell.setVisible(false);
    }
  }

  private cleanFraction(): number {
    const clean = this.dustCells.filter((cell) => !cell.visible).length;
    return this.dustCells.length === 0 ? 0 : clean / this.dustCells.length;
  }
}
