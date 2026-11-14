import Phaser from 'phaser';
import { LOCATION_PHOTOS, photoTextureKey } from '../../content/locationPhotos';
import { LOCATIONS } from '../../content/locations';
import {
  countTotalStars,
  findNewUnlocks,
  isLocationUnlocked,
  starsMissing,
} from '../../core/progression';
import type { LocationConfig } from '../../core/types';
import { t } from '../../i18n';
import { loadProgress, saveProgress } from '../../services/progressStorage';
import { createButton } from '../../ui/Button';
import { FONT_SIZE, GAME_WIDTH, MARS_MAP_POINTS, MIN_TOUCH_SIZE } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { addStar } from '../../ui/star';
import { addScanlines, drawStarfield } from '../../ui/techFrame';
import { addText } from '../../ui/text';
import { SCENE_KEYS } from '../sceneKeys';
import { showLocationCard } from './LocationCard';
import { locationText } from './locationText';
import { drawMarsSurface } from './marsSurface';

/**
 * Spec 12 — Map of Mars with 5 real places. Each shows its stars and record, or a lock
 * with the stars still missing. The next place to play pulses so a kid knows what to tap.
 */
const MARKER_RADIUS = 9;
const MINI_STAR_SIZE = 12;
const PULSE_MS = 500;

export class MarsMapScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.map);
  }

  preload(): void {
    for (const [locationId, photo] of Object.entries(LOCATION_PHOTOS)) {
      if (photo) this.load.image(photoTextureKey(locationId), `assets/nasa/${photo.file}`);
    }
  }

  create(): void {
    drawStarfield(this, 60);
    drawMarsSurface(this);
    addText(this, GAME_WIDTH / 2, 26, t('map.title'), { color: PALETTE.sun });
    const progress = loadProgress();
    const totalStars = countTotalStars(progress.starsByLocation);
    const next = LOCATIONS.find(
      (location) =>
        isLocationUnlocked(location, totalStars) && !progress.starsByLocation[location.id],
    );
    for (const location of LOCATIONS) {
      this.drawLocation(location, totalStars, location === next);
    }
    this.createBackButton();
    this.celebrateNewUnlocks(totalStars);
    addScanlines(this);
  }

  private drawLocation(location: LocationConfig, totalStars: number, isNext: boolean): void {
    const point = MARS_MAP_POINTS[location.id];
    if (!point) return;
    const unlocked = isLocationUnlocked(location, totalStars);
    const marker = this.add.graphics({ x: point.x, y: point.y });
    marker.fillStyle(unlocked ? PALETTE.cyan : PALETTE.metal, 1).fillCircle(0, 0, MARKER_RADIUS);
    marker.lineStyle(2, PALETTE.white, 1).strokeCircle(0, 0, MARKER_RADIUS);
    if (isNext) {
      this.tweens.add({ targets: marker, scale: 1.5, yoyo: true, repeat: -1, duration: PULSE_MS });
    }
    addText(this, point.x, point.y + 18, locationText(location.id, 'name'), {
      size: FONT_SIZE.small,
    });
    if (unlocked) this.drawLocationStars(location.id, point.x, point.y + 32);
    else this.drawLock(location, totalStars, point.x, point.y + 32);
    const zone = this.add.zone(point.x, point.y + 12, MIN_TOUCH_SIZE * 2, MIN_TOUCH_SIZE);
    zone.setInteractive({ useHandCursor: unlocked });
    if (unlocked) zone.on('pointerup', () => this.openCard(location));
  }

  private drawLocationStars(locationId: string, x: number, y: number): void {
    const progress = loadProgress();
    const earned = progress.starsByLocation[locationId] ?? 0;
    for (let index = 0; index < 3; index += 1) {
      addStar(this, x + (index - 1) * 14, y, MINI_STAR_SIZE, index < earned);
    }
    const best = progress.bestScoreByLocation[locationId];
    if (best) {
      addText(this, x, y + 13, t('map.best', { score: best }), {
        size: FONT_SIZE.small,
        color: PALETTE.sand,
      });
    }
  }

  private drawLock(location: LocationConfig, totalStars: number, x: number, y: number): void {
    const missing = starsMissing(location, totalStars);
    addText(this, x, y, `${t('map.locked', { stars: missing })}⭐`, {
      size: FONT_SIZE.small,
      color: PALETTE.metalLight,
    });
  }

  private openCard(location: LocationConfig): void {
    showLocationCard(this, location, () =>
      this.scene.start(SCENE_KEYS.base, { locationId: location.id }),
    );
  }

  /** A small party for every place that opened since the last visit. */
  private celebrateNewUnlocks(totalStars: number): void {
    const progress = loadProgress();
    const newUnlocks = findNewUnlocks(LOCATIONS, totalStars, progress.celebratedUnlocks);
    if (newUnlocks.length === 0) return;
    saveProgress({
      ...progress,
      celebratedUnlocks: [...progress.celebratedUnlocks, ...newUnlocks.map(({ id }) => id)],
    });
    const banner = addText(this, GAME_WIDTH / 2, 50, `🎉 ${t('map.newPlace')}`, {
      color: PALETTE.green,
    });
    this.tweens.add({ targets: banner, scale: 1.2, yoyo: true, repeat: 3, duration: 300 });
    for (const location of newUnlocks) this.burstAt(location.id);
  }

  private burstAt(locationId: string): void {
    const point = MARS_MAP_POINTS[locationId];
    if (!point) return;
    const ring = this.add.graphics({ x: point.x, y: point.y });
    ring.lineStyle(3, PALETTE.sun, 1).strokeCircle(0, 0, MARKER_RADIUS);
    this.tweens.add({ targets: ring, scale: 5, alpha: 0, duration: 900, repeat: 2 });
  }

  private createBackButton(): void {
    createButton(this, {
      x: 72,
      y: 334,
      width: 112,
      height: 40,
      label: t('result.menu'),
      fontSize: FONT_SIZE.small,
      color: PALETTE.metalLight,
      onPress: () => this.scene.start(SCENE_KEYS.menu),
    });
  }
}
