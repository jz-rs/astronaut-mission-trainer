import { t } from '../i18n';
import { cssColor, PALETTE } from './palette';

/**
 * Phone helpers: fullscreen + landscape lock where the browser allows it,
 * and the "rotate your phone" overlay (needed on iPhone, which cannot lock).
 * Fullscreen has two paths: Android & co. use the browser API (plus a corner button to get it
 * back after leaving it); iPhone does not allow it in ANY browser, only when the game is opened
 * from the home screen, so there we show a hint explaining how to add it.
 */
interface LockableOrientation {
  lock?: (orientation: 'landscape') => Promise<void>;
}

/** Safari exposes "opened from the home screen" with this non-standard flag. */
interface HomeScreenNavigator {
  standalone?: boolean;
}

/** Once closed, the hint stays closed until the page is reloaded. */
let isHomeScreenHintClosed = false;
let arePhoneControlsWired = false;

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
  setThemeColor(cssColor(PALETTE.night));
  const overlay = document.getElementById('rotate-overlay');
  if (overlay) {
    overlay.style.background = cssColor(PALETTE.night);
    overlay.style.color = cssColor(PALETTE.white);
  }
  for (const id of ['fullscreen-button', 'home-screen-hint']) {
    const element = document.getElementById(id);
    if (!element) continue;
    element.style.background = cssColor(PALETTE.night);
    element.style.color = cssColor(PALETTE.cyan);
    element.style.borderColor = cssColor(PALETTE.cyan);
  }
}

/** Called at start and every time the language changes. */
export function updateRotateMessage(): void {
  const message = document.getElementById('rotate-message');
  if (message) message.textContent = t('orientation.rotate');
}

/**
 * Wires the fullscreen button and the home-screen hint (only the first time) and refreshes
 * their texts, so it is also called again after a language change.
 */
export function setUpPhoneControls(): void {
  const fullscreenButton = document.getElementById('fullscreen-button');
  const hintText = document.getElementById('home-screen-hint-text');
  const hintClose = document.getElementById('home-screen-hint-close');
  fullscreenButton?.setAttribute('aria-label', t('phone.fullscreen'));
  hintClose?.setAttribute('aria-label', t('phone.closeHint'));
  if (hintText) hintText.textContent = t('phone.homeScreenHint');
  if (arePhoneControlsWired) return;
  arePhoneControlsWired = true;
  fullscreenButton?.addEventListener('click', () => void enterFullscreenLandscape());
  hintClose?.addEventListener('click', closeHomeScreenHint);
  document.addEventListener('fullscreenchange', refreshFullscreenButton);
  refreshFullscreenButton();
}

/** The hint only makes sense on the start screen: the menu shows it and hides it when leaving. */
export function showHomeScreenHint(isVisible: boolean): void {
  const hint = document.getElementById('home-screen-hint');
  if (hint) hint.hidden = !isVisible || isHomeScreenHintClosed || !needsHomeScreenHint();
}

/** The button is only offered while it can do something: supported and not already fullscreen. */
function refreshFullscreenButton(): void {
  const button = document.getElementById('fullscreen-button');
  if (!button) return;
  const canGoFullscreen = isTouchDevice() && document.fullscreenEnabled;
  button.hidden = !canGoFullscreen || document.fullscreenElement !== null;
}

/** A phone that cannot use the fullscreen API (iPhone) and was not opened from the home screen. */
function needsHomeScreenHint(): boolean {
  return isTouchDevice() && !document.fullscreenEnabled && !isOpenedFromHomeScreen();
}

function isOpenedFromHomeScreen(): boolean {
  const isSafariHomeScreenApp = (navigator as HomeScreenNavigator).standalone === true;
  return isSafariHomeScreenApp || window.matchMedia('(display-mode: standalone)').matches;
}

function closeHomeScreenHint(): void {
  isHomeScreenHintClosed = true;
  showHomeScreenHint(false);
}

/** Browser bar color on Android; set here so the color comes from the palette. */
function setThemeColor(color: string): void {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.append(meta);
  }
  meta.content = color;
}
