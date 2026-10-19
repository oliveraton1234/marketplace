import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { colors, durations } from '../tokens';

function Segment({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => ({
    backgroundColor: withTiming(active ? colors.primary : colors.primaryTint, { duration: durations.base }),
  }));
  return <Animated.View style={[styles.segment, style]} />;
}

/** "Paso n de m" progress dashes used by multi-step flows. */
export function StepIndicator({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <View accessible accessibilityLabel={`Paso ${step} de ${total}`} style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <Segment key={i} active={i < step} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  segment: { width: 28, height: 6, borderRadius: 3 },
});
