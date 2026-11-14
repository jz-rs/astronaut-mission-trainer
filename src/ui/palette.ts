import type { StatId } from '../core/types';

/**
 * Every color in the game. Values are the proposed palette in docs/STYLE_GUIDE.md;
 * they get updated here (and only here) when the team votes the final art style.
 */
export const PALETTE = {
  night: 0x1a1423,
  space: 0x2b2340,
  metalDark: 0x3d3a52,
  metal: 0x6b6f8a,
  metalLight: 0xb4b8cc,
  white: 0xf4f1e8,
  marsDark: 0x7a2e1f,
  mars: 0xc4532f,
  marsLight: 0xe88a4f,
  sand: 0xf2c288,
  cyan: 0x5ec8e5,
  green: 0x6cc24a,
  sun: 0xf7d94c,
  alert: 0xe5484d,
  violet: 0x9b6bdf,
} as const;

/** Each survival bar always uses the same color (STYLE_GUIDE: "color con significado"). */
export const STAT_COLORS: Record<StatId, number> = {
  oxygen: PALETTE.cyan,
  food: PALETTE.green,
  shield: PALETTE.violet,
  energy: PALETTE.sun,
};

/** Visor color of each crew member: violet is always the player. */
export const CREW_COLORS: Record<string, number> = {
  player: PALETTE.violet,
  'bot-red': PALETTE.alert,
  'bot-green': PALETTE.green,
  'bot-yellow': PALETTE.sun,
};

/** Glow used on screens, frames and LED strips: retro pixel art, current-day technology. */
export const TECH_GLOW = PALETTE.cyan;

/** Phaser texts and the DOM need colors as CSS strings. */
export function cssColor(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}
