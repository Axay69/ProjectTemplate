import { ms } from 'react-native-size-matters';

// Scalable font-size tokens (moderate scaling)
export const fontSizes = {
  xs: ms(12),
  sm: ms(13),
  md: ms(14),
  lg: ms(16),
  xl: ms(18),
  xxl: ms(22),
  xxxl: ms(28),
};

export const getLineHeight = (size: number, multiplier = 1.35) =>
  Math.round(size * multiplier);

const createVariant = (size: number, lineHeightMultiplier = 1.35) => ({
  fontSize: ms(size),
  lineHeight: getLineHeight(ms(size), lineHeightMultiplier),
});

// Ready-to-use text variants
export const textVariants = {
  font_9: createVariant(9),
  font_10: createVariant(10),
  font_11: createVariant(11),
  font_12: createVariant(12),
  font_13: createVariant(13),
  font_14: createVariant(14),
  font_15: createVariant(15),
  font_16: createVariant(16),
  font_17: createVariant(17),
  font_18: createVariant(18),
  font_19: createVariant(19),
  font_20: createVariant(20),
  font_21: createVariant(21),
  font_22: createVariant(22),
  font_23: createVariant(23),
  font_24: createVariant(24),
  font_25: createVariant(25),
  font_26: createVariant(26),
  font_27: createVariant(27),
  font_28: createVariant(28),
} as const;

export type TextVariant = keyof typeof textVariants;
