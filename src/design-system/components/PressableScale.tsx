import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { haptics } from '@/shared/lib/haptics';

import { durations, easings } from '../tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Scale reached while pressed (default 0.98). */
  pressedScale?: number;
  haptic?: 'tap' | 'selection' | 'impact' | 'none';
};

/**
 * Base interactive primitive: springy press feedback + haptics.
 * Every tappable surface in the design system builds on it.
 */
export function PressableScale({
  pressedScale = 0.98,
  haptic = 'tap',
  onPressIn,
  onPressOut,
  onPress,
  style,
  disabled,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPressIn={(e) => {
        scale.set(withTiming(pressedScale, { duration: durations.instant, easing: easings.standard }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: durations.fast, easing: easings.standard }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic !== 'none') haptics[haptic]();
        onPress?.(e);
      }}
      style={[style, animatedStyle, disabled && { opacity: 0.5 }]}
      {...rest}
    />
  );
}
