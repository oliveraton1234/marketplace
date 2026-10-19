import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Badge, colors, Icon, palette, PressableScale, radii, Text } from '@/design-system';
import { formatDistance, formatMoney } from '@/shared/lib/format';

import type { Provider } from '../domain/provider';

export const PROVIDER_MINI_WIDTH = 168;

/** Compact provider tile for horizontal rails; opens the services page filtered by that trade. */
export function ProviderMiniCard({ provider }: { provider: Provider }) {
  return (
    <PressableScale
      pressedScale={0.98}
      accessibilityLabel={`${provider.name}, ${provider.trade}, ${provider.rating} estrellas, a ${formatDistance(provider.distanceKm)}. Ver servicios de ${provider.trade.toLowerCase()}`}
      onPress={() => router.push({ pathname: '/services', params: { category: provider.category } })}
      style={styles.card}>
      <View style={styles.top}>
        <View style={[styles.avatar, { backgroundColor: provider.avatarColor }]}>
          <Text variant="bodyBold" color={palette.white}>
            {provider.initials}
          </Text>
        </View>
        <View style={styles.rating}>
          <Icon name="star" size={13} color={palette.violet} />
          <Text variant="footnoteBold">{provider.rating}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {provider.name}
        </Text>
        <Text variant="footnote" color={colors.textSecondary} numberOfLines={1}>
          {provider.trade} · {formatDistance(provider.distanceKm)}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text variant="footnoteBold" color={colors.primaryInk}>
          Desde {formatMoney(provider.hireFrom)}
        </Text>
        {provider.availableToday && <Badge label="Hoy" dot height={22} />}
      </View>
    </PressableScale>
  );
}

/** Last tile of the rail: jump to the full services directory. */
export function SeeAllServicesCard() {
  return (
    <PressableScale
      accessibilityLabel="Ver todos los servicios"
      onPress={() => router.push('/services')}
      style={[styles.card, styles.more]}>
      <View style={styles.moreIcon}>
        <Icon name="arrowRight" size={20} color={palette.white} strokeWidth={2.25} />
      </View>
      <Text variant="bodyBold" align="center">
        Ver todos los servicios
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    width: PROVIDER_MINI_WIDTH,
    padding: 14,
    gap: 12,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  body: { gap: 2 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  more: { alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderColor: palette.violetSoft },
  moreIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
