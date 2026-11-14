import Phaser from 'phaser';
import { OXYGEN_FACTORY_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { FONT_SIZE, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { sparkleAt } from '../../ui/sparkle';
import { addSprite, addSpriteSized } from '../../ui/sprites';
import { addText } from '../../ui/text';
import { showGestureHint } from '../gestureHint';
import { MinigameScene } from '../MinigameScene';

/**
 * Spec 08 — Drag floating CO₂ bubbles into MOXIE (or just tap them: they fly in);
 * each one pops out an O₂ bubble.
 * Performance = bubbles converted / goal, with a speed bonus. Harsher locations = faster bubbles.
 */
const MACHINE_MARGIN = 24;
const METER_DOT_SIZE = 8;
const METER_DOT_SPACING = 14;
const METER_OFFSET_Y = 14;
const LABEL_OFFSET_Y = 12;
const PLATE_PADDING = 4;
const PLATE_ALPHA = 0.8;
/** A finger that moves less than this between press and release tapped instead of dragging. */
const TAP_DISTANCE = 8;
const FLY_TO_MACHINE_MS = 250;

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
  private machineImage: Phaser.GameObjects.Image | null = null;

  constructor() {
    super(OxygenFactoryMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.bubbles = [];
    this.converted = 0;
    this.spawned = 0;
    this.drawMachine(area);
    const playWidth = this.machine.x - area.x - MACHINE_MARGIN;
    this.playArea.setTo(area.x, area.y, playWidth, area.height);
    for (let index = 0; index < OXYGEN_FACTORY_BALANCE.bubblesOnScreen; index += 1) {
      this.spawnCarbonBubble();
    }
    this.input.on('drag', this.handleDrag, this);
    this.input.on('dragend', this.handleDrop, this);
    const firstBubble = this.bubbles[0]?.body;
    if (firstBubble) {
      const machineCenter = { x: this.machine.centerX, y: this.machine.centerY };
      showGestureHint(this, { x: firstBubble.x, y: firstBubble.y }, machineCenter);
    }
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

  /** MOXIE stands on the right, switched off until the first CO₂ goes in. */
  private drawMachine(area: Rect): void {
    const image = addSprite(this, 0, 0, 'oxygenMachineOff');
    const { displayWidth: width, displayHeight: height } = image;
    const x = area.x + area.width - width - MACHINE_MARGIN;
    const y = area.y + (area.height - height) / 2;
    image.setPosition(x + width / 2, y + height / 2);
    this.machine.setTo(x, y, width, height);
    this.machineImage = image;
    const label = addText(
      this,
      x + width / 2,
      y - LABEL_OFFSET_Y,
      t('minigame.oxygen-factory.machine'),
      {
        size: FONT_SIZE.small,
        color: PALETTE.cyan,
      },
    );
    this.addPlateBehind(label.x, label.y, label.width, label.height);
    label.setDepth(1);
    const meterWidth = OXYGEN_FACTORY_BALANCE.bubblesGoal * METER_DOT_SPACING;
    const meterCenterY = this.machine.bottom + METER_OFFSET_Y + METER_DOT_SIZE / 2;
    this.addPlateBehind(this.machine.centerX, meterCenterY, meterWidth, METER_DOT_SIZE);
    this.meter = this.add.graphics().setDepth(1);
    this.drawMeter();
  }

  /** Dark plate so a label stays readable over the busy room picture (drawn under depth 1). */
  private addPlateBehind(centerX: number, centerY: number, width: number, height: number): void {
    const plate = this.add.rectangle(
      centerX,
      centerY,
      width + PLATE_PADDING * 2,
      height + PLATE_PADDING * 2,
      PALETTE.night,
    );
    plate.setAlpha(PLATE_ALPHA);
  }

  /** One dot per bubble of the goal, lit as O₂ is produced. */
  private drawMeter(): void {
    if (!this.meter) return;
    const { bubblesGoal } = OXYGEN_FACTORY_BALANCE;
    const y = this.machine.bottom + METER_OFFSET_Y;
    const startX = this.machine.centerX - ((bubblesGoal - 1) * METER_DOT_SPACING) / 2;
    this.meter.clear();
    for (let index = 0; index < bubblesGoal; index += 1) {
      const lit = index < this.converted;
      const x = startX + index * METER_DOT_SPACING - METER_DOT_SIZE / 2;
      this.meter
        .fillStyle(PALETTE.night, 1)
        .fillRect(x - 1, y - 1, METER_DOT_SIZE + 2, METER_DOT_SIZE + 2);
      this.meter.fillStyle(lit ? PALETTE.cyan : PALETTE.metalDark, 1);
      this.meter.fillRect(x, y, METER_DOT_SIZE, METER_DOT_SIZE);
    }
  }

  private spawnCarbonBubble(): void {
    if (this.spawned >= OXYGEN_FACTORY_BALANCE.bubblesGoal) return;
    this.spawned += 1;
    const radius = OXYGEN_FACTORY_BALANCE.bubbleRadius;
    const x = Phaser.Math.Between(this.playArea.left + radius, this.playArea.right - radius);
    const y = Phaser.Math.Between(this.playArea.top + radius, this.playArea.bottom - radius);
    const sprite = addSpriteSized(this, 0, 0, 'bubbleCarbon', radius * 2);
    const label = addText(this, 0, 0, 'CO₂', { size: FONT_SIZE.small, color: PALETTE.white });
    const body = this.add.container(x, y, [sprite, label]).setSize(radius * 2, radius * 2);
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

  private handleDrop(pointer: Phaser.Input.Pointer, target: Phaser.GameObjects.GameObject): void {
    const bubble = this.findBubble(target);
    if (!bubble) return;
    if (pointer.getDistance() < TAP_DISTANCE && !this.isFinished) {
      this.flyIntoMachine(bubble);
      return;
    }
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

  /** A tapped bubble flies into MOXIE by itself. */
  private flyIntoMachine(bubble: Bubble): void {
    bubble.dragging = true; // stops the floating movement while it flies
    bubble.body.disableInteractive();
    this.tweens.add({
      targets: bubble.body,
      x: this.machine.centerX,
      y: this.machine.centerY,
      duration: FLY_TO_MACHINE_MS,
      onComplete: () => this.convert(bubble),
    });
  }

  private convert(bubble: Bubble): void {
    this.bubbles = this.bubbles.filter((candidate) => candidate !== bubble);
    bubble.body.destroy();
    this.converted += 1;
    this.machineImage?.setTexture('oxygenMachineOn');
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
    const sprite = addSpriteSized(this, 0, 0, 'bubbleOxygen', radius * 2);
    const label = addText(this, 0, 0, 'O₂', { size: FONT_SIZE.small, color: PALETTE.night });
    const bubble = this.add.container(this.machine.centerX, this.machine.top, [sprite, label]);
    sparkleAt(this, this.machine.centerX, this.machine.top, 'popFlash');
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
