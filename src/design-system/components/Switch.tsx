import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptics } from '@/shared/lib/haptics';

import { colors, palette, springs } from '../tokens';

export type SwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label: string;
  tone?: 'violet' | 'mint';
  size?: 'md' | 'lg';
};

/** Animated toggle with proper `switch` semantics. */
export function Switch({ value, onValueChange, label, tone = 'violet', size = 'md' }: SwitchProps) {
  const width = size === 'lg' ? 56 : 52;
  const height = size === 'lg' ? 34 : 32;
  const knob = height - 6;
  const travel = width - knob - 6;
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, springs.snappy);
  }, [progress, value]);

  const onColor = tone === 'mint' ? palette.mint : palette.violet;
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.primaryTint, onColor]),
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * travel }],
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.text, palette.white]),
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={6}
      onPress={() => {
        haptics.selection();
        onValueChange(!value);
      }}>
      <Animated.View style={[styles.track, { width, height, borderRadius: height / 2 }, trackStyle]}>
        <Animated.View style={[{ width: knob, height: knob, borderRadius: knob / 2 }, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { padding: 3, justifyContent: 'center' },
});
