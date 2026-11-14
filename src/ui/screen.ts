import Phaser from 'phaser';
import { t } from '../i18n';

/**
 * Asks for fullscreen + landscape. Must be called from a user tap (browser rule).
 * iPhone Safari does not support either; the rotate overlay covers that case.
 */
export function enterFullscreenLandscape(scene: Phaser.Scene): void {
  if (!scene.scale.isFullscreen) scene.scale.startFullscreen();

  const orientation = screen.orientation as ScreenOrientation & {
    lock?: (orientation: 'landscape') => Promise<void>;
  };
  orientation.lock?.('landscape').catch(() => {
    // Not supported on this device: the rotate overlay will guide the player.
  });
}

/** A DOM overlay (outside the canvas) shown only while the phone is in portrait. */
export function installRotateOverlay(): void {
  const overlay = document.createElement('div');
  overlay.id = 'rotate-overlay';
  overlay.innerHTML = `<div class="rotate-icon">📱↻</div><p></p>`;
  document.body.appendChild(overlay);
  refreshRotateOverlayText();
}

export function refreshRotateOverlayText(): void {
  const text = document.querySelector('#rotate-overlay p');
  if (text) text.textContent = t('orientation.rotate');
}
