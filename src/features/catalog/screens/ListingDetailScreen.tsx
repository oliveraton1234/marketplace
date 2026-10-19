import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Share, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar,
  Button,
  colors,
  GlassDock,
  Icon,
  IconButton,
  palette,
  PressableScale,
  radii,
  Reveal,
  SectionLabel,
  Skeleton,
  Text,
} from '@/design-system';
import { formatDistance, formatMoney } from '@/shared/lib/format';

import { FairPriceMeter } from '../components/FairPriceMeter';
import { ListingArtwork } from '../components/ListingArtwork';
import { myOfferedItemValue } from '../data/listings.mock';
import { useListing } from '../hooks/use-listings';
import { goBack } from '@/shared/lib/navigation';

const HERO_HEIGHT = 380;

function PageDots({ count, active }: { count: number; active: number }) {
  return (
    <View style={styles.dots} accessibilityLabel={`Foto ${active + 1} de ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
      ))}
    </View>
  );
}

function SaveButton() {
  const [saved, setSaved] = useState(true);
  return (
    <IconButton
      icon={saved ? 'heartFilled' : 'heart'}
      label={saved ? 'Quitar de guardados' : 'Guardar'}
      color={colors.danger}
      iconSize={20}
      variant="glass"
      onPress={() => setSaved((s) => !s)}
    />
  );
}

export function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { data: listing } = useListing(id);
  const [page, setPage] = useState(0);

  if (!listing) {
    return (
      <View style={styles.root}>
        <Skeleton height={HERO_HEIGHT} radius={0} />
        <View style={styles.loadingBody}>
          <Skeleton height={28} width="60%" />
          <Skeleton height={96} radius={22} />
        </View>
      </View>
    );
  }

  const myItemMatches = (want: string) => /bici/i.test(want);

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}>
          {Array.from({ length: listing.photos }, (_, i) => (
            <ListingArtwork
              key={i}
              kind={listing.kind}
              iconSize={170}
              strokeWidth={1}
              radius={0}
              focus={{ x: 0.3 + i * 0.2, y: 0.3 }}
              label={`Foto ${i + 1} de ${listing.title}`}
              style={[styles.hero, { width }]}
            />
          ))}
        </ScrollView>

        <View style={styles.sheet}>
          <Reveal style={styles.titleRow}>
            <View style={styles.titles}>
              <Text variant="title3" accessibilityRole="header">
                {listing.title}
              </Text>
              <Text variant="callout" color={colors.textSecondary}>
                {listing.description}
              </Text>
            </View>
            <Text variant="title4" style={styles.price}>
              {listing.price === null ? 'Cambio' : formatMoney(listing.price)}
            </Text>
          </Reveal>

          <Reveal index={1}>
            <FairPriceMeter
              price={listing.price ?? listing.fairRange.min}
              min={listing.fairRange.min}
              max={listing.fairRange.max}
              myItemValue={myOfferedItemValue}
            />
          </Reveal>

          <Reveal index={2}>
            <PressableScale pressedScale={0.98} accessibilityLabel={`Perfil de ${listing.owner.name}`} style={styles.owner}>
              <Avatar initials={listing.owner.initials} size={46} ring="brand" />
              <View style={styles.flex}>
                <View style={styles.ownerName}>
                  <Text variant="bodyBold">{listing.owner.name}</Text>
                  {listing.owner.verified && <Icon name="verified" size={16} color={colors.accent} label="Verificada" />}
                </View>
                <Text variant="footnote" color={colors.textSecondary}>
                  {listing.owner.rating} · {listing.owner.responseTime ?? 'responde rápido'} ·{' '}
                  {formatDistance(listing.distanceKm)}
                </Text>
              </View>
            </PressableScale>
          </Reveal>

          <Reveal index={3} style={styles.wants}>
            <SectionLabel>Le interesa</SectionLabel>
            <View style={styles.tags}>
              {listing.wants.map((want) => {
                const match = myItemMatches(want);
                return (
                  <View key={want} style={[styles.tag, match && styles.tagMatch]}>
                    {match && <Icon name="check" size={14} color={colors.success} strokeWidth={3} />}
                    <Text variant={match ? 'footnoteBold' : 'footnote'} color={match ? colors.success : colors.text}>
                      {match ? `${want} · tienes una` : want}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Reveal>
        </View>
      </ScrollView>

      <View style={[styles.topBar, { top: insets.top + 12 }]} pointerEvents="box-none">
        <IconButton icon="chevronLeft" label="Regresar" onPress={() => goBack()} />
        <View style={styles.topActions}>
          <IconButton
            icon="share"
            label="Compartir"
            iconSize={20}
            onPress={() => Share.share({ message: `Mira ${listing.title} en SwapIt` })}
          />
          <SaveButton />
        </View>
      </View>
      <View style={[styles.dotsWrap, { top: HERO_HEIGHT - 54 }]} pointerEvents="none">
        <PageDots count={listing.photos} active={page} />
      </View>

      <GlassDock style={[styles.dock, { bottom: insets.bottom + 16 }]}>
        <View style={styles.dockRow}>
          <Button label="Comprar" variant="secondary" size="md" style={styles.flex} onPress={() => router.push('/payments')} />
          <Button
            label="Proponer cambio"
            variant="gradient"
            size="md"
            leadingIcon="swap"
            style={styles.flex}
            onPress={() => router.push({ pathname: '/offer/[id]', params: { id: listing.id } })}
          />
        </View>
      </GlassDock>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  loadingBody: { padding: 20, gap: 16 },
  hero: { height: HERO_HEIGHT },
  sheet: {
    marginTop: -40,
    paddingTop: 24,
    paddingHorizontal: 20,
    gap: 18,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderColor: colors.border,
    minHeight: 520,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  titles: { flex: 1, gap: 6 },
  price: { fontFamily: 'Rubik_700Bold', fontSize: 24 },
  owner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ownerName: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  wants: { gap: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryTint,
  },
  tagMatch: { backgroundColor: 'rgba(111,227,184,0.14)' },
  topBar: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  topActions: { flexDirection: 'row', gap: 8 },
  dotsWrap: { position: 'absolute', left: 20 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(13,11,20,0.14)' },
  dotActive: { width: 22, backgroundColor: colors.primary },
  dock: { position: 'absolute', left: 16, right: 16, padding: 8 },
  dockRow: { flexDirection: 'row', gap: 8 },
});
