import Phaser from 'phaser';
import { SOLAR_PANELS_BALANCE } from '../../config/balance';
import { t } from '../../i18n';
import { floatText } from '../../ui/floatingText';
import type { Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { sparkleAt } from '../../ui/sparkle';
import { addSprite } from '../../ui/sprites';
import { showGestureHint } from '../gestureHint';
import { showHowToCard } from '../howTo/howToCard';
import { StepGuide } from '../howTo/stepGuide';
import { MinigameScene } from '../MinigameScene';
import { DustCover } from './dustCover';
import { SOLAR_STEPS } from './solarRecipe';
import { SolarStation } from './solarStation';

/**
 * Spec 07 — Swipe to wipe Martian dust off the solar panels (like a scratch card). The Sun shines
 * on them: where there is dust the light can't get in, and every clean panel sends little yellow
 * bolts of energy along the cable to the battery of the base. Mars gets less than half the
 * sunlight Earth gets, so every clean bit counts.
 * Performance = fraction cleaned, with a speed bonus when everything is clean.
 * On harsh locations dust slowly falls back, like a dust storm.
 */
const SWIPE_SAMPLE_STEP = 4;
/** How fast the battery drawing catches up with the real charge (per second). */
const BATTERY_CATCH_UP = 4;
/** A short moment to see the full battery before the result card. */
const FINISH_DELAY_MS = 700;
const CLEAN_POP_OFFSET_Y = 10;
/** The glass of the energy room's window, in pixels of the room picture (same in every biome). */
const WINDOW_GLASS = { left: 620, top: 105, right: 735, bottom: 215 };

export class SolarPanelsMinigame extends MinigameScene {
  static readonly KEY = 'SolarPanelsMinigame';
  protected readonly instructionKey = 'minigame.solar-panels.instruction';
  private dust: DustCover | null = null;
  private station: SolarStation | null = null;
  private guide: StepGuide | null = null;
  private shinyPanels = new Set<number>();
  private lastPointer: Phaser.Math.Vector2 | null = null;
  private dustReturnProgress = 0;
  private boltProgress: number[] = [];
  private batteryShown = 0;
  private allClean = false;

  constructor() {
    super(SolarPanelsMinigame.KEY);
  }

  protected buildGame(area: Rect): void {
    this.shinyPanels.clear();
    this.lastPointer = null;
    this.dustReturnProgress = 0;
    this.batteryShown = 0;
    this.allClean = false;
    this.guide = new StepGuide(this, area, SOLAR_STEPS);
    const station = new SolarStation(
      this,
      area,
      this.guide.right,
      this.windowRect(),
      this.daylight,
    );
    const dust = this.placePanels(station);
    this.station = station;
    this.dust = dust;
    this.boltProgress = station.slots.map(() => 0);
    station.setLight(this.panelFractions());
    this.input.on('pointerdown', this.handleSwipe, this);
    this.input.on('pointermove', this.handleSwipe, this);
    this.input.on('pointerup', () => (this.lastPointer = null));
    this.pauseGame();
    const howTo = {
      titleKey: 'minigame.solar-panels.introTitle',
      startKey: 'minigame.solar-panels.start',
      steps: SOLAR_STEPS,
    } as const;
    showHowToCard(this, area, howTo, () => this.startPlaying(station));
  }

  /** Each panel is the clean sprite with Martian dust on top. */
  private placePanels(station: SolarStation): DustCover {
    const dust = new DustCover(this);
    station.slots.forEach(({ topLeft, scale }, index) => {
      addSprite(this, topLeft.x, topLeft.y, 'solarPanelClean').setOrigin(0).setScale(scale);
      dust.cover(topLeft, scale, index);
    });
    return dust;
  }

  /** After the how-to card: the game goes on and a ghost finger wipes across all the panels. */
  private startPlaying(station: SolarStation): void {
    this.resumeGame();
    this.warnIfNight(station);
    const first = station.slots[0];
    const last = station.slots[station.slots.length - 1];
    if (!first || !last) return;
    const y = first.topLeft.y + first.width / 2;
    showGestureHint(this, { x: first.foot.x, y }, { x: last.foot.x, y });
  }

  /** 1 at noon, down to `nightLight` at full night: the panels only get the light there is. */
  private get daylight(): number {
    return 1 - (1 - SOLAR_PANELS_BALANCE.nightLight) * this.nightAmount;
  }

  private windowRect(): Rect {
    const topLeft = this.roomPoint(WINDOW_GLASS.left, WINDOW_GLASS.top);
    const bottomRight = this.roomPoint(WINDOW_GLASS.right, WINDOW_GLASS.bottom);
    return {
      x: topLeft.x,
      y: topLeft.y,
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y,
    };
  }

  protected calculatePerformance(): number {
    return this.withSpeedBonus(this.dust?.cleanFraction() ?? 0);
  }

  protected updateGame(deltaMs: number): void {
    const seconds = deltaMs / 1000;
    this.letDustFall(seconds);
    this.sendBolts(seconds);
    const charge = this.dust?.cleanFraction() ?? 0;
    this.batteryShown += (charge - this.batteryShown) * Math.min(1, seconds * BATTERY_CATCH_UP);
    this.station?.setBatteryLevel(this.batteryShown);
  }

  private panelFractions(): number[] {
    const dust = this.dust;
    return this.station?.slots.map((_, index) => dust?.cleanFraction(index) ?? 0) ?? [];
  }

  /** On harsh locations a dust storm slowly covers the panels again. */
  private letDustFall(seconds: number): void {
    if (this.difficulty <= 1 || this.allClean || !this.dust) return;
    const perSecond = SOLAR_PANELS_BALANCE.dustReturnPerSecond * (this.difficulty - 1);
    this.dustReturnProgress += perSecond * seconds;
    let fell = false;
    while (this.dustReturnProgress >= 1) {
      this.dustReturnProgress -= 1;
      const panelIndex = this.dust.dropDust();
      if (panelIndex !== null) this.shinyPanels.delete(panelIndex);
      fell = true;
    }
    if (fell) this.station?.setLight(this.panelFractions());
  }

  /** Each panel makes energy as fast as it is clean: a dusty panel makes none. */
  private sendBolts(seconds: number): void {
    this.panelFractions().forEach((clean, index) => {
      const progress =
        (this.boltProgress[index] ?? 0) +
        clean * this.daylight * SOLAR_PANELS_BALANCE.boltsPerSecond * seconds;
      this.boltProgress[index] = progress >= 1 ? progress - 1 : progress;
      if (progress >= 1) this.station?.sendEnergy(index, () => this.guide?.show(3));
    });
  }

  /** Samples the whole finger path, so a fast swipe does not skip dust. */
  private handleSwipe(pointer: Phaser.Input.Pointer): void {
    if (!pointer.isDown || this.isFinished || !this.dust) return;
    const current = new Phaser.Math.Vector2(pointer.x, pointer.y);
    const from = this.lastPointer ?? current;
    const distance = Phaser.Math.Distance.BetweenPoints(from, current);
    const steps = Math.max(1, Math.ceil(distance / SWIPE_SAMPLE_STEP));
    const touched = new Set<number>();
    for (let step = 0; step <= steps; step += 1) {
      const point = from.clone().lerp(current, step / steps);
      this.dust.wipeAt(point.x, point.y).forEach((panelIndex) => touched.add(panelIndex));
    }
    this.lastPointer = current;
    if (touched.size === 0) return;
    this.guide?.show(2);
    this.station?.setLight(this.panelFractions());
    touched.forEach((panelIndex) => this.celebrateIfPanelClean(panelIndex));
    if (this.dust.cleanFraction() >= 1) this.finishSoon();
  }

  /** A sparkle and "+energy!" the first time each panel is spotless. */
  private celebrateIfPanelClean(panelIndex: number): void {
    const slot = this.station?.slots[panelIndex];
    if (!slot || this.shinyPanels.has(panelIndex)) return;
    if ((this.dust?.cleanFraction(panelIndex) ?? 0) < 1) return;
    this.shinyPanels.add(panelIndex);
    const centerY = slot.topLeft.y + slot.width / 2;
    sparkleAt(this, slot.foot.x, centerY, 'energyFlash');
    const message = t('minigame.solar-panels.panelClean');
    floatText(this, slot.foot.x, slot.topLeft.y - CLEAN_POP_OFFSET_Y, message, PALETTE.sun);
  }

  /** Late in the sol the light through the window is weak: the kid is told why. */
  private warnIfNight(station: SolarStation): void {
    const middle = station.slots[1];
    if (this.nightAmount < SOLAR_PANELS_BALANCE.nightWarning || !middle) return;
    const y = station.window.y + station.window.height;
    floatText(this, middle.foot.x, y, t('minigame.solar-panels.night'), PALETTE.white);
  }

  private finishSoon(): void {
    if (this.allClean) return;
    this.allClean = true;
    this.time.delayedCall(FINISH_DELAY_MS, () => this.finish());
  }
}
