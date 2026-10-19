import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { ReduceMotion, withDelay, withTiming, type EntryAnimationsValues } from 'react-native-reanimated';

import { durations, easings, revealOffset, staggerStep } from '../tokens';

type RevealProps = {
  children: ReactNode;
  /** Position in a staggered sequence (0-based). */
  index?: number;
  /** `fade` skips the rise (hero art, centered content). */
  from?: 'below' | 'fade';
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Entrance choreography: a short fade with a subtle rise, staggered.
 * Honors the system "Reduce Motion" setting automatically.
 */
export function Reveal({ children, index = 0, from = 'below', delay = 0, style }: RevealProps) {
  const wait = delay + index * staggerStep;
  const offset = from === 'below' ? revealOffset : 0;

  const entering = (_values: EntryAnimationsValues) => {
    'worklet';
    const timing = { duration: durations.slow, easing: easings.decelerate, reduceMotion: ReduceMotion.System };
    return {
      initialValues: { opacity: 0, transform: [{ translateY: offset }] },
      animations: {
        opacity: withDelay(wait, withTiming(1, timing)),
        transform: [{ translateY: withDelay(wait, withTiming(0, timing)) }],
      },
    };
  };

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
