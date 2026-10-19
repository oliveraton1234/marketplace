import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { easings } from '../tokens';

type SkeletonProps = {
  width?: DimensionValue;
  height: number;
  radius?: number;
  tone?: 'soft' | 'violet';
  style?: StyleProp<ViewStyle>;
};

/** Breathing placeholder block for loading states. */
export function Skeleton({ width = '100%', height, radius = 10, tone = 'soft', style }: SkeletonProps) {
  const pulse = useSharedValue(0.55);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 900, easing: easings.standard }), -1, true);
  }, [pulse]);

  const animated = useAnimatedStyle(() => ({ opacity: pulse.value }));
  const backgroundColor = tone === 'violet' ? 'rgba(123,63,242,0.22)' : 'rgba(91,61,180,0.10)';

  return <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor }, animated, style]} />;
}
