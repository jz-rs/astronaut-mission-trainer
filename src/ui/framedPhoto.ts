import type Phaser from 'phaser';
import { LOCATION_PHOTOS, photoTextureKey } from '../content/locationPhotos';
import { t } from '../i18n';
import { FONT_SIZE, type Rect } from './layout';
import { PALETTE } from './palette';
import { NASA_MONITOR_FRAME, NASA_MONITOR_SCREEN } from './sprites';
import { addText } from './text';

/**
 * Real NASA photos always go inside a frame, labelled "📷 Real NASA photo" so kids can tell
 * what is real (GDD §12). Each photo's credit is in locationPhotos.ts and docs/DATA_SOURCES.md.
 * The frame is the monitor of the kit's console (`ui/marco-foto-nasa.png`), fitted inside `rect`;
 * the photo shows through its transparent screen.
 * Used by the Mars map card (spec 12) and the rover trip (spec 15).
 * Until a location has its photo (spec 13), a pixel-art landscape stands in.
 */
export function drawFramedPhoto(
  scene: Phaser.Scene,
  locationId: string,
  rect: Rect,
): Phaser.GameObjects.GameObject[] {
  const monitor = scene.textures.getFrame('nasaPhotoFrame', NASA_MONITOR_FRAME);
  const scale = Math.min(rect.width / monitor.width, rect.height / monitor.height);
  const left = rect.x + (rect.width - monitor.width * scale) / 2;
  const top = rect.y + (rect.height - monitor.height * scale) / 2;
  const addFrame = () =>
    scene.add.image(left, top, 'nasaPhotoFrame', NASA_MONITOR_FRAME).setOrigin(0).setScale(scale);
  const screen: Rect = {
    x: left + NASA_MONITOR_SCREEN.x * scale,
    y: top + NASA_MONITOR_SCREEN.y * scale,
    width: NASA_MONITOR_SCREEN.width * scale,
    height: NASA_MONITOR_SCREEN.height * scale,
  };
  const photo = LOCATION_PHOTOS[locationId];
  if (photo && scene.textures.exists(photoTextureKey(locationId))) {
    const image = scene.add.image(screen.x, screen.y, photoTextureKey(locationId));
    image.setOrigin(0).setDisplaySize(screen.width, screen.height);
    const frame = addFrame();
    const label = addText(
      scene,
      rect.x + rect.width / 2,
      rect.y + rect.height + 8,
      t('photo.realNasa'),
      {
        size: FONT_SIZE.small,
        color: PALETTE.sand,
      },
    );
    return [image, frame, label];
  }
  return drawPendingPhoto(scene, screen, addFrame);
}

/** A tiny Mars landscape on the screen, until the real photo arrives. */
function drawPendingPhoto(
  scene: Phaser.Scene,
  screen: Rect,
  addFrame: () => Phaser.GameObjects.Image,
): Phaser.GameObjects.GameObject[] {
  const landscape = scene.add.graphics();
  landscape
    .fillStyle(PALETTE.marsDark, 1)
    .fillRect(screen.x, screen.y, screen.width, screen.height);
  landscape.fillStyle(PALETTE.mars, 1);
  landscape.fillRect(screen.x, screen.y + screen.height / 2, screen.width, screen.height / 2);
  const frame = addFrame();
  const pending = addText(
    scene,
    screen.x + screen.width / 2,
    screen.y + screen.height / 4,
    t('map.photoPending'),
    { size: FONT_SIZE.small, color: PALETTE.sand, wrapWidth: screen.width },
  );
  return [landscape, frame, pending];
}
