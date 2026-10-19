import { router } from 'expo-router';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Aurora, Button, colors, GlassDock, Icon, IconButton, Reveal, Skeleton, Text } from '@/design-system';
import { goBack } from '@/shared/lib/navigation';

import { MapCanvas, MAP_SPACE } from '../components/MapCanvas';
import { MapPinView } from '../components/MapPins';
import { useMapSnapshot } from '../hooks/use-map';

function Eta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.eta}>
      <Text variant="caption" color={colors.textTertiary}>
        {label}
      </Text>
      <Text variant="bodyBold">{value}</Text>
    </View>
  );
}

/**
 * Meeting point for an agreed trade: only you, the suggested safe spot and the route.
 * Listings are never tracked on a map; the other person's position is not shown.
 */
export function MeetingMapScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { data } = useMapSnapshot('safe_spots');
  const scale = { x: width / MAP_SPACE.width, y: height / MAP_SPACE.height };

  return (
    <View style={styles.root}>
      <MapCanvas />
      <Aurora
        blobs={[
          { tint: 'violet', size: 380, left: -120, top: height * 0.39, intensity: 0.45, falloff: 0.65 },
          { tint: 'mint', size: 320, right: -100, top: height * 0.14, intensity: 0.25, falloff: 0.65 },
        ]}
      />
      {data?.pins.map((pin, i) => (
        <MapPinView key={pin.id} pin={pin} scale={scale} index={i} />
      ))}

      <View style={[styles.top, { top: insets.top + 12 }]}>
        <IconButton icon="chevronLeft" label="Regresar" size={48} variant="glass" onPress={() => goBack()} />
        <GlassDock radius={24} style={styles.titleDock}>
          <View style={styles.titleRow}>
            <Icon name="shieldCheck" size={18} color={colors.success} />
            <Text variant="bodyBold">Punto de encuentro</Text>
          </View>
        </GlassDock>
      </View>

      <Reveal index={3} style={[styles.sheetWrap, { bottom: insets.bottom + 16 }]}>
        <GlassDock radius={32} style={styles.sheet}>
          <View style={styles.grabber} />
          {data ? (
            <View style={styles.sheetBody}>
              <View style={styles.meetingRow}>
                <View style={styles.meetingIcon}>
                  <Icon name="shieldCheck" size={24} color={colors.success} />
                </View>
                <View style={styles.flex}>
                  <Text variant="captionBold" color={colors.success} style={styles.overline}>
                    PUNTO DE ENCUENTRO SUGERIDO
                  </Text>
                  <Text variant="subhead">{data.meeting.place}</Text>
                  <Text variant="footnote" color={colors.textSecondary}>
                    {data.meeting.note}
                  </Text>
                </View>
              </View>
              <View style={styles.etas}>
                <Eta label="Tú" value={`${data.meeting.myEtaMinutes} min`} />
                <Eta label={data.meeting.counterpartName} value={`${data.meeting.theirEtaMinutes} min`} />
                <Eta label="Hora" value={data.meeting.time} />
              </View>
              <Button label="Confirmar encuentro" variant="gradient" size="md" onPress={() => router.push('/safety')} />
            </View>
          ) : (
            <Skeleton height={180} radius={20} />
          )}
        </GlassDock>
      </Reveal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1, gap: 3 },
  top: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8 },
  titleDock: { flex: 1, height: 48 },
  titleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14 },
  sheetWrap: { position: 'absolute', left: 12, right: 12 },
  sheet: { padding: 18, paddingTop: 12, gap: 14 },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.borderStrong },
  sheetBody: { gap: 14 },
  meetingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  meetingIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overline: { letterSpacing: 0.7 },
  etas: { flexDirection: 'row', gap: 8 },
  eta: { flex: 1, padding: 10, borderRadius: 16, backgroundColor: colors.surface, gap: 2 },
});
