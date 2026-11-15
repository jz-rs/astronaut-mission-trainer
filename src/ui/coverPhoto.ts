import type Phaser from 'phaser';
import type { Rect } from './layout';

/**
 * Fits a photo like CSS "cover": it always fills the whole window or screen, cropping what sticks
 * out, so there are never borders around it. `zoom` above 1 moves closer to the photo;
 * `focusY` picks which part stays in view when it is cropped (0 top, 0.5 middle, 1 bottom).
 */
export function addCoverPhoto(
  scene: Phaser.Scene,
  textureKey: string,
  rect: Rect,
  zoom = 1,
  focusY = 0.5,
): Phaser.GameObjects.Image {
  const image = scene.add.image(0, 0, textureKey).setOrigin(0);
  return setCoverPhoto(image, rect, zoom, focusY);
}

export function setCoverPhoto(
  image: Phaser.GameObjects.Image,
  rect: Rect,
  zoom = 1,
  focusY = 0.5,
): Phaser.GameObjects.Image {
  const { width, height } = image.frame;
  const scale = Math.max(rect.width / width, rect.height / height) * Math.max(zoom, 1);
  const cropWidth = rect.width / scale;
  const cropHeight = rect.height / scale;
  const cropX = (width - cropWidth) / 2;
  const cropY = (height - cropHeight) * focusY;
  return image
    .setScale(scale)
    .setCrop(cropX, cropY, cropWidth, cropHeight)
    .setPosition(rect.x - cropX * scale, rect.y - cropY * scale);
}
