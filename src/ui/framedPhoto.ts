import type Phaser from 'phaser';
import { LOCATION_PHOTOS, photoTextureKey } from '../content/locationPhotos';
import { t } from '../i18n';
import { FONT_SIZE, type Rect } from './layout';
import { PALETTE } from './palette';
import { drawTechPanel } from './techFrame';
import { addText } from './text';

/**
 * Real NASA photos always go inside a frame, with their credit (AGENTS.md §5).
 * Used by the Mars map card (spec 12) and the rover trip (spec 15).
 * Until a location has its photo (spec 13), a pixel-art landscape stands in.
 */
export function drawFramedPhoto(
  scene: Phaser.Scene,
  locationId: string,
  rect: Rect,
): Phaser.GameObjects.GameObject[] {
  const frame = scene.add.graphics();
  drawTechPanel(frame, rect, PALETTE.metalLight, PALETTE.marsDark);
  const center = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  const photo = LOCATION_PHOTOS[locationId];
  if (photo && scene.textures.exists(photoTextureKey(locationId))) {
    const image = scene.add.image(center.x, center.y, photoTextureKey(locationId));
    image.setDisplaySize(rect.width - 8, rect.height - 8);
    const credit = addText(scene, center.x, rect.y + rect.height + 8, photo.credit, {
      size: FONT_SIZE.small,
      color: PALETTE.metalLight,
    });
    return [frame, image, credit];
  }
  frame.fillStyle(PALETTE.mars, 1);
  frame.fillRect(rect.x + 4, center.y, rect.width - 8, rect.height / 2 - 4);
  frame.fillStyle(PALETTE.marsLight, 1).fillCircle(center.x + 30, center.y + 6, 16);
  const pending = addText(scene, center.x, rect.y + 16, t('map.photoPending'), {
    size: FONT_SIZE.small,
    color: PALETTE.sand,
  });
  return [frame, pending];
}
