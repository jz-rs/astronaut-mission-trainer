import Phaser from 'phaser';
import { OXYGEN_FACTORY_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { FONT_SIZE, type Rect } from '../../ui/layout';
import { PALETTE, TECH_GLOW } from '../../ui/palette';
import { addText } from '../../ui/text';
import { MinigameScene } from '../MinigameScene';

/**
 * Spec 08 — Drag floating CO₂ bubbles into MOXIE; each one pops out an O₂ bubble.
 * Performance = bubbles converted / goal, with a speed bonus. Harsher locations = faster bubbles.
 */
const MACHINE_WIDTH = 96;
const MACHINE_HEIGHT = 170;
const MACHINE_MARGIN = 16;
const METER_DOT_SIZE = 8;

interface Bubble {
  body: Phaser.GameObjects.Container;
  velocity: Phaser.Math.Vector2;
  dragging: boolean;
}

export class OxygenFactoryMinigame extends MinigameScene {
  static readonly KEY = 'OxygenFactoryMinigame';
  protected readonly instructionKey = 'minigame.oxygen-factory.instruction';
  private bubbles: Bubble[] = [];
  private converted = 0;
  private spawned = 0;
  private machine = new Phaser.Geom.Rectangle();
  private playArea = new Phaser.Geom.Rectangle();
  private meter: Phaser.GameObjects.Graphics | null = null;

  constructor() {
    super(OxygenFactoryMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.bubbles = [];
    this.converted = 0;
    this.spawned = 0;
    const machineX = area.x + area.width - MACHINE_WIDTH - MACHINE_MARGIN;
    const machineY = area.y + (area.height - MACHINE_HEIGHT) / 2;
    this.machine.setTo(machineX, machineY, MACHINE_WIDTH, MACHINE_HEIGHT);
    this.playArea.setTo(area.x, area.y, machineX - area.x - MACHINE_MARGIN, area.height);
    this.drawMachine();
    for (let index = 0; index < OXYGEN_FACTORY_BALANCE.bubblesOnScreen; index += 1) {
      this.spawnCarbonBubble();
    }
    this.input.on('drag', this.handleDrag, this);
    this.input.on('dragend', this.handleDrop, this);
  }

  protected calculatePerformance(): number {
    return this.withSpeedBonus(this.converted / OXYGEN_FACTORY_BALANCE.bubblesGoal);
  }

  protected updateGame(deltaMs: number): void {
    const seconds = deltaMs / 1000;
    const radius = OXYGEN_FACTORY_BALANCE.bubbleRadius;
    for (const bubble of this.bubbles) {
      if (bubble.dragging) continue;
      const { body, velocity } = bubble;
      body.x += velocity.x * seconds;
      body.y += velocity.y * seconds;
      if (body.x < this.playArea.left + radius || body.x > this.playArea.right - radius) {
        velocity.x *= -1;
      }
      if (body.y < this.playArea.top + radius || body.y > this.playArea.bottom - radius) {
        velocity.y *= -1;
      }
      body.x = Phaser.Math.Clamp(body.x, this.playArea.left + radius, this.playArea.right - radius);
      body.y = Phaser.Math.Clamp(body.y, this.playArea.top + radius, this.playArea.bottom - radius);
    }
  }

  private drawMachine(): void {
    const { x, y, width, height } = this.machine;
    const graphics = this.add.graphics();
    graphics.fillStyle(PALETTE.metal, 1).fillRect(x, y, width, height);
    graphics.fillStyle(PALETTE.metalDark, 1).fillRect(x + 8, y + 8, width - 16, height - 16);
    graphics.fillStyle(TECH_GLOW, 1).fillRect(x - 6, y + height / 2 - 24, 10, 48); // intake
    graphics.lineStyle(2, TECH_GLOW, 1).strokeRect(x, y, width, height);
    addText(this, x + width / 2, y + 22, t('minigame.oxygen-factory.machine'), {
      size: FONT_SIZE.small,
      color: PALETTE.cyan,
    });
    this.meter = this.add.graphics();
    this.drawMeter();
  }

  /** One dot per bubble of the goal, lit as O₂ is produced. */
  private drawMeter(): void {
    if (!this.meter) return;
    const { bubblesGoal } = OXYGEN_FACTORY_BALANCE;
    const startY = this.machine.y + 44;
    this.meter.clear();
    for (let index = 0; index < bubblesGoal; index += 1) {
      const lit = index < this.converted;
      this.meter.fillStyle(lit ? PALETTE.cyan : PALETTE.space, 1);
      this.meter.fillRect(
        this.machine.centerX - METER_DOT_SIZE / 2,
        startY + index * 18,
        METER_DOT_SIZE,
        METER_DOT_SIZE,
      );
    }
  }

  private spawnCarbonBubble(): void {
    if (this.spawned >= OXYGEN_FACTORY_BALANCE.bubblesGoal) return;
    this.spawned += 1;
    const radius = OXYGEN_FACTORY_BALANCE.bubbleRadius;
    const x = Phaser.Math.Between(this.playArea.left + radius, this.playArea.right - radius);
    const y = Phaser.Math.Between(this.playArea.top + radius, this.playArea.bottom - radius);
    const circle = this.add
      .circle(0, 0, radius, PALETTE.metalDark)
      .setStrokeStyle(2, PALETTE.metal);
    const label = addText(this, 0, 0, 'CO₂', { size: FONT_SIZE.small, color: PALETTE.metalLight });
    const body = this.add.container(x, y, [circle, label]).setSize(radius * 2, radius * 2);
    body.setInteractive({ draggable: true, useHandCursor: true });
    const speed = OXYGEN_FACTORY_BALANCE.bubbleSpeed * this.difficulty;
    const velocity = new Phaser.Math.Vector2(speed, 0).rotate(
      Phaser.Math.FloatBetween(0, Math.PI * 2),
    );
    this.bubbles.push({ body, velocity, dragging: false });
  }

  private findBubble(target: Phaser.GameObjects.GameObject): Bubble | undefined {
    return this.bubbles.find((bubble) => bubble.body === target);
  }

  private handleDrag(
    _pointer: Phaser.Input.Pointer,
    target: Phaser.GameObjects.GameObject,
    x: number,
    y: number,
  ) {
    const bubble = this.findBubble(target);
    if (!bubble || this.isFinished) return;
    bubble.dragging = true;
    bubble.body.setPosition(x, y);
  }

  private handleDrop(_pointer: Phaser.Input.Pointer, target: Phaser.GameObjects.GameObject): void {
    const bubble = this.findBubble(target);
    if (!bubble) return;
    bubble.dragging = false;
    const touchZone = Phaser.Geom.Rectangle.Clone(this.machine);
    Phaser.Geom.Rectangle.Inflate(
      touchZone,
      OXYGEN_FACTORY_BALANCE.bubbleRadius,
      OXYGEN_FACTORY_BALANCE.bubbleRadius,
    );
    if (!touchZone.contains(bubble.body.x, bubble.body.y) || this.isFinished) return;
    this.convert(bubble);
  }

  private convert(bubble: Bubble): void {
    this.bubbles = this.bubbles.filter((candidate) => candidate !== bubble);
    bubble.body.destroy();
    this.converted += 1;
    this.drawMeter();
    this.popOxygen();
    if (this.converted >= OXYGEN_FACTORY_BALANCE.bubblesGoal) {
      this.finish();
      return;
    }
    this.spawnCarbonBubble();
  }

  private popOxygen(): void {
    const radius = OXYGEN_FACTORY_BALANCE.bubbleRadius * 0.8;
    const circle = this.add.circle(0, 0, radius, PALETTE.cyan).setStrokeStyle(2, PALETTE.white);
    const label = addText(this, 0, 0, 'O₂', { size: FONT_SIZE.small, color: PALETTE.night });
    const bubble = this.add.container(this.machine.centerX, this.machine.top, [circle, label]);
    bubble.setScale(0.2);
    this.tweens.add({ targets: bubble, scale: 1, duration: 150, ease: 'Back.Out' });
    this.tweens.add({
      targets: bubble,
      y: this.machine.top - 60,
      alpha: 0,
      delay: 300,
      duration: 700,
      onComplete: () => bubble.destroy(),
    });
  }
}
