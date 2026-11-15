import Phaser from 'phaser';
import { LOCATION_PHOTOS, photoTextureKey } from '../../content/locationPhotos';
import { t, type TranslationKey } from '../../i18n';
import { drawFramedPhoto } from '../../ui/framedPhoto';
import { FONT_SIZE, MINIGAME_AREA, type Rect } from '../../ui/layout';
import { PALETTE } from '../../ui/palette';
import { drawTechPanel } from '../../ui/techFrame';
import { addText } from '../../ui/text';
import { addContinueButton } from '../resultCard';
import type { StorageResult } from './SampleStorage';

/**
 * Spec 15 + Mission 5 — The prize of a rover trip: the real place on Mars, framed, how many
 * samples came back, how many tubes were sealed (and ruined), and one real fact about Perseverance's tubes.
 * It stays (with the base paused by the scene) until the kid taps GO ON.
 */
const DEPTH = 100;
const PHOTO: Rect = { x: MINIGAME_AREA.x + 30, y: MINIGAME_AREA.y + 24, width: 172, height: 120 };
const TEXT_X = PHOTO.x + PHOTO.width + 150;
const TEXT_WIDTH = 260;

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
  /** Below the top of the photo. */
  offsetY: number;
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
  drawTechPanel(scene.add.graphics().setDepth(DEPTH), MINIGAME_AREA, PALETTE.sun, PALETTE.space);
  scene.add.container(0, 0, drawFramedPhoto(scene, locationId, PHOTO)).setDepth(DEPTH);
  for (const line of resultLines(locationId, samples, tubes)) {
    const style = { size: line.size, color: line.color, wrapWidth: TEXT_WIDTH };
    addText(scene, TEXT_X, PHOTO.y + line.offsetY, line.text, style).setDepth(DEPTH);
  }
  addContinueButton(scene, onContinue);
}

function resultLines(locationId: string, samples: number, tubes: StorageResult): ResultLine[] {
  const small = FONT_SIZE.small;
  const lines: ResultLine[] = [
    {
      text: t('rover.samples', { samples }),
      offsetY: 10,
      color: PALETTE.sun,
      size: FONT_SIZE.medium,
    },
  ];
  const sealed = t('rover.tubesSealed', { sealed: tubes.sealed });
  lines.push({ text: sealed, offsetY: 32, color: PALETTE.cyan, size: small });
  if (tubes.contaminated > 0) {
    const lost = t('rover.tubesLost', { count: tubes.contaminated });
    lines.push({ text: lost, offsetY: 46, color: PALETTE.alert, size: small });
  }
  const why = `location.${locationId}.why` as TranslationKey;
  lines.push({ text: t(why), offsetY: 68, color: PALETTE.white, size: small });
  lines.push({ text: t('rover.fact'), offsetY: 106, color: PALETTE.cyan, size: small });
  return lines;
}
