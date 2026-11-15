import { t } from '../i18n';
import { isMusicMuted, setMusicMuted } from './backgroundMusic';

/**
 * The sound on/off button, on every screen: a pixel speaker over the game (index.html), like the
 * fullscreen button, so no scene has to draw it. It mutes the music and the sound effects. The
 * choice lasts while the game is open.
 */
const PIXEL_SPEAKER = `
  <rect x="2" y="6" width="3" height="4" />
  <polygon points="5,6 9,3 9,13 5,10" />`;
const PIXEL_WAVES = `
  <rect x="11" y="6" width="1" height="4" />
  <rect x="12" y="5" width="1" height="1" /><rect x="12" y="10" width="1" height="1" />
  <rect x="13" y="4" width="1" height="1" /><rect x="13" y="11" width="1" height="1" />
  <rect x="14" y="5" width="1" height="6" />`;
const PIXEL_CROSS = `
  <path d="M10 5l5 6M15 5l-5 6" stroke="currentColor" stroke-width="2" fill="none" />`;

let isWired = false;

/** Shows the button and refreshes its label (also after a language change). */
export function setUpSoundButton(): void {
  const button = document.getElementById('sound-button');
  if (!button) return;
  if (!isWired) {
    isWired = true;
    button.addEventListener('click', () => {
      setMusicMuted(!isMusicMuted());
      render(button);
    });
  }
  render(button);
  button.hidden = false;
}

function render(button: HTMLElement): void {
  const muted = isMusicMuted();
  const drawing = PIXEL_SPEAKER + (muted ? PIXEL_CROSS : PIXEL_WAVES);
  button.innerHTML = `<svg viewBox="0 0 16 16" width="100%" height="100%" fill="currentColor" shape-rendering="crispEdges">${drawing}</svg>`;
  button.setAttribute('aria-label', t(muted ? 'sound.unmute' : 'sound.mute'));
  button.setAttribute('aria-pressed', String(muted));
}
