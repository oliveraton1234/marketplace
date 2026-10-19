import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Badge, colors, PressableScale, radii, Text } from '@/design-system';
import { formatDistance, formatMoney } from '@/shared/lib/format';

import type { Listing } from '../domain/listing';
import { ListingArtwork } from './ListingArtwork';

export const LISTING_CARD_WIDTH = 168;

/** Compact listing tile used in horizontal rails ("Cerca de ti"). */
export function ListingCard({ listing }: { listing: Listing }) {
  const priceLabel = listing.price === null ? 'Solo cambio' : formatMoney(listing.price);
  return (
    <PressableScale
      pressedScale={0.97}
      accessibilityLabel={`${listing.title}, ${priceLabel}, a ${formatDistance(listing.distanceKm)}, ${listing.matchScore}% de coincidencia`}
      onPress={() => router.push({ pathname: '/listing/[id]', params: { id: listing.id } })}
      style={styles.card}>
      <ListingArtwork
        kind={listing.kind}
        style={styles.art}
        focus={listing.kind === 'headphones' ? { x: 0.7, y: 0.3 } : undefined}>
        <Badge label={`${listing.matchScore}% match`} tone="glass" height={24} style={styles.match} />
      </ListingArtwork>
      <View style={styles.body}>
        <Text variant="bodyStrong" numberOfLines={1}>
          {listing.title}
        </Text>
        <Text variant="footnote" color={colors.textSecondary}>
          <Text variant="footnoteBold">{priceLabel}</Text> · {formatDistance(listing.distanceKm)}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    width: LISTING_CARD_WIDTH,
    padding: 8,
    gap: 10,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  art: { height: 128 },
  match: { position: 'absolute', left: 8, top: 8 },
  body: { paddingHorizontal: 6, paddingBottom: 6, gap: 3 },
});
