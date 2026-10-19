import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  Badge,
  Button,
  colors,
  Icon,
  palette,
  PressableScale,
  Reveal,
  Screen,
  ScreenHeader,
  SegmentedControl,
  StepIndicator,
  Surface,
  Text,
  durations,
} from '@/design-system';
import { ListingArtwork } from '@/features/catalog/components/ListingArtwork';
import { chooseMedia } from '@/shared/device/media';
import { haptics } from '@/shared/lib/haptics';
import { MediaThumb } from '@/shared/ui/MediaThumb';

import { MAX_PHOTOS, usePublishDraft, type PublishType } from '../store/publish-draft.store';
import { goBack } from '@/shared/lib/navigation';

const typeOptions: { value: PublishType; label: string }[] = [
  { value: 'item', label: 'Un objeto' },
  { value: 'service', label: 'Un servicio' },
];

export function PublishPhotosScreen() {
  const { type, media, kind, update, addMedia, removeMedia } = usePublishDraft();
  const artKind = type === 'service' ? 'service' : kind;
  const [cover, second, ...rest] = media;

  const addPhotos = async () => {
    if (media.length >= MAX_PHOTOS) return haptics.warning();
    const picked = await chooseMedia({ limit: MAX_PHOTOS - media.length });
    if (picked.length) {
      haptics.success();
      addMedia(picked);
    }
  };

  return (
    <Screen
      aurora={[
        { tint: 'violet', size: 420, left: -140, top: -160 },
        { tint: 'mint', size: 400, right: -160, top: 420 },
      ]}
      gap={16}
      footer={
        <Button
          label={media.length ? 'Siguiente' : 'Agrega al menos una foto'}
          trailingIcon="arrowRight"
          disabled={!media.length}
          onPress={() => router.push('/publish/details')}
        />
      }>
      <ScreenHeader
        leading="close"
        onLeadingPress={() => goBack()}
        center={<StepIndicator step={1} />}
        trailing={
          <PressableScale accessibilityLabel="Guardar borrador" onPress={() => goBack()} style={styles.draft}>
            <Text variant="calloutStrong" color={colors.primaryInk} style={styles.bold}>
              Borrador
            </Text>
          </PressableScale>
        }
      />
      <Text variant="title2" accessibilityRole="header">
        ¿Qué vas a publicar?
      </Text>
      <SegmentedControl
        label="Tipo de publicación"
        height={44}
        options={typeOptions}
        value={type}
        onChange={(v) => update({ type: v })}
      />

      <View style={styles.gallery}>
        {cover ? (
          <MediaThumb asset={cover} radius={26} onRemove={() => removeMedia(cover.uri)} style={styles.cover}>
            <Badge label="Portada" tone="glass" style={styles.coverBadge} />
          </MediaThumb>
        ) : (
          <PressableScale accessibilityLabel="Agregar foto de portada" onPress={addPhotos} style={styles.cover}>
            <ListingArtwork
              kind={artKind}
              iconSize={96}
              strokeWidth={1.25}
              radius={26}
              focus={{ x: 0.7, y: 0.3 }}
              style={styles.flex}>
              <Badge label="Portada" tone="glass" style={styles.coverBadge} />
              <View style={styles.coverHint}>
                <Icon name="camera" size={16} color={colors.primaryInk} />
                <Text variant="footnoteBold" color={colors.primaryInk}>
                  Toca para agregar
                </Text>
              </View>
            </ListingArtwork>
          </PressableScale>
        )}
        <View style={styles.side}>
          {second ? (
            <Animated.View entering={FadeIn.duration(durations.base)} style={styles.flex}>
              <MediaThumb asset={second} onRemove={() => removeMedia(second.uri)} style={styles.flex} />
            </Animated.View>
          ) : (
            <View style={[styles.flex, styles.placeholder]} />
          )}
          <PressableScale
            accessibilityLabel={`Agregar fotos o videos, ${media.length} de ${MAX_PHOTOS}`}
            onPress={addPhotos}
            style={[styles.flex, styles.add]}>
            <Icon name="plus" size={22} color={colors.primaryInk} strokeWidth={2.5} />
            <Text variant="captionBold" color={colors.primaryInk}>
              {media.length} de {MAX_PHOTOS}
            </Text>
          </PressableScale>
        </View>
      </View>

      {rest.length > 0 && (
        <View style={styles.strip}>
          {rest.map((asset) => (
            <Animated.View key={asset.uri} entering={FadeIn.duration(durations.base)}>
              <MediaThumb asset={asset} radius={16} onRemove={() => removeMedia(asset.uri)} style={styles.thumb} />
            </Animated.View>
          ))}
        </View>
      )}

      <Reveal index={2}>
        <Surface tone="mint" radius={22} padding={14} style={styles.ai}>
          <View style={styles.aiIcon}>
            <Icon name="sparkleSolo" size={20} color={colors.text} strokeWidth={2.25} />
          </View>
          <View style={styles.aiText}>
            <Text variant="bodyBold">
              {type === 'service' ? 'Detectamos un servicio de hogar' : 'Detectamos una bici urbana'}
            </Text>
            <Text variant="footnote" color={colors.textSecondary}>
              Llenamos título y categoría por ti
            </Text>
          </View>
        </Surface>
      </Reveal>

      <View style={styles.tips}>
        {['Usa luz natural', 'Muestra detalles'].map((tip) => (
          <View key={tip} style={styles.tip}>
            <Text variant="footnote" color={colors.textSecondary}>
              {tip}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontFamily: 'DMSans_700Bold' },
  draft: { height: 44, justifyContent: 'center' },
  gallery: { flexDirection: 'row', gap: 10, height: 218 },
  cover: { flex: 2 },
  coverBadge: { position: 'absolute', left: 10, top: 10 },
  side: { flex: 1, gap: 10 },
  coverHint: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceStrong,
  },
  strip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: 76, height: 76 },
  placeholder: { borderRadius: 22, backgroundColor: palette.violetHaze },
  add: {
    borderRadius: 22,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: palette.violetSoft,
    backgroundColor: colors.primaryTintMd,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ai: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: palette.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiText: { flex: 1, gap: 2 },
  tips: { flexDirection: 'row', gap: 8 },
  tip: { height: 32, paddingHorizontal: 12, borderRadius: 16, backgroundColor: colors.surface, justifyContent: 'center' },
});
