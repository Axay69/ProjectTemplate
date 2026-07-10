import { verticalScale, scale } from 'react-native-size-matters';

export const LAYOUT = {
  // Global Input Element Blueprints
  INPUT: {
    MIN_HEIGHT: verticalScale(48),
    PADDING_VERTICAL: verticalScale(8),
    PADDING_HORIZONTAL: scale(12),
  },

  // Navigation Structural Heights
  HEADER: {
    HEIGHT: verticalScale(56),
  },
  BOTTOM_TAB: {
    HEIGHT: verticalScale(60),
  },

  // Element Layout Rules
  BRANDING: {
    LOGO_ASPECT_RATIO: 1,
    LOGO_BASE_WIDTH: scale(120),
  },
} as const;

export type AppLayout = typeof LAYOUT;
