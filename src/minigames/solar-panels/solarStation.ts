import Phaser from 'phaser';
import { t } from '../../i18n';
import type { Point, Rect } from '../../ui/layout';
import { PALETTE, STAT_COLORS } from '../../ui/palette';
import { addPlateLabel } from '../../ui/plateLabel';
import { addSpriteOfHeight, drawBattery } from './solarIcons';

/**
 * Spec 07 — Everything around the panels: the sunlight that comes in through the room's window
 * (bright on clean panels, faint where the dust blocks it, and weaker as night comes), the cable
 * and the battery of the base. Little yellow bolts travel along the cable, so the kid SEES clean
 * panels make energy.
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
/** Low enough that the light comes down from the window onto the panels. */
const PANELS_TOP = 100;
/** At night the window glass goes this dark (on top of the room's own night shade). */
const WINDOW_NIGHT_ALPHA = 0.8;
const BATTERY_WIDTH = 40;
const BATTERY_HEIGHT = 120;
const BATTERY_MARGIN = 14;
const BATTERY_BOTTOM_GAP = 22;
const PLAY_GAP = 20;
const LABEL_GAP = 14;
const CABLE_RISE = 20;
const CABLE_WIDTH = 4;
const RAYS_PER_PANEL = 3;
const RAY_WIDTH = 2;
/** A spotless panel gets thicker rays than a dusty one. */
const RAY_EXTRA_WIDTH = 2;
const RAY_FAINT = 0.2;
const BOLT_HEIGHT = 14;
const BOLT_DROP_MS = 200;
const BOLT_TRAVEL_MS = 600;

export class SolarStation {
  readonly slots: PanelSlot[] = [];
  readonly battery: Phaser.Geom.Rectangle;
  private readonly cableY: number;
  private readonly beams: Phaser.GameObjects.Graphics;
  private readonly batteryGraphics: Phaser.GameObjects.Graphics;

  /**
   * `window` is the glass of the room's window on screen; `daylight` goes from 1 (noon) down to
   * the little light left at night.
   */
  constructor(
    private readonly scene: Phaser.Scene,
    area: Rect,
    playLeft: number,
    readonly window: Rect,
    private readonly daylight: number,
  ) {
    const batteryX = area.x + area.width - BATTERY_MARGIN - BATTERY_WIDTH;
    const batteryY = area.y + area.height - BATTERY_BOTTOM_GAP - BATTERY_HEIGHT;
    this.battery = new Phaser.Geom.Rectangle(batteryX, batteryY, BATTERY_WIDTH, BATTERY_HEIGHT);
    this.cableY = this.battery.bottom - CABLE_RISE;
    const playRight = batteryX - PLAY_GAP;
    this.placePanels(playLeft, playRight - playLeft, area.y + PANELS_TOP);
    this.beams = scene.add.graphics();
    this.drawCable();
    this.darkenWindow(area);
    this.batteryGraphics = scene.add.graphics();
    const label = t('minigame.solar-panels.battery');
    addPlateLabel(scene, this.battery.centerX, batteryY - LABEL_GAP, label, STAT_COLORS.energy);
    this.setBatteryLevel(0);
  }

  /**
   * Rays of sunlight from the window to every panel, brighter on cleaner panels: the light only
   * gets in where there is no dust. Each ray has a dark edge so it stands out over the yellow room.
   */
  setLight(cleanFractions: readonly number[]): void {
    this.beams.clear();
    this.slots.forEach((slot, index) => {
      const clean = cleanFractions[index] ?? 0;
      const alpha = (RAY_FAINT + (1 - RAY_FAINT) * clean) * this.daylight;
      const width = RAY_WIDTH + RAY_EXTRA_WIDTH * clean;
      const targetY = slot.topLeft.y + slot.width / 3;
      for (let ray = 1; ray <= RAYS_PER_PANEL; ray += 1) {
        const share = ray / (RAYS_PER_PANEL + 1);
        const targetX = slot.topLeft.x + slot.width * share;
        const startX = this.window.x + this.window.width * share;
        this.beams.lineStyle(width + 2, PALETTE.night, alpha * 0.6);
        this.beams.lineBetween(startX, this.window.y + this.window.height, targetX, targetY);
        this.beams.lineStyle(width, PALETTE.sun, alpha);
        this.beams.lineBetween(startX, this.window.y + this.window.height, targetX, targetY);
      }
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

  /** Night outside: the window glass goes dark, only the part inside the play area. */
  private darkenWindow(area: Rect): void {
    const top = Math.max(area.y, this.window.y);
    const height = this.window.y + this.window.height - top;
    const glass = this.scene.add.rectangle(
      this.window.x,
      top,
      this.window.width,
      height,
      PALETTE.night,
    );
    glass.setOrigin(0).setAlpha((1 - this.daylight) * WINDOW_NIGHT_ALPHA);
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
