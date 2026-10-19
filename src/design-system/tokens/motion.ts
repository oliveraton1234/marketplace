import { Easing } from 'react-native-reanimated';

/** Motion tokens shared by every animation in the app. Calm by design: no overshoot, no bounce. */
export const durations = {
  instant: 120,
  fast: 200,
  base: 280,
  slow: 420,
} as const;

export const easings = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  decelerate: Easing.bezier(0, 0, 0, 1),
} as const;

/** Critically damped springs: they settle without overshooting. */
export const springs = {
  press: { damping: 40, stiffness: 500, overshootClamping: true },
  gentle: { damping: 30, stiffness: 180, overshootClamping: true },
  snappy: { damping: 34, stiffness: 320, overshootClamping: true },
} as const;

/** Delay between items in a staggered entrance. */
export const staggerStep = 40;

/** Distance (pt) content rises while fading in. */
export const revealOffset = 8;
