import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Aurora,
  auroraPresets,
  Badge,
  colors,
  gradients,
  Icon,
  IconButton,
  palette,
  PressableScale,
  Reveal,
  ScreenHeader,
  shadows,
  Skeleton,
  Text,
} from '@/design-system';
import { useNearbyListings } from '@/features/catalog/hooks/use-listings';
import { TAB_BAR_SPACE } from '@/features/navigation/FloatingTabBar';
import { haptics } from '@/shared/lib/haptics';

import { SwipeDeck, type SwipeDeckHandle, type SwipeDirection } from '../components/SwipeDeck';

const INTERESTED = 12;

export function MatchScreen() {
  const insets = useSafeAreaInsets();
  const deck = useNearbyListings({ category: 'for_you' });
  const deckRef = useRef<SwipeDeckHandle>(null);
  const [cursor, setCursor] = useState(0);

  const items = deck.data ?? [];
  const current = items.length ? items[cursor % items.length] : undefined;
  const remaining = INTERESTED - (cursor % INTERESTED);

  const onSwiped = (direction: SwipeDirection) => {
    if (!current) return;
    if (direction === 'right') {
      haptics.success();
      router.push({ pathname: '/offer/[id]', params: { id: current.id } });
    } else {
      haptics.tap();
    }
    setCursor((c) => c + 1);
  };

  return (
    <View style={styles.root}>
      <Aurora blobs={auroraPresets.center} />
      <View style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: TAB_BAR_SPACE + insets.bottom + 8 }]}>
        <ScreenHeader
          onLeadingPress={() => router.navigate('/home')}
          center={<Text variant="subhead">Swap Match</Text>}
          trailing={<Badge label={`${remaining} más`} height={32} />}
        />

        <PressableScale accessibilityLabel="Cambiar lo que ofreces. Ofreciendo: tu bici urbana" style={styles.offering}>
          <View style={styles.offeringIcon}>
            <Icon name="bike" size={16} color={palette.white} />
          </View>
          <Text variant="calloutStrong">Ofreciendo: tu bici urbana</Text>
          <Icon name="chevronDown" size={16} strokeWidth={2.25} />
        </PressableScale>

        <View style={styles.deckArea}>
          {current ? (
            <SwipeDeck ref={deckRef} current={current} position={cursor} onSwiped={onSwiped} />
          ) : (
            <Skeleton height={470} radius={34} />
          )}
        </View>

        <Reveal index={2} style={styles.actions}>
          <IconButton icon="close" label="Pasar" size={64} iconSize={26} onPress={() => deckRef.current?.swipe('left')} />
          <IconButton
            icon="info"
            label="Ver detalles"
            size={52}
            color={colors.primaryInk}
            onPress={() => current && router.push({ pathname: '/listing/[id]', params: { id: current.id } })}
          />
          <PressableScale
            accessibilityLabel="Quiero cambiar"
            haptic="impact"
            onPress={() => deckRef.current?.swipe('right')}
            style={[shadows.glowViolet, styles.wantShape]}>
            <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.want}>
              <Icon name="swap" size={30} color={palette.white} strokeWidth={2.5} />
            </LinearGradient>
          </PressableScale>
        </Reveal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, paddingHorizontal: 20, gap: 16 },
  offering: {
    alignSelf: 'center',
    height: 44,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offeringIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.forestDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckArea: { flex: 1, maxHeight: 470 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  want: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  wantShape: { borderRadius: 38 },
});
