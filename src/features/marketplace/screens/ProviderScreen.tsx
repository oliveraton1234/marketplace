import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar,
  Badge,
  Button,
  colors,
  GlassDock,
  Icon,
  IconButton,
  ListGroup,
  ListRow,
  Reveal,
  Screen,
  ScreenHeader,
  SectionLabel,
  Skeleton,
  StatTile,
  Surface,
  Text,
} from '@/design-system';
import { formatDistance, formatMoney } from '@/shared/lib/format';

import { useHireProvider, useProvider } from '../hooks/use-marketplace';

export function ProviderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: provider } = useProvider(id);
  const hire = useHireProvider();
  const [saved, setSaved] = useState(false);

  const hireNow = () =>
    provider &&
    hire.mutate(
      { providerId: provider.id, serviceId: provider.services[0]?.id ?? '' },
      { onSuccess: ({ jobId }) => router.replace({ pathname: '/tracking/[id]', params: { id: jobId } }) },
    );

  return (
    <View style={styles.root}>
      <Screen
        aurora={[
          { tint: 'mint', size: 440, left: -100, top: -170 },
          { tint: 'violet', size: 360, right: -140, top: -60 },
        ]}
        gap={16}
        bottomInset={90}>
        <ScreenHeader
          trailing={
            <IconButton
              icon={saved ? 'heartFilled' : 'heart'}
              color={saved ? colors.danger : colors.text}
              label={saved ? 'Quitar de guardados' : 'Guardar proveedor'}
              iconSize={20}
              onPress={() => setSaved((s) => !s)}
            />
          }
        />
        {!provider ? (
          <Skeleton height={300} radius={24} />
        ) : (
          <>
            <Reveal style={styles.identity}>
              <Avatar initials={provider.initials} size={80} color={provider.avatarColor} ring="mint" gap={3} />
              <View style={styles.identityText}>
                <View style={styles.nameRow}>
                  <Text variant="title4" style={styles.name} accessibilityRole="header">
                    {provider.name}
                  </Text>
                  {provider.verified && <Icon name="verified" size={18} color={colors.accent} label="Verificado" />}
                </View>
                <Text variant="callout" color={colors.textSecondary}>
                  {provider.trade} · {provider.experience}
                </Text>
                {provider.available && <Badge label="Disponible ahora" dot />}
              </View>
            </Reveal>

            <Reveal index={1} style={styles.stats}>
              <StatTile value={String(provider.rating)} label={`${provider.reviewsCount} reseñas`} />
              <StatTile value={`${provider.onTimeRate}%`} label="llega a tiempo" />
              <StatTile value={formatDistance(provider.distanceKm)} label="de ti" />
            </Reveal>

            <SectionLabel>Servicios</SectionLabel>
            <Reveal index={2}>
              <ListGroup>
                {provider.services.map((s) => (
                  <ListRow
                    key={s.id}
                    title={s.name}
                    height={50}
                    trailing={
                      <Text variant="bodyBold" style={styles.price}>
                        {s.price}
                      </Text>
                    }
                  />
                ))}
              </ListGroup>
            </Reveal>

            <Reveal index={3}>
              <Surface radius={22} padding={14} style={styles.review}>
                <View style={styles.reviewHead}>
                  <Avatar
                    initials={provider.featuredReview.author.initials}
                    size={28}
                    color={provider.featuredReview.author.avatarColor}
                  />
                  <Text variant="calloutStrong" style={styles.bold}>
                    {provider.featuredReview.author.name}
                  </Text>
                  <View style={styles.stars} accessible accessibilityLabel={`${provider.featuredReview.stars} estrellas`}>
                    {Array.from({ length: provider.featuredReview.stars }, (_, i) => (
                      <Icon key={i} name="star" size={13} color={colors.primaryInk} />
                    ))}
                  </View>
                </View>
                <Text variant="callout" color={colors.textSecondary} style={styles.quote}>
                  “{provider.featuredReview.text}”
                </Text>
              </Surface>
            </Reveal>
          </>
        )}
      </Screen>

      <GlassDock style={[styles.dock, { bottom: insets.bottom + 16 }]}>
        <View style={styles.dockRow}>
          <IconButton
            icon="message"
            label="Enviar mensaje"
            size={54}
            variant="glass"
            onPress={() => router.push({ pathname: '/chats/[id]', params: { id: 'c-joseluis' } })}
          />
          <Button
            label={hire.isPending ? 'Agendando…' : `Contratar ahora · ${formatMoney(provider?.hireFrom ?? 0)}`}
            variant="gradient"
            size="md"
            style={styles.flex}
            disabled={!provider || hire.isPending}
            onPress={hireNow}
          />
        </View>
      </GlassDock>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  bold: { fontFamily: 'DMSans_700Bold' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: -8 },
  identityText: { flex: 1, gap: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 24, lineHeight: 28 },
  stats: { flexDirection: 'row', gap: 8 },
  price: { fontFamily: 'Rubik_700Bold' },
  review: { gap: 8 },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stars: { flexDirection: 'row', gap: 1 },
  quote: { lineHeight: 20 },
  dock: { position: 'absolute', left: 16, right: 16, padding: 8 },
  dockRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
