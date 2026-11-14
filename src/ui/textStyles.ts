import { COLORS, toCssColor } from './palette';
import { FONT_FAMILY, FONT_SIZES } from './layout';

type FontSize = keyof typeof FONT_SIZES;

export function textStyle(size: FontSize = 'normal', color: number = COLORS.text) {
  return {
    fontFamily: FONT_FAMILY,
    fontSize: FONT_SIZES[size],
    color: toCssColor(color),
    align: 'center',
  };
}
