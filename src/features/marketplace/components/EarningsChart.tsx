import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, palette, Text, durations } from '@/design-system';
import { formatMoney } from '@/shared/lib/format';

const MAX_BAR = 76;

/** Weekly earnings bars; the best day is highlighted with the brand gradient. */
export function EarningsChart({ days, best }: { days: { day: string; amount: number }[]; best: number }) {
  const peak = Math.max(...days.map((d) => d.amount), 1);
  return (
    <View
      style={styles.chart}
      accessible
      accessibilityLabel={`Ganancias por día. Mejor día: ${days[best]?.day}, ${formatMoney(days[best]?.amount ?? 0)}`}>
      {days.map((d, i) => {
        const height = Math.max(12, (d.amount / peak) * MAX_BAR);
        const isBest = i === best;
        return (
          <View key={`${d.day}-${i}`} style={styles.col}>
            <Animated.View entering={FadeIn.delay(i * 40).duration(durations.slow)} style={[styles.bar, { height }]}>
              {isBest ? (
                <LinearGradient colors={[palette.mint, palette.violet]} style={StyleSheet.absoluteFill} />
              ) : (
                <View
                  style={[StyleSheet.absoluteFill, { backgroundColor: d.amount ? 'rgba(181,140,255,0.45)' : colors.primaryTint }]}
                />
              )}
            </Animated.View>
            <Text
              variant={isBest ? 'captionBold' : 'caption'}
              color={isBest ? colors.text : colors.textTertiary}
              style={styles.label}>
              {d.day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { height: 96, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  col: { flex: 1, alignItems: 'center', gap: 6 },
  bar: { width: '100%', borderRadius: 8, overflow: 'hidden' },
  label: { fontSize: 11 },
});
