import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { colors, springs } from '../tokens';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export type SegmentedControlProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  height?: number;
  /** Compact = inline pill used in settings rows. */
  compact?: boolean;
};

/** Segmented picker with a sliding ink thumb. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  height = 40,
  compact,
}: SegmentedControlProps<T>) {
  const [widths, setWidths] = useState<number[]>([]);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const offset = widths.slice(0, index).reduce((sum, w) => sum + w + GAP, 0);
  const thumbWidth = widths[index] ?? 0;

  const thumbStyle = useAnimatedStyle(() => ({
    width: withSpring(thumbWidth, springs.snappy),
    transform: [{ translateX: withSpring(offset, springs.snappy) }],
  }));

  const onLayoutAt = (i: number) => (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidths((prev) => {
      if (prev[i] === w) return prev;
      const next = [...prev];
      next[i] = w;
      return next;
    });
  };

  return (
    <View accessibilityRole="tablist" accessibilityLabel={label} style={[styles.track, compact ? styles.compact : styles.full]}>
      <Animated.View style={[styles.thumb, { height, borderRadius: height / 2 }, thumbStyle]} />
      {options.map((option, i) => {
        const selected = option.value === value;
        return (
          <PressableScale
            key={option.value}
            haptic="selection"
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onLayout={onLayoutAt(i)}
            onPress={() => onChange(option.value)}
            style={[styles.segment, { height, borderRadius: height / 2 }, !compact && styles.segmentFull]}>
            <Text variant={compact ? 'footnoteBold' : 'calloutStrong'} color={selected ? colors.textInverse : colors.text}>
              {option.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const GAP = 4;

const styles = StyleSheet.create({
  track: { flexDirection: 'row', gap: GAP, padding: 4, borderRadius: 24, backgroundColor: colors.surface },
  full: { borderWidth: 1, borderColor: colors.border },
  compact: { padding: 3, gap: GAP, borderRadius: 18 },
  thumb: { position: 'absolute', left: 4, top: 4, backgroundColor: colors.text },
  segment: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  segmentFull: { flex: 1 },
});
