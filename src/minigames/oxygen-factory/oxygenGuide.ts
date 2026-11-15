import type Phaser from 'phaser';
import type { Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addFormula, OXYGEN_RECIPE } from './oxygenRecipe';

/**
 * Spec 08 — The side panel while playing: the same 4 steps of the intro card, only as pictures,
 * so the kid can glance at it without reading. The current step is framed and bright, the steps
 * already done stay half lit and the next ones are dim. It only moves forward.
 */
export type GuideStep = 1 | 2 | 3 | 4;

const WIDTH = 124;
const MARGIN = 6;
const FORMULA_SCALE = 0.62;
const ROW_FRAME_PADDING = 4;
const DONE_ALPHA = 0.6;
const NEXT_ALPHA = 0.25;
const POP_MS = 150;

export class OxygenGuide {
  private step: GuideStep = 1;
  private readonly rect: Rect;
  private readonly rows: Phaser.GameObjects.Container[];
  private readonly frame: Phaser.GameObjects.Graphics;

  /** The panel stands on the left side of the play area. */
  constructor(
    private readonly scene: Phaser.Scene,
    area: Rect,
  ) {
    const height = area.height - MARGIN * 2;
    this.rect = { x: area.x + MARGIN, y: area.y + MARGIN, width: WIDTH, height };
    drawTechPanel(scene.add.graphics(), this.rect, PALETTE.cyan);
    this.frame = scene.add.graphics();
    const rowHeight = height / OXYGEN_RECIPE.length;
    this.rows = OXYGEN_RECIPE.map(({ formula }, index) => {
      const centerY = this.rect.y + rowHeight * (index + 0.5);
      return addFormula(scene, this.rect.x + WIDTH / 2, centerY, formula, FORMULA_SCALE);
    });
    this.render();
  }

  /** First free x to the right of the panel. */
  get right(): number {
    return this.rect.x + this.rect.width + MARGIN;
  }

  /** Steps never go back, so a kid who is ahead is not shown an older step again. */
  show(step: GuideStep): void {
    if (step <= this.step) return;
    this.step = step;
    this.render();
    const current = this.rows[step - 1];
    if (!current) return;
    current.setScale(FORMULA_SCALE * 1.3);
    this.scene.tweens.add({ targets: current, scale: FORMULA_SCALE, duration: POP_MS * 2 });
  }

  private render(): void {
    const rowHeight = this.rect.height / OXYGEN_RECIPE.length;
    this.rows.forEach((row, index) => {
      const stepNumber = index + 1;
      row.setAlpha(stepNumber === this.step ? 1 : stepNumber < this.step ? DONE_ALPHA : NEXT_ALPHA);
    });
    const top = this.rect.y + rowHeight * (this.step - 1) + ROW_FRAME_PADDING;
    const width = this.rect.width - ROW_FRAME_PADDING * 4;
    this.frame.clear();
    this.frame.lineStyle(2, PALETTE.sun, 1);
    this.frame.strokeRect(
      this.rect.x + ROW_FRAME_PADDING * 2,
      top,
      width,
      rowHeight - ROW_FRAME_PADDING * 2,
    );
  }
}
