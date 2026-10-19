import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  auroraPresets,
  Avatar,
  Badge,
  colors,
  Icon,
  palette,
  Reveal,
  Screen,
  ScreenHeader,
  SectionLabel,
  SegmentedControl,
  Skeleton,
  Surface,
  Text,
} from '@/design-system';
import { listingArt } from '@/features/catalog/ui/listing-art';

import type { Trade, TradeStage } from '../domain/trade';
import { useTradesOverview } from '../hooks/use-trades';

type Tab = 'active' | 'published' | 'history';
const stageOrder: TradeStage[] = ['offer', 'accepted', 'meeting', 'done'];
const stageLabels = ['Oferta', 'Aceptada', 'Encuentro', 'Listo'];

function TradeCard({ trade }: { trade: Trade }) {
  const reached = stageOrder.indexOf(trade.stage);
  const art = listingArt[trade.kind];
  return (
    <Surface
      radius={26}
      padding={14}
      style={styles.trade}
      onPress={() => router.push('/safety')}
      accessibilityLabel={`${trade.title} con ${trade.counterpart.name}, ${trade.when}`}>
      <View style={styles.row}>
        <View style={[styles.tile, { backgroundColor: art.tile }]}>
          <Icon name={art.icon} size={24} color={palette.white} strokeWidth={1.75} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyBold">{trade.title}</Text>
          <Text variant="footnote" color={colors.textSecondary}>
            con {trade.counterpart.name} · {trade.place}
          </Text>
        </View>
        <Badge label={trade.when} height={28} />
      </View>
      <View style={styles.progress}>
        {stageOrder.map((s, i) => (
          <View key={s} style={[styles.segment, i <= reached && styles.segmentOn]} />
        ))}
      </View>
      <View style={styles.stageLabels}>
        {stageLabels.map((label) => (
          <Text key={label} variant="caption" color={colors.textTertiary}>
            {label}
          </Text>
        ))}
      </View>
    </Surface>
  );
}

export function TradesScreen() {
  const [tab, setTab] = useState<Tab>('active');
  const { data } = useTradesOverview();
  const activeCount = data ? data.active.length + data.services.length + data.published.length : 0;

  return (
    <Screen aurora={auroraPresets.center} gap={14}>
      <ScreenHeader title="Mis cambios" titleVariant="title3" />
      <SegmentedControl
        label="Filtrar cambios"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'active', label: `Activos · ${activeCount}` },
          { value: 'published', label: 'Publicados' },
          { value: 'history', label: 'Historial' },
        ]}
      />

      {!data ? (
        <View style={styles.list}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={84} radius={26} />
          ))}
        </View>
      ) : tab === 'history' ? (
        <Text variant="callout" color={colors.textSecondary} align="center" style={styles.empty}>
          Aquí verás tus cambios terminados.
        </Text>
      ) : (
        <View style={styles.list}>
          {tab === 'active' &&
            data.active.map((t, i) => (
              <Reveal key={t.id} index={i}>
                <TradeCard trade={t} />
              </Reveal>
            ))}
          {tab === 'active' &&
            data.services.map((job, i) => (
              <Reveal key={job.id} index={i + 1}>
                <Surface
                  radius={26}
                  padding={14}
                  style={styles.row}
                  onPress={() => router.push({ pathname: '/tracking/[id]', params: { id: job.id } })}
                  accessibilityLabel={`${job.title}, ${job.eta}`}>
                  <View style={[styles.tile, { backgroundColor: palette.violetNight }]}>
                    <Icon name="wrench" size={22} color={palette.white} />
                  </View>
                  <View style={styles.flex}>
                    <Text variant="bodyBold">{job.title}</Text>
                    <Text variant="footnote" color={colors.textSecondary}>
                      {job.eta}
                    </Text>
                  </View>
                  <Badge label={job.status} tone="violet" height={28} />
                </Surface>
              </Reveal>
            ))}
          {data.published.map((p, i) => (
            <Reveal key={p.id} index={i + 2}>
              <Surface
                radius={26}
                padding={14}
                style={styles.row}
                onPress={() => router.push('/chats')}
                accessibilityLabel={`${p.title}, ${p.offers} ofertas`}>
                <View style={[styles.tile, { backgroundColor: palette.violetDeep }]}>
                  <Icon name="headphones" size={22} color={palette.white} />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyBold">{p.title}</Text>
                  <Text variant="footnote" color={colors.textSecondary}>
                    {p.meta}
                  </Text>
                </View>
                <Badge label={`${p.offers} ofertas`} tone="solidViolet" height={28} />
              </Surface>
            </Reveal>
          ))}

          {tab === 'active' && data.pendingRatings.length > 0 && (
            <>
              <SectionLabel>Por calificar</SectionLabel>
              {data.pendingRatings.map((r, i) => (
                <Reveal key={r.id} index={i + 3}>
                  <Surface
                    tone="pink"
                    radius={26}
                    padding={14}
                    style={styles.row}
                    onPress={() => router.push({ pathname: '/rate/[id]', params: { id: r.id } })}
                    accessibilityLabel={`Califica a ${r.counterpart.shortName} y gana ${r.reward} créditos`}>
                    <Avatar initials={r.counterpart.initials} size={48} color={r.counterpart.avatarColor} />
                    <View style={styles.flex}>
                      <Text variant="bodyBold">¿Cómo te fue con {r.counterpart.shortName}?</Text>
                      <Text variant="footnote" color={colors.textSecondary}>
                        {r.item} · ganas {r.reward} créditos
                      </Text>
                    </View>
                    <Icon name="chevronRight" size={20} color={colors.danger} strokeWidth={2.25} />
                  </Surface>
                </Reveal>
              ))}
            </>
          )}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  list: { gap: 12 },
  empty: { marginTop: 40 },
  trade: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tile: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  progress: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.primaryTint },
  segmentOn: { backgroundColor: palette.mint },
  stageLabels: { flexDirection: 'row', justifyContent: 'space-between' },
});
