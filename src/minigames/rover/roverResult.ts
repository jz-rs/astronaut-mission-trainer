import Phaser from 'phaser';
import { LOCATION_PHOTOS, photoTextureKey } from '../../content/locationPhotos';
import { t, type TranslationKey } from '../../i18n';
import { drawFramedPhoto } from '../../ui/framedPhoto';
import { FONT_SIZE, TABLET_SCREEN, type Rect } from '../../ui/layout';
import { MissionTablet } from '../../ui/MissionTablet';
import { PALETTE } from '../../ui/palette';
import { addGlowText } from '../../ui/screenUi';
import { addContinueButton, RESULT_DEPTH } from '../resultCard';
import type { StorageResult } from './SampleStorage';

/**
 * Spec 15 + Mission 5 — The prize of a rover trip, on the mission tablet: the real place on Mars,
 * framed, how many samples came back, how many tubes were sealed (and ruined), and one real fact
 * about Perseverance's tubes. It stays (with the base paused by the scene) until the kid taps GO ON.
 */
const PHOTO: Rect = { x: TABLET_SCREEN.x + 16, y: TABLET_SCREEN.y + 18, width: 180, height: 124 };
const COLUMN = { x: PHOTO.x + PHOTO.width + 18, y: PHOTO.y + 4, width: 232, gap: 8 };

/**
 * The cabin loads every place's photo, but the trip must not depend on it: if this place's photo
 * is missing (the base was reached another way), the trip loads it, so the result never shows
 * "Real photo: soon".
 */
export function loadRoverPhoto(load: Phaser.Loader.LoaderPlugin, locationId: string): void {
  const photo = LOCATION_PHOTOS[locationId];
  const key = photoTextureKey(locationId);
  if (!photo || load.textureManager.exists(key)) return;
  load.image(key, `assets/nasa/${photo.file}`);
  load.once(Phaser.Loader.Events.COMPLETE, () =>
    load.textureManager.get(key).setFilter(Phaser.Textures.FilterMode.LINEAR),
  );
}

interface ResultLine {
  text: string;
  color: number;
  size: number;
}

export function showRoverResult(
  scene: Phaser.Scene,
  locationId: string,
  samples: number,
  tubes: StorageResult,
  onContinue: () => void,
): void {
  const tablet = new MissionTablet(scene, RESULT_DEPTH);
  const photo = drawFramedPhoto(scene, locationId, PHOTO);
  tablet.show([...photo, ...drawColumn(scene, resultLines(locationId, samples, tubes))], 'right');
  addContinueButton(scene, tablet, onContinue);
}

/** The lines go one under the other, so a longer line never runs into the next one. */
function drawColumn(scene: Phaser.Scene, lines: ResultLine[]): Phaser.GameObjects.Text[] {
  let y = COLUMN.y;
  return lines.map((line) => {
    const style = { size: line.size, color: line.color, wrapWidth: COLUMN.width };
    const text = addGlowText(scene, COLUMN.x, y, line.text, style);
    text.setOrigin(0).setAlign('left');
    y += text.height + COLUMN.gap;
    return text;
  });
}

function resultLines(locationId: string, samples: number, tubes: StorageResult): ResultLine[] {
  const small = FONT_SIZE.small;
  const lines: ResultLine[] = [
    { text: t('rover.samples', { samples }), color: PALETTE.sun, size: FONT_SIZE.medium },
    { text: t('rover.tubesSealed', { sealed: tubes.sealed }), color: PALETTE.cyan, size: small },
  ];
  if (tubes.contaminated > 0) {
    const lost = t('rover.tubesLost', { count: tubes.contaminated });
    lines.push({ text: lost, color: PALETTE.alert, size: small });
  }
  const why = `location.${locationId}.why` as TranslationKey;
  lines.push({ text: t(why), color: PALETTE.white, size: small });
  lines.push({ text: t('rover.fact'), color: PALETTE.cyan, size: small });
  return lines;
}
