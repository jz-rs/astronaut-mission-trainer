import type Phaser from 'phaser';
import { t } from '../../../i18n';
import { FONT_SIZE, type Rect } from '../../../ui/layout';
import { PALETTE } from '../../../ui/palette';
import { drawVisorCorners } from '../../../ui/screenUi';
import { addText } from '../../../ui/text';

/**
 * Spec 16 — A real NASA photo on the tablet: cropped to fill its box, always framed by visor
 * corners and labelled as real (AGENTS.md §5), like the photos of the mission manual.
 */
const CORNER_MARGIN = 4;
const LABEL_GAP = 10;

export function drawPhoto(
  scene: Phaser.Scene,
  rect: Rect,
  texture: string,
  frameColor: number,
): Phaser.GameObjects.GameObject[] {
  const source = scene.textures.getFrame(texture);
  const scale = Math.max(rect.width / source.width, rect.height / source.height);
  const cropWidth = rect.width / scale;
  const cropHeight = rect.height / scale;
  const cropX = (source.width - cropWidth) / 2;
  const cropY = (source.height - cropHeight) / 2;
  const image = scene.add
    .image(rect.x - cropX * scale, rect.y - cropY * scale, texture)
    .setOrigin(0)
    .setScale(scale)
    .setCrop(cropX, cropY, cropWidth, cropHeight);
  const corners = scene.add.graphics();
  drawVisorCorners(
    corners,
    {
      x: rect.x - CORNER_MARGIN,
      y: rect.y - CORNER_MARGIN,
      width: rect.width + CORNER_MARGIN * 2,
      height: rect.height + CORNER_MARGIN * 2,
    },
    frameColor,
  );
  return [image, corners, drawRealPhotoLabel(scene, rect)];
}

/** "📷 Real NASA photo" under the picture, so kids can tell what is real. */
function drawRealPhotoLabel(scene: Phaser.Scene, rect: Rect): Phaser.GameObjects.Text {
  return addText(
    scene,
    rect.x + rect.width / 2,
    rect.y + rect.height + LABEL_GAP,
    t('photo.realNasa'),
    {
      size: FONT_SIZE.small,
      color: PALETTE.metalLight,
    },
  );
}
