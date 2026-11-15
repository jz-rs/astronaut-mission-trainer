import Phaser from 'phaser';
import { t } from '../../i18n';
import type { Point, Rect } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { addPlateLabel } from '../../ui/plateLabel';
import { addSpriteOfHeight, addSun, drawBattery } from './solarIcons';

/**
 * Spec 07 — Everything around the panels: the Sun that shines on them, the light beams (bright
 * where the panel is clean, faint where the dust blocks the light), the cable and the battery of
 * the base. Little yellow bolts travel along the cable, so the kid SEES clean panels make energy.
 */
export interface PanelSlot {
  topLeft: Point;
  /** Where the panel stands on the floor: the energy leaves from here. */
  foot: Point;
  width: number;
  scale: number;
}

const PANEL_COUNT = 3;
const PANEL_GAP = 10;
const PANELS_TOP = 64;
const SUN_Y = 26;
const SUN_RADIUS = 16;
const BATTERY_WIDTH = 40;
const BATTERY_HEIGHT = 120;
const BATTERY_MARGIN = 14;
const BATTERY_BOTTOM_GAP = 22;
const PLAY_GAP = 20;
const LABEL_GAP = 14;
const CABLE_RISE = 20;
const CABLE_WIDTH = 4;
const BEAM_FAINT = 0.12;
const BEAM_BRIGHT = 0.55;
const BEAM_TOP_WIDTH = 10;
const BOLT_HEIGHT = 14;
const BOLT_DROP_MS = 200;
const BOLT_TRAVEL_MS = 600;

export class SolarStation {
  readonly slots: PanelSlot[] = [];
  readonly battery: Phaser.Geom.Rectangle;
  readonly sun: Point;
  private readonly cableY: number;
  private readonly beams: Phaser.GameObjects.Graphics;
  private readonly batteryGraphics: Phaser.GameObjects.Graphics;

  constructor(
    private readonly scene: Phaser.Scene,
    area: Rect,
    playLeft: number,
  ) {
    const batteryX = area.x + area.width - BATTERY_MARGIN - BATTERY_WIDTH;
    const batteryY = area.y + area.height - BATTERY_BOTTOM_GAP - BATTERY_HEIGHT;
    this.battery = new Phaser.Geom.Rectangle(batteryX, batteryY, BATTERY_WIDTH, BATTERY_HEIGHT);
    this.cableY = this.battery.bottom - CABLE_RISE;
    const playRight = batteryX - PLAY_GAP;
    this.sun = { x: (playLeft + playRight) / 2, y: area.y + SUN_Y };
    this.placePanels(playLeft, playRight - playLeft, area.y + PANELS_TOP);
    this.beams = scene.add.graphics();
    this.drawCable();
    addSun(scene, this.sun.x, this.sun.y, SUN_RADIUS);
    this.batteryGraphics = scene.add.graphics();
    const label = t('minigame.solar-panels.battery');
    addPlateLabel(scene, this.battery.centerX, batteryY - LABEL_GAP, label, STAT_COLORS.energy);
    this.setBatteryLevel(0);
  }

  /** Brighter beams on cleaner panels: the light only gets in where there is no dust. */
  setLight(cleanFractions: readonly number[]): void {
    this.beams.clear();
    this.slots.forEach((slot, index) => {
      const clean = cleanFractions[index] ?? 0;
      const alpha = BEAM_FAINT + (BEAM_BRIGHT - BEAM_FAINT) * clean;
      const { x, y } = slot.topLeft;
      this.beams.fillStyle(PALETTE.sun, alpha);
      this.beams.fillTriangle(
        this.sun.x - BEAM_TOP_WIDTH / 2,
        this.sun.y,
        x,
        y + slot.width / 3,
        x + slot.width,
        y + slot.width / 3,
      );
      this.beams.fillTriangle(
        this.sun.x - BEAM_TOP_WIDTH / 2,
        this.sun.y,
        this.sun.x + BEAM_TOP_WIDTH / 2,
        this.sun.y,
        x + slot.width,
        y + slot.width / 3,
      );
    });
  }

  setBatteryLevel(level: number): void {
    drawBattery(this.batteryGraphics, this.battery, level);
  }

  /** A little bolt leaves the panel, runs along the cable and goes into the battery. */
  sendEnergy(panelIndex: number, onArrive: () => void): void {
    const slot = this.slots[panelIndex];
    if (!slot) return;
    const bolt = addSpriteOfHeight(this.scene, slot.foot.x, slot.foot.y, 'iconEnergy', BOLT_HEIGHT);
    bolt.setDepth(1);
    this.scene.tweens.chain({
      targets: bolt,
      tweens: [
        { y: this.cableY, duration: BOLT_DROP_MS },
        { x: this.battery.centerX, duration: BOLT_TRAVEL_MS },
        { alpha: 0, scale: bolt.scale * 2, duration: BOLT_DROP_MS },
      ],
      onComplete: () => {
        bolt.destroy();
        onArrive();
      },
    });
  }

  private placePanels(left: number, width: number, top: number): void {
    const texture = this.scene.textures.getFrame('solarPanelClean');
    const panelWidth = (width - PANEL_GAP * (PANEL_COUNT - 1)) / PANEL_COUNT;
    const scale = panelWidth / texture.width;
    const panelHeight = texture.height * scale;
    for (let index = 0; index < PANEL_COUNT; index += 1) {
      const x = left + index * (panelWidth + PANEL_GAP);
      const foot = { x: x + panelWidth / 2, y: top + panelHeight };
      this.slots.push({ topLeft: { x, y: top }, foot, width: panelWidth, scale });
    }
  }

  /** One cable from under each panel to the battery, with a dark edge so it stands out. */
  private drawCable(): void {
    const cable = this.scene.add.graphics();
    const first = this.slots[0]?.foot.x ?? 0;
    for (const [color, width] of [
      [PALETTE.night, CABLE_WIDTH + 4],
      [PALETTE.metal, CABLE_WIDTH],
    ] as const) {
      cable.lineStyle(width, color, 1);
      cable.lineBetween(first, this.cableY, this.battery.left, this.cableY);
      for (const slot of this.slots)
        cable.lineBetween(slot.foot.x, slot.foot.y, slot.foot.x, this.cableY);
    }
  }
}
