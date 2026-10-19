import { router, useLocalSearchParams } from 'expo-router';
import { Alert, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar,
  colors,
  GlassDock,
  GradientText,
  Icon,
  IconButton,
  palette,
  radii,
  Reveal,
  SectionLabel,
  Skeleton,
  Surface,
  Text,
} from '@/design-system';
import { MapCanvas } from '@/features/geo/components/MapCanvas';
import { Pulse } from '@/features/geo/components/MapPins';

import type { JobStage } from '../domain/provider';
import { useJobTracking } from '../hooks/use-marketplace';
import { goBack } from '@/shared/lib/navigation';

const MAP_HEIGHT = 420;
const stages: { id: JobStage; label: string }[] = [
  { id: 'confirmed', label: 'Confirmado' },
  { id: 'on_the_way', label: 'En camino' },
  { id: 'working', label: 'Trabajando' },
  { id: 'done', label: 'Listo' },
];

function StageBar({ stage, progress }: { stage: JobStage; progress: number }) {
  const current = stages.findIndex((s) => s.id === stage);
  return (
    <View style={styles.stages} accessible accessibilityLabel={`Estado: ${stages[current]?.label}`}>
      {stages.map((s, i) => {
        const fill = i < current ? 1 : i === current ? progress : 0;
        return (
          <View key={s.id} style={styles.stage}>
            <View style={styles.stageTrack}>
              <View style={[styles.stageFill, { width: `${fill * 100}%` }]} />
            </View>
            <Text variant={i === current ? 'captionBold' : 'caption'} color={i <= current ? colors.text : colors.textTertiary}>
              {s.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { data: job } = useJobTracking(id ?? 'job-1');
  const k = width / 390;

  return (
    <View style={styles.root}>
      <View style={[styles.map, { height: MAP_HEIGHT + insets.top / 2 }]}>
        <MapCanvas variant="tracking" />
        <View
          accessible
          accessibilityLabel={job?.provider.name ?? 'Proveedor'}
          style={[styles.marker, { left: 276 * k, top: 116 * k + insets.top / 2 }]}>
          <Pulse size={56} color="rgba(111,227,184,0.5)" />
          <View style={styles.providerDot}>
            <Text variant="captionBold" color={colors.text} style={styles.providerInitials}>
              {job?.provider.initials ?? 'JL'}
            </Text>
          </View>
        </View>
        <View accessible accessibilityLabel="Tu casa" style={[styles.home, { left: 92 * k, top: 302 * k + insets.top / 2 }]}>
          <Icon name="home" size={18} color={colors.textInverse} strokeWidth={2.25} />
        </View>
      </View>

      <View style={[styles.topBar, { top: insets.top + 12 }]}>
        <IconButton icon="chevronLeft" label="Regresar" size={48} onPress={() => goBack()} />
        <GlassDock radius={24} style={styles.live}>
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text variant="calloutStrong">En vivo · actualizado hace {job?.updatedSecondsAgo ?? 5} s</Text>
          </View>
        </GlassDock>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        {job ? (
          <>
            <Reveal style={styles.etaRow}>
              <View style={styles.etaCol}>
                <Text variant="callout" color={colors.textSecondary}>
                  {job.provider.shortName} llega en
                </Text>
                <GradientText variant="bigNumber" style={styles.eta}>
                  {job.etaMinutes} min
                </GradientText>
              </View>
              <View style={styles.codeCol}>
                <SectionLabel>Código de llegada</SectionLabel>
                <View
                  style={styles.code}
                  accessible
                  accessibilityLabel={`Código de llegada ${job.arrivalCode.split('').join(' ')}`}>
                  {job.arrivalCode.split('').map((d, i) => (
                    <View key={i} style={styles.codeDigit}>
                      <Text variant="subhead" style={styles.codeText}>
                        {d}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </Reveal>

            <Reveal index={1}>
              <StageBar stage={job.stage} progress={job.stageProgress} />
            </Reveal>

            <Reveal index={2}>
              <Surface padding={14} style={styles.providerCard}>
                <Avatar initials={job.provider.initials} size={52} ring="brand" />
                <View style={styles.flex}>
                  <Text variant="bodyBold" style={styles.name}>
                    {job.provider.name}
                  </Text>
                  <Text variant="footnote" color={colors.textSecondary}>
                    {job.provider.trade} · {job.provider.rating} · {job.provider.jobsDone} trabajos
                  </Text>
                </View>
                <IconButton
                  icon="phone"
                  label={`Llamar a ${job.provider.shortName}`}
                  size={46}
                  iconSize={20}
                  variant="tint"
                  onPress={() =>
                    Alert.alert('Llamada protegida', `Te conectamos con ${job.provider.shortName} sin compartir tu número.`)
                  }
                />
                <IconButton
                  icon="message"
                  label={`Mensaje a ${job.provider.shortName}`}
                  size={46}
                  iconSize={20}
                  variant="solid"
                  onPress={() => router.push({ pathname: '/chats/[id]', params: { id: 'c-joseluis' } })}
                />
              </Surface>
            </Reveal>

            <Reveal index={3} style={styles.note}>
              <Icon name="shieldCheck" size={18} color={palette.mint} strokeWidth={2.25} />
              <Text variant="footnote" color={colors.success} style={styles.flex}>
                Dale el código solo cuando llegue. Tu pago se libera al terminar.
              </Text>
            </Reveal>
          </>
        ) : (
          <Skeleton height={260} radius={24} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.mapGround },
  flex: { flex: 1, gap: 2 },
  map: { overflow: 'hidden' },
  marker: { position: 'absolute', width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  providerDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.mint,
    borderWidth: 3,
    borderColor: palette.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerInitials: { fontFamily: 'Rubik_700Bold', fontSize: 11 },
  home: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  live: { flex: 1, height: 48 },
  liveRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16 },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.mint,
    borderWidth: 3,
    borderColor: 'rgba(111,227,184,0.35)',
  },
  sheet: {
    flex: 1,
    marginTop: -40,
    paddingTop: 22,
    paddingHorizontal: 20,
    gap: 18,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  etaRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  etaCol: { gap: 4 },
  eta: { fontSize: 44, lineHeight: 48 },
  codeCol: { alignItems: 'flex-end', gap: 6 },
  code: { flexDirection: 'row', gap: 4 },
  codeDigit: {
    width: 28,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: { fontFamily: 'Rubik_700Bold' },
  stages: { flexDirection: 'row', gap: 6 },
  stage: { flex: 1, gap: 8 },
  stageTrack: { height: 6, borderRadius: 3, backgroundColor: colors.primaryTint, overflow: 'hidden' },
  stageFill: { height: 6, borderRadius: 3, backgroundColor: palette.mint },
  providerCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontSize: 16 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.accentTintSoft,
  },
});
