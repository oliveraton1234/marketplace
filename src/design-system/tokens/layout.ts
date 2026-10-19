import type { ViewStyle } from 'react-native';

/** 4pt spacing scale. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  card: 26,
  sheet: 32,
  hero: 34,
  pill: 999,
} as const;

/** Horizontal gutter used by every screen. */
export const screenGutter = spacing.xl;

/** Minimum touch target (Apple HIG: 44pt). */
export const hitTarget = 44;

export const shadows = {
  soft: {
    shadowColor: '#3C2878',
    shadowOpacity: 0.14,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  glowViolet: {
    shadowColor: '#7B3FF2',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  glowSos: {
    shadowColor: '#E8326A',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
} satisfies Record<string, ViewStyle>;
