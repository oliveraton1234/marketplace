import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, gradients, Icon, palette, Surface, Text } from '@/design-system';
import { formatMoney } from '@/shared/lib/format';

type FairPriceMeterProps = { price: number; min: number; max: number; myItemValue: number };

/** "Valor estimado" card: fair band and where this price sits in it. */
export function FairPriceMeter({ price, min, max, myItemValue }: FairPriceMeterProps) {
  // The visible track spans a wider range than the fair band, like the design.
  const lo = min - (max - min) * 0.75;
  const hi = max + (max - min) * 0.75;
  const pct = (v: number) => `${((v - lo) / (hi - lo)) * 100}%` as const;
  const fair = price >= min && price <= max;

  return (
    <Surface radius={22} style={styles.card}>
      <View style={styles.head}>
        <View style={styles.label}>
          <Icon name="sparkleSolo" size={18} color={palette.violetSoft} />
          <Text variant="calloutStrong" style={styles.bold}>
            Valor estimado
          </Text>
        </View>
        <Text variant="calloutStrong" color={fair ? colors.success : colors.danger} style={styles.bold}>
          {fair ? 'Precio justo' : 'Fuera de rango'}
        </Text>
      </View>
      <View
        style={styles.track}
        accessible
        accessibilityLabel={`Rango justo de ${formatMoney(min)} a ${formatMoney(max)}. Precio ${formatMoney(price)}`}>
        <View style={[styles.band, { left: pct(min), width: `${((max - min) / (hi - lo)) * 100}%` }]}>
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </View>
        <Animated.View entering={FadeIn.delay(300)} style={[styles.knob, { left: pct(price) }]} />
      </View>
      <View style={styles.scale}>
        <Text variant="footnote" color={colors.textTertiary}>
          {formatMoney(min)}
        </Text>
        <Text variant="footnote" color={colors.textTertiary}>
          Tu bici vale ~{formatMoney(myItemValue)}
        </Text>
        <Text variant="footnote" color={colors.textTertiary}>
          {formatMoney(max)}
        </Text>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bold: { fontFamily: 'DMSans_700Bold' },
  track: { height: 10, borderRadius: 5, backgroundColor: colors.primaryTint },
  band: { position: 'absolute', top: 0, bottom: 0, borderRadius: 5, overflow: 'hidden' },
  knob: {
    position: 'absolute',
    top: -5,
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: 10,
    backgroundColor: palette.white,
    borderWidth: 3,
    borderColor: palette.violet,
  },
  scale: { flexDirection: 'row', justifyContent: 'space-between' },
});
