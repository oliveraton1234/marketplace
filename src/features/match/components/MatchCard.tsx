import { StyleSheet, View } from 'react-native';

import { Avatar, Badge, colors, radii, shadows, Text } from '@/design-system';
import { ListingArtwork } from '@/features/catalog/components/ListingArtwork';
import type { Listing } from '@/features/catalog/domain/listing';
import { formatDistance, formatMoney } from '@/shared/lib/format';

import { MatchRing } from './MatchRing';

const focusByKind = { camera: { x: 0.3, y: 0.25 }, headphones: { x: 0.7, y: 0.25 }, guitar: { x: 0.4, y: 0.3 } } as const;

/** Full-bleed card shown in the Swap Match deck. */
export function MatchCard({ listing }: { listing: Listing }) {
  const value = formatMoney(listing.price ?? listing.fairRange.max - 200);
  return (
    <View style={[styles.card, shadows.soft]}>
      <ListingArtwork
        kind={listing.kind}
        iconSize={150}
        strokeWidth={1.1}
        radius={radii.hero}
        iconOffsetTop={40}
        focus={focusByKind[listing.kind as keyof typeof focusByKind]}
        label={`Foto de ${listing.title}`}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.ring}>
        <MatchRing score={listing.matchScore} />
      </View>
      <View style={styles.panel}>
        <View style={styles.titleRow}>
          <Text variant="title4" style={styles.title} numberOfLines={1}>
            {listing.title}
          </Text>
          <Text variant="subhead" color={colors.primaryInk} style={styles.price}>
            {value}
          </Text>
        </View>
        <View style={styles.owner}>
          <Avatar initials={listing.owner.initials} size={26} color={colors.primary} />
          <Text variant="callout" color={colors.textSecondary}>
            {listing.owner.name} · {formatDistance(listing.distanceKm)}
          </Text>
        </View>
        <Badge label={listing.interestNote} icon="swap" height={34} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radii.hero,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  ring: { position: 'absolute', right: 16, top: 16 },
  panel: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    padding: 16,
    gap: 10,
    borderRadius: 26,
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 24, lineHeight: 28 },
  price: { fontFamily: 'Rubik_700Bold' },
  owner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
