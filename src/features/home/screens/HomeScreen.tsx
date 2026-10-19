import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  auroraPresets,
  Avatar,
  Badge,
  Chip,
  colors,
  CountBubble,
  GradientText,
  Icon,
  IconButton,
  PressableScale,
  Reveal,
  Screen,
  screenGutter,
  Text,
} from '@/design-system';
import { ListingCard } from '@/features/catalog/components/ListingCard';
import { NearbySkeleton } from '@/features/catalog/components/HomeSkeleton';
import { categoryLabels, type ListingFilter } from '@/features/catalog/domain/listing';
import { useNearbyListings } from '@/features/catalog/hooks/use-listings';
import { ProviderMiniCard, SeeAllServicesCard } from '@/features/marketplace/components/ProviderMiniCard';
import { useProviders } from '@/features/marketplace/hooks/use-marketplace';
import { MatchHeroCard } from '@/features/match/components/MatchHeroCard';
import { TAB_BAR_SPACE } from '@/features/navigation/FloatingTabBar';
import { useMe } from '@/features/users/hooks/use-me';
import { useCurrentPlace } from '@/shared/device/location';
import { greetingFor } from '@/shared/lib/format';

type Category = NonNullable<ListingFilter['category']>;
const categories: Category[] = ['for_you', 'tech', 'services', 'home', 'music'];

function Header() {
  const { data: me } = useMe();
  const { data: place } = useCurrentPlace();
  const neighborhood = place?.neighborhood ?? me?.neighborhood;
  const city = place?.city ?? me?.city;
  return (
    <View style={styles.header}>
      <View style={styles.greeting}>
        <Text variant="callout" color={colors.textSecondary}>
          {greetingFor(new Date())}, {me?.firstName ?? '…'}
        </Text>
        <View style={styles.location}>
          <Icon name="pin" size={14} color={colors.accent} strokeWidth={2.25} />
          <Text variant="footnoteBold" numberOfLines={1} style={styles.locationText}>
            {neighborhood ? `${neighborhood}, ${city}` : ' '}
          </Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <IconButton
          icon="message"
          label="Mensajes, 3 sin leer"
          size={46}
          iconSize={20}
          onPress={() => router.push('/chats')}
          badge={<CountBubble count={3} style={styles.bubble} />}
        />
        <PressableScale accessibilityLabel="Tu perfil" onPress={() => router.push('/profile')}>
          <Avatar initials={me?.initials ?? 'DH'} size={46} ring="brand">
            <View style={styles.online} />
          </Avatar>
        </PressableScale>
      </View>
    </View>
  );
}

export function HomeScreen() {
  const [category, setCategory] = useState<Category>('for_you');
  const showServices = category === 'services';
  const nearby = useNearbyListings({ category });
  const providers = useProviders({});

  return (
    <Screen aurora={auroraPresets.home} gap={18} bottomInset={TAB_BAR_SPACE}>
      <Reveal>
        <Header />
      </Reveal>

      <Reveal index={1}>
        <Text variant="title1" accessibilityRole="header">
          Encuentra tu próximo
        </Text>
        <GradientText variant="title1">cambio</GradientText>
      </Reveal>

      <Reveal index={2}>
        <PressableScale
          pressedScale={0.98}
          accessibilityLabel="Buscar: ¿Qué me dan por mi bici?"
          onPress={() => router.push('/search')}
          style={styles.search}>
          <Icon name="sparkle" size={20} color={colors.primary} />
          <Text variant="body" color={colors.textSecondary} style={styles.flex}>
            ¿Qué me dan por mi bici?
          </Text>
          <View style={styles.mic}>
            <Icon name="mic" size={18} color={colors.textInverse} strokeWidth={2.25} />
          </View>
        </PressableScale>
      </Reveal>

      <Reveal index={3}>
        <MatchHeroCard interested={12} offering="bici" />
      </Reveal>

      <Reveal index={4}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.rail}>
          {categories.map((c) => (
            <Chip key={c} label={categoryLabels[c]} selected={c === category} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>
      </Reveal>

      <Reveal index={5} style={styles.sectionHead}>
        <View style={styles.sectionTitle}>
          <Text variant="headline" accessibilityRole="header">
            {showServices ? 'Servicios cerca' : 'Cerca de ti'}
          </Text>
          <Badge label="en vivo" dot height={22} />
        </View>
        <PressableScale
          accessibilityLabel={showServices ? 'Ver todos los servicios' : 'Ver todo'}
          onPress={() => router.push(showServices ? '/services' : '/search')}
          hitSlop={10}>
          <Text variant="calloutStrong" color={colors.primaryInk}>
            {showServices ? 'Ver todos' : 'Ver todo'}
          </Text>
        </PressableScale>
      </Reveal>

      <Reveal index={6}>
        {showServices ? (
          providers.isPending ? (
            <NearbySkeleton />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.bleed}
              contentContainerStyle={styles.cards}>
              {providers.data?.map((p) => (
                <ProviderMiniCard key={p.id} provider={p} />
              ))}
              <SeeAllServicesCard />
            </ScrollView>
          )
        ) : nearby.isPending ? (
          <NearbySkeleton />
        ) : nearby.data?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.cards}>
            {nearby.data.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </ScrollView>
        ) : (
          <PressableScale onPress={() => router.push('/search')} style={styles.empty}>
            <Text variant="callout" color={colors.textSecondary}>
              Nada por aquí todavía. Toca para buscar en otra zona.
            </Text>
          </PressableScale>
        )}
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  greeting: { flex: 1, minWidth: 0, gap: 2 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { flexShrink: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  bubble: { position: 'absolute', top: -2, right: -2 },
  online: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.background,
  },
  search: {
    height: 56,
    borderRadius: 28,
    paddingLeft: 18,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mic: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' },
  bleed: { marginHorizontal: -screenGutter },
  rail: { gap: 8, paddingHorizontal: screenGutter },
  cards: { gap: 12, paddingHorizontal: screenGutter },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  empty: { padding: 20, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
});
