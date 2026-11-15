import { INTRO_BALANCE } from '../../config/balance';

/**
 * Spec 19, scene 5 — The landing as a pure function of progress (0 → 1), so the scene only
 * draws and the whole sequence can be tuned here. Phases, as shares of the landing:
 *   entry   (0 – 0.25): orange heat over the window fades, the ship shakes a little;
 *   descent (0.2 – 0.88): the whole planet grows, turns into the photo of the place, the
 *                         warning light blinks and the shaking grows;
 *   rockets (0.72 – 0.9): dust covers the window for a moment;
 *   touchdown (0.88 – 0.94): one strong bump; then everything is still.
 */
export interface LandingFrame {
  globeZoom: number;
  globeAlpha: number;
  placeZoom: number;
  placeAlpha: number;
  heatAlpha: number;
  dustAlpha: number;
  warningAlpha: number;
  /** 0 = the cabin as usual, 1 = centered on the window. */
  cameraPull: number;
  cameraZoom: number;
  shakePx: number;
  altitudeM: number;
  done: boolean;
}

const ENTRY_END = 0.25;
const GLOBE_FADE = { from: 0.35, to: 0.55 } as const;
const DUST = { from: 0.72, peak: 0.8, to: 0.9 } as const;
const TOUCHDOWN = 0.88;
const BUMP_END = 0.94;
const MAX_HEAT_ALPHA = 0.65;
const MAX_DUST_ALPHA = 0.85;
const WARNING_ALPHA = 0.1;
const WARNING_BLINKS = 9;
const GLOBE_GROWTH = 2.2;
const PLACE_GROWTH = 1.6;
const SHAKE = { entry: 0.6, descentMax: 2.2, bump: 5 } as const;

export function describeLanding(progress: number): LandingFrame {
  const p = Math.min(Math.max(progress, 0), 1);
  const descent = smooth(ramp(p, 0, TOUCHDOWN));
  const globeShown = 1 - ramp(p, GLOBE_FADE.from, GLOBE_FADE.to);
  return {
    globeZoom: 1 + GLOBE_GROWTH * ramp(p, 0, GLOBE_FADE.to) ** 1.5,
    globeAlpha: globeShown,
    placeZoom: 1 + PLACE_GROWTH * smooth(ramp(p, GLOBE_FADE.from, TOUCHDOWN)),
    placeAlpha: 1 - globeShown,
    heatAlpha: MAX_HEAT_ALPHA * (1 - ramp(p, 0, ENTRY_END)),
    dustAlpha: MAX_DUST_ALPHA * bump(p, DUST.from, DUST.peak, DUST.to),
    warningAlpha:
      isDescending(p) && Math.sin(p * Math.PI * 2 * WARNING_BLINKS) > 0 ? WARNING_ALPHA : 0,
    cameraPull: descent,
    cameraZoom: 1 + (INTRO_BALANCE.landingCameraZoom - 1) * descent,
    shakePx: shakeAt(p),
    altitudeM: Math.round(INTRO_BALANCE.landingStartAltitudeM * (1 - ramp(p, 0, TOUCHDOWN)) ** 2),
    done: p >= 1,
  };
}

function shakeAt(p: number): number {
  if (p < ENTRY_END) return SHAKE.entry;
  if (p < TOUCHDOWN)
    return SHAKE.entry + (SHAKE.descentMax - SHAKE.entry) * ramp(p, ENTRY_END, TOUCHDOWN);
  return p < BUMP_END ? SHAKE.bump * (1 - ramp(p, TOUCHDOWN, BUMP_END)) : 0;
}

function isDescending(p: number): boolean {
  return p > ENTRY_END && p < TOUCHDOWN;
}

/** 0 before `from`, 1 after `to`, a straight line in between. */
function ramp(p: number, from: number, to: number): number {
  return Math.min(Math.max((p - from) / (to - from), 0), 1);
}

function smooth(value: number): number {
  return value * value * (3 - 2 * value);
}

/** Rises from 0 to 1 at `peak`, then falls back to 0. */
function bump(p: number, from: number, peak: number, to: number): number {
  return p < peak ? ramp(p, from, peak) : 1 - ramp(p, peak, to);
}
