import { StyleSheet, View } from 'react-native';

import { colors, LogoMark, Skeleton, Text } from '@/design-system';

/** "Cargando" state from the design: shapes of the rail + a branded hint. */
export function NearbySkeleton() {
  return (
    <View accessible accessibilityLabel="Buscando cosas cerca de ti" accessibilityState={{ busy: true }} style={styles.wrap}>
      <View style={styles.row}>
        {[0, 1].map((i) => (
          <View key={i} style={styles.card}>
            <Skeleton height={140} radius={22} />
            <Skeleton width={i ? 110 : 120} height={12} radius={6} tone="violet" />
            <Skeleton width={i ? 70 : 80} height={12} radius={6} />
          </View>
        ))}
      </View>
      <View style={styles.hint}>
        <LogoMark size={22} tone="aurora" withTails={false} />
        <Text variant="calloutStrong" color={colors.textSecondary}>
          Buscando cosas cerca de ti…
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 20 },
  row: { flexDirection: 'row', gap: 12 },
  card: { width: 168, gap: 10 },
  hint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
});
