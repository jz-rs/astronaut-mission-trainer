import Phaser from 'phaser';
import { COLORS } from './palette';

const LOW_VALUE_THRESHOLD = 25;
const BAR_HEIGHT = 10;

/** A horizontal bar with an icon. Blinks red when the value is low, so kids notice without reading. */
export class StatBar {
  private readonly fill: Phaser.GameObjects.Rectangle;
  private readonly width: number;
  private readonly color: number;

  constructor(scene: Phaser.Scene, x: number, y: number, icon: string, color: number, width = 90) {
    this.width = width;
    this.color = color;
    scene.add.text(x, y, icon, { fontSize: '14px' }).setOrigin(0, 0.5);
    const barX = x + 20;
    scene.add
      .rectangle(barX, y, width, BAR_HEIGHT, COLORS.panel)
      .setOrigin(0, 0.5)
      .setStrokeStyle(1, COLORS.panelBorder);
    this.fill = scene.add.rectangle(barX, y, width, BAR_HEIGHT, color).setOrigin(0, 0.5);
  }

  /** @param value stat from 0 to 100 */
  setValue(value: number, timeMs: number): void {
    this.fill.width = (this.width * value) / 100;
    const isBlinkingOn = Math.floor(timeMs / 300) % 2 === 0;
    this.fill.fillColor = value < LOW_VALUE_THRESHOLD && isBlinkingOn ? COLORS.danger : this.color;
  }
}
