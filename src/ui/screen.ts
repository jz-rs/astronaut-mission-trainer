import { t } from '../i18n';
import { cssColor, PALETTE } from './palette';

/**
 * Phone helpers: fullscreen + landscape lock where the browser allows it,
 * and the "rotate your phone" overlay (needed on iPhone, which cannot lock).
 */
interface LockableOrientation {
  lock?: (orientation: 'landscape') => Promise<void>;
}

export function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/** Must be called from a tap: browsers only allow fullscreen after a user gesture. */
export async function enterFullscreenLandscape(): Promise<void> {
  if (!isTouchDevice()) return;
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
    await (screen.orientation as LockableOrientation).lock?.('landscape');
  } catch {
    // Not supported (iPhone): the rotate overlay covers it.
  }
}

export function applyPageColors(): void {
  document.body.style.background = cssColor(PALETTE.night);
  const overlay = document.getElementById('rotate-overlay');
  if (!overlay) return;
  overlay.style.background = cssColor(PALETTE.night);
  overlay.style.color = cssColor(PALETTE.white);
}

/** Called at start and every time the language changes. */
export function updateRotateMessage(): void {
  const message = document.getElementById('rotate-message');
  if (message) message.textContent = t('orientation.rotate');
}
