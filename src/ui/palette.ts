/**
 * The ONLY colors allowed in the game. See docs/STYLE_GUIDE.md.
 * Use the semantic names (COLORS.oxygen), not raw hex values, in scenes.
 */
export const PALETTE = {
  night: 0x1a1423,
  deepSpace: 0x2b2340,
  metalDark: 0x3d3a52,
  metal: 0x6b6f8a,
  metalLight: 0xb4b8cc,
  white: 0xf4f1e8,
  marsDark: 0x7a2e1f,
  mars: 0xc4532f,
  marsLight: 0xe88a4f,
  sand: 0xf2c288,
  sky: 0x5ec8e5,
  leaf: 0x6cc24a,
  sun: 0xf7d94c,
  alert: 0xe5484d,
  violet: 0x9b6bdf,
} as const;

export const COLORS = {
  background: PALETTE.night,
  panel: PALETTE.deepSpace,
  panelBorder: PALETTE.metal,
  text: PALETTE.white,
  textMuted: PALETTE.metalLight,
  oxygen: PALETTE.sky,
  food: PALETTE.leaf,
  shield: PALETTE.violet,
  energy: PALETTE.sun,
  danger: PALETTE.alert,
  player: PALETTE.violet,
  botRed: PALETTE.alert,
  botGreen: PALETTE.leaf,
  botYellow: PALETTE.sun,
} as const;

export function toCssColor(color: number): string {
  return `#${color.toString(16).padStart(6, '0')}`;
}
