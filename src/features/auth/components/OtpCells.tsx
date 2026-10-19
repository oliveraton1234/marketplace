import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';

import { colors, radii, Text, durations } from '@/design-system';

function Caret() {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withSequence(withTiming(0, { duration: 450 }), withTiming(1, { duration: 450 })), -1);
  }, [opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.caret, style]} />;
}

/** Six code boxes; the active one glows violet with a blinking caret. */
export function OtpCells({ code, length }: { code: string; length: number }) {
  return (
    <View accessible accessibilityLabel={`Código de ${length} dígitos, ${code.length} escritos`} style={styles.row}>
      {Array.from({ length }, (_, i) => {
        const digit = code[i];
        const active = i === code.length;
        return (
          <View key={i} style={[styles.cell, active && styles.active]}>
            {digit ? (
              <Animated.View entering={FadeIn.duration(durations.fast)}>
                <Text variant="title3">{digit}</Text>
              </Animated.View>
            ) : (
              active && <Caret />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  cell: {
    flex: 1,
    height: 60,
    borderRadius: radii.lg - 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.primaryTintStrong, borderWidth: 2, borderColor: '#B58CFF' },
  caret: { width: 2, height: 26, backgroundColor: '#B58CFF' },
});
