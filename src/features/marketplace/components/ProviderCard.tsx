import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { colors, Icon, palette, PressableScale, radii, Text } from '@/design-system';
import { formatDistance, formatMoney } from '@/shared/lib/format';

import type { Provider } from '../domain/provider';

function Tag({ label, tone, icon }: { label: string; tone: 'violet' | 'mint' | 'outline'; icon?: 'shield' }) {
  return (
    <View style={[styles.tag, tagStyles[tone]]}>
      {icon && <Icon name={icon} size={13} color={colors.primaryInk} strokeWidth={2.5} />}
      <Text variant="footnoteBold" color={tone === 'mint' ? colors.success : colors.primaryInk}>
        {label}
      </Text>
    </View>
  );
}

/** Provider row for the services directory. */
export function ProviderCard({ provider }: { provider: Provider }) {
  const meta = `${provider.trade} · ${provider.reviewsCount} reseñas · ${formatDistance(provider.distanceKm)}`;
  return (
    <PressableScale
      pressedScale={0.99}
      accessibilityLabel={`${provider.name}, ${meta}, calificación ${provider.rating}${provider.availableToday ? ', disponible hoy' : ''}, desde ${formatMoney(provider.hireFrom)}`}
      onPress={() => router.push({ pathname: '/provider/[id]', params: { id: provider.id } })}
      style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: provider.avatarColor }]}>
        <Text variant="subhead" color={palette.white}>
          {provider.initials}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="bodyBold" style={styles.name} numberOfLines={1}>
            {provider.name}
          </Text>
          <View style={styles.rating}>
            <Icon name="star" size={14} color={palette.violet} />
            <Text variant="bodyBold">{provider.rating}</Text>
          </View>
        </View>
        <Text variant="footnote" color={colors.textSecondary} numberOfLines={1}>
          {meta}
        </Text>
        <View style={styles.tags}>
          {provider.verified && <Tag label="Verificado" tone="violet" icon="shield" />}
          {provider.availableToday && <Tag label="Disponible hoy" tone="mint" />}
          <Tag label={`Desde ${formatMoney(provider.hireFrom)}`} tone="outline" />
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1, fontSize: 16 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tag: { height: 28, paddingHorizontal: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 5 },
});

const tagStyles = StyleSheet.create({
  violet: { backgroundColor: colors.primaryTint },
  mint: { backgroundColor: colors.accentTint },
  outline: { borderWidth: 1, borderColor: 'rgba(123,63,242,0.25)' },
});
