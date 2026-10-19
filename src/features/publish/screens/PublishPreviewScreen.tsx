import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  Badge,
  Button,
  colors,
  GlassDock,
  Reveal,
  Screen,
  ScreenHeader,
  StatTile,
  StepIndicator,
  Surface,
  Switch,
  Text,
} from '@/design-system';
import { ListingArtwork } from '@/features/catalog/components/ListingArtwork';
import { conditionLabels } from '@/features/catalog/domain/listing';
import { useCreateListing } from '@/features/catalog/hooks/use-listings';
import { formatMoney } from '@/shared/lib/format';
import { haptics } from '@/shared/lib/haptics';
import { MediaThumb } from '@/shared/ui/MediaThumb';

import { usePublishDraft } from '../store/publish-draft.store';

const FEATURE_COST = 50;

export function PublishPreviewScreen() {
  const draft = usePublishDraft();
  const create = useCreateListing();
  const price = draft.intents.includes('sell') ? Number(draft.price || 0) : null;
  const kind = draft.type === 'service' ? 'service' : draft.kind;
  const cover = draft.media[0];

  const publish = () =>
    create.mutate(
      {
        title: draft.title.trim(),
        kind,
        condition: draft.condition,
        intents: draft.intents,
        price,
        wants: draft.wants,
        featured: draft.featured,
        media: draft.media.map(({ uri, type }) => ({ uri, type })),
      },
      {
        onSuccess: () => {
          haptics.success();
          draft.reset();
          router.dismissTo('/home');
          requestAnimationFrame(() => router.push('/trades'));
        },
      },
    );

  const tradeLabel = draft.wants.length ? `Cambiar por ${draft.wants.slice(0, 2).join(' o ').toLowerCase()}` : 'Cambiar';

  return (
    <Screen
      aurora={[
        { tint: 'violet', size: 420, left: -100, top: 100 },
        { tint: 'mint', size: 380, right: -150, top: 240 },
      ]}
      gap={16}
      footer={
        <Button
          label={create.isPending ? 'Publicando…' : 'Publicar ahora'}
          variant="gradient"
          glow
          disabled={create.isPending}
          onPress={publish}
        />
      }>
      <ScreenHeader center={<StepIndicator step={3} />} />
      <Text variant="title2" accessibilityRole="header">
        Así se verá
      </Text>

      <Reveal from="fade">
        {cover ? (
          <MediaThumb asset={cover} radius={30} style={styles.card}>
            <Badge label={conditionLabels[draft.condition]} tone="glass" style={styles.condition} />
            <GlassDock radius={22} style={styles.info}>
              <View style={styles.infoBody}>
                <View style={styles.titleRow}>
                  <Text variant="subhead" style={styles.title} numberOfLines={1}>
                    {draft.title}
                  </Text>
                  {price !== null && (
                    <Text variant="subhead" style={styles.price}>
                      {formatMoney(price)}
                    </Text>
                  )}
                </View>
                <View style={styles.tags}>
                  {draft.intents.includes('sell') && <Badge label="Vender" tone="violet" />}
                  {draft.intents.includes('trade') && <Badge label={tradeLabel} />}
                  {draft.intents.includes('gift') && <Badge label="Regalar" tone="pink" />}
                </View>
              </View>
            </GlassDock>
          </MediaThumb>
        ) : (
          <ListingArtwork
            kind={kind}
            iconSize={130}
            strokeWidth={1.1}
            radius={30}
            iconOffsetTop={34}
            focus={{ x: 0.7, y: 0.3 }}
            style={styles.card}>
            <Badge label={conditionLabels[draft.condition]} tone="glass" style={styles.condition} />
            <GlassDock radius={22} style={styles.info}>
              <View style={styles.infoBody}>
                <View style={styles.titleRow}>
                  <Text variant="subhead" style={styles.title} numberOfLines={1}>
                    {draft.title}
                  </Text>
                  {price !== null && (
                    <Text variant="subhead" style={styles.price}>
                      {formatMoney(price)}
                    </Text>
                  )}
                </View>
                <View style={styles.tags}>
                  {draft.intents.includes('sell') && <Badge label="Vender" tone="violet" />}
                  {draft.intents.includes('trade') && <Badge label={tradeLabel} />}
                  {draft.intents.includes('gift') && <Badge label="Regalar" tone="pink" />}
                </View>
              </View>
            </GlassDock>
          </ListingArtwork>
        )}
      </Reveal>

      <Reveal index={1} style={styles.stats}>
        <StatTile value="~240" label="personas cerca la verán hoy" size="lg" />
        <StatTile value="12" label="ya buscan una bici así" size="lg" tone="mint" />
      </Reveal>

      <Reveal index={2}>
        <Surface radius={22} padding={14} style={styles.feature}>
          <View style={styles.flex}>
            <Text variant="bodyBold">Destacar 3 días</Text>
            <Text variant="footnote" color={colors.textSecondary}>
              Sale primero en Swap Match · {FEATURE_COST} créditos
            </Text>
          </View>
          <Switch label="Destacar publicación" value={draft.featured} onValueChange={(featured) => draft.update({ featured })} />
        </Surface>
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  card: { height: 300, borderWidth: 1, borderColor: colors.border },
  condition: { position: 'absolute', left: 14, top: 14 },
  info: { position: 'absolute', left: 10, right: 10, bottom: 10 },
  infoBody: { paddingVertical: 14, paddingHorizontal: 16, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 20, lineHeight: 24 },
  price: { fontFamily: 'Rubik_700Bold' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  stats: { flexDirection: 'row', gap: 10 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
