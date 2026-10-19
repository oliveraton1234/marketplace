import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomOut, FadeIn } from 'react-native-reanimated';

import {
  Button,
  colors,
  Icon,
  IconButton,
  PressableScale,
  Reveal,
  Screen,
  ScreenHeader,
  SectionLabel,
  Skeleton,
  Surface,
  Text,
  durations,
} from '@/design-system';
import { ListingArtwork } from '@/features/catalog/components/ListingArtwork';
import { useListing } from '@/features/catalog/hooks/use-listings';
import { formatMoney } from '@/shared/lib/format';

import { BalanceMeter } from '../components/BalanceMeter';
import { computeOfferBalance } from '../domain/offer-balance';
import type { InventoryItem } from '../domain/trade';
import { useInventory, useSendOffer } from '../hooks/use-trades';

const CASH_STEP = 100;

function InventoryRow({ item, selected, onToggle }: { item: InventoryItem; selected: boolean; onToggle: () => void }) {
  return (
    <PressableScale
      haptic="selection"
      pressedScale={0.98}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${item.name}, vale aproximadamente ${formatMoney(item.value)}`}
      onPress={onToggle}>
      <Surface tone={selected ? 'violet' : 'glass'} radius={22} padding={10} style={styles.item}>
        <View style={[styles.tile, { backgroundColor: item.tile }]}>
          <Text variant="bodyBold" color={colors.surfaceSolid} style={styles.tileText}>
            {item.short}
          </Text>
        </View>
        <View style={styles.flex}>
          <Text variant="bodyBold">{item.name}</Text>
          <Text variant="footnote" color={colors.textSecondary}>
            Vale ~{formatMoney(item.value)}
          </Text>
        </View>
        <View style={[styles.check, selected && styles.checkOn]}>
          {selected && (
            <Animated.View entering={FadeIn.duration(durations.fast)} exiting={ZoomOut.duration(120)}>
              <Icon name="check" size={14} color={colors.text} strokeWidth={3.5} />
            </Animated.View>
          )}
        </View>
      </Surface>
    </PressableScale>
  );
}

export function OfferScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: listing } = useListing(id);
  const { data: inventory } = useInventory();
  const sendOffer = useSendOffer();
  const [selected, setSelected] = useState<string[]>(['bike']);
  const [cash, setCash] = useState(0);

  const target = listing?.price ?? listing?.fairRange.max ?? 0;
  const balance = useMemo(() => {
    const values = (inventory ?? []).filter((i) => selected.includes(i.id)).map((i) => i.value);
    return computeOfferBalance(values, cash, target);
  }, [inventory, selected, cash, target]);

  const toggle = (itemId: string) =>
    setSelected((current) => (current.includes(itemId) ? current.filter((x) => x !== itemId) : [...current, itemId]));

  const submit = () =>
    sendOffer.mutate(
      { listingId: id, itemIds: selected, cash },
      { onSuccess: ({ conversationId }) => router.replace({ pathname: '/chats/[id]', params: { id: conversationId } }) },
    );

  return (
    <Screen
      aurora={[
        { tint: 'violet', size: 420, right: -140, top: -140 },
        { tint: 'mint', size: 400, left: -160, bottom: 60, intensity: 0.32 },
      ]}
      gap={14}
      footer={
        <Button
          label={sendOffer.isPending ? 'Enviando…' : `Enviar oferta · ${formatMoney(balance.total)}`}
          trailingIcon="arrowRight"
          disabled={!listing || balance.total === 0 || sendOffer.isPending}
          onPress={submit}
        />
      }>
      <ScreenHeader title="Arma tu oferta" />

      <SectionLabel>Recibes</SectionLabel>
      {listing ? (
        <Reveal>
          <Surface radius={22} padding={10} style={styles.item}>
            <ListingArtwork kind={listing.kind} iconSize={26} strokeWidth={1.75} radius={16} style={styles.thumb} />
            <View style={styles.flex}>
              <Text variant="bodyBold">{listing.title}</Text>
              <Text variant="footnote" color={colors.textSecondary}>
                de {listing.owner.name}
              </Text>
            </View>
            <Text variant="subhead" style={styles.amount}>
              {formatMoney(target)}
            </Text>
          </Surface>
        </Reveal>
      ) : (
        <Skeleton height={76} radius={22} />
      )}

      <View style={styles.giveHead}>
        <SectionLabel>Das · toca para elegir</SectionLabel>
        <IconButton icon="swap" label="Intercambio" size={36} iconSize={18} variant="gradient" />
      </View>
      <View style={styles.list}>
        {(inventory ?? []).map((item, i) => (
          <Reveal key={item.id} index={i}>
            <InventoryRow item={item} selected={selected.includes(item.id)} onToggle={() => toggle(item.id)} />
          </Reveal>
        ))}
      </View>

      <Surface radius={22} padding={10} style={[styles.item, styles.cashRow]}>
        <View style={styles.flex}>
          <Text variant="bodyBold">Agregar efectivo</Text>
          <Text variant="footnote" color={colors.textSecondary}>
            Para equilibrar el cambio
          </Text>
        </View>
        <IconButton
          icon="minus"
          label={`Quitar ${CASH_STEP} pesos`}
          variant="tint"
          onPress={() => setCash((c) => Math.max(0, c - CASH_STEP))}
        />
        <Text variant="subhead" style={styles.cash} accessibilityLiveRegion="polite">
          {formatMoney(cash)}
        </Text>
        <IconButton
          icon="plus"
          label={`Agregar ${CASH_STEP} pesos`}
          variant="solid"
          onPress={() => setCash((c) => c + CASH_STEP)}
        />
      </Surface>

      <BalanceMeter balance={balance} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 54, height: 54 },
  amount: { fontFamily: 'Rubik_700Bold', paddingRight: 6 },
  giveHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { gap: 8 },
  tile: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tileText: { fontFamily: 'Rubik_600SemiBold' },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  cashRow: { paddingLeft: 16 },
  cash: { minWidth: 58, textAlign: 'center', fontFamily: 'Rubik_700Bold' },
});
