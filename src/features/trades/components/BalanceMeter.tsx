import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { colors, palette, springs, Surface, Text } from '@/design-system';
import { formatMoney } from '@/shared/lib/format';

import type { OfferBalance } from '../domain/offer-balance';

const statusCopy = (b: OfferBalance) =>
  b.status === 'short'
    ? { label: `Te faltan ${formatMoney(-b.diff)}`, color: colors.danger }
    : b.status === 'over'
      ? { label: `Das ${formatMoney(b.diff)} de más`, color: colors.primaryInk }
      : { label: 'Cambio justo', color: colors.success };

/** Live fairness meter: the knob springs toward balance as the offer changes. */
export function BalanceMeter({ balance }: { balance: OfferBalance }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const position = useSharedValue(balance.position);

  useEffect(() => {
    position.value = withSpring(balance.position, springs.gentle);
  }, [balance.position, position]);

  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: position.value * trackWidth - 12 }] }));
  const copy = statusCopy(balance);

  return (
    <Surface style={styles.card}>
      <View style={styles.head}>
        <Text variant="bodyBold">Balance del cambio</Text>
        <Text variant="calloutStrong" color={copy.color} style={styles.bold} accessibilityLiveRegion="polite">
          {copy.label}
        </Text>
      </View>
      <View
        style={styles.track}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Balance del cambio"
        accessibilityValue={{ text: copy.label }}>
        <LinearGradient
          colors={['rgba(255,143,216,0.55)', 'rgba(111,227,184,0.9)', 'rgba(181,140,255,0.55)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
        />
        <View style={styles.center} />
        <Animated.View style={[styles.knob, knob]} />
      </View>
      <View style={styles.scale}>
        {['Das menos', 'Justo', 'Das más'].map((label) => (
          <Text key={label} variant="footnote" color={colors.textTertiary}>
            {label}
          </Text>
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  head: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  bold: { fontFamily: 'DMSans_700Bold' },
  track: { height: 12, justifyContent: 'center' },
  gradient: { borderRadius: 6 },
  center: {
    position: 'absolute',
    left: '50%',
    marginLeft: -1,
    top: -4,
    width: 2,
    height: 20,
    backgroundColor: colors.borderStrong,
  },
  knob: {
    position: 'absolute',
    left: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.white,
    borderWidth: 4,
    borderColor: colors.background,
    shadowColor: palette.ink,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  scale: { flexDirection: 'row', justifyContent: 'space-between' },
});
