import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import {
  auroraPresets,
  Avatar,
  Badge,
  Button,
  colors,
  Icon,
  Reveal,
  Screen,
  ScreenHeader,
  Skeleton,
  Surface,
  Switch,
  Text,
} from '@/design-system';

import { SosButton } from '../components/SosButton';
import { useActiveMeeting, useSos } from '../hooks/use-safety';

const tips = ['Revisa el objeto antes de cerrar el trato', 'Quédate en la zona vigilada'];

export function SafetyScreen() {
  const { data: meeting } = useActiveMeeting();
  const sos = useSos();
  const [sharing, setSharing] = useState(true);

  return (
    <Screen
      aurora={auroraPresets.calm}
      gap={16}
      footer={
        <View style={styles.footer}>
          <Button label="Reportar" variant="secondary" size="md" style={styles.flex} onPress={() => router.push('/report')} />
          <Button
            label="Ya terminé"
            size="md"
            style={styles.flex}
            onPress={() => router.push({ pathname: '/rate/[id]', params: { id: 'r-1' } })}
          />
        </View>
      }>
      <ScreenHeader title="Encuentro seguro" titleVariant="title4" trailing={<Badge label="Activo" dot height={30} />} />

      {meeting ? (
        <Reveal>
          <Surface radius={26} style={styles.card}>
            <View style={styles.row}>
              <Avatar initials={meeting.counterpartInitials} size={48} color={colors.primary} />
              <View style={styles.flexText}>
                <Text variant="bodyBold" style={styles.lg}>
                  Con {meeting.counterpartName}
                </Text>
                <Text variant="footnote" color={colors.textSecondary}>
                  {meeting.place} · {meeting.time}
                </Text>
              </View>
              <View style={styles.timer}>
                <Text variant="stat">{meeting.elapsed}</Text>
                <Text variant="caption" color={colors.textTertiary}>
                  en curso
                </Text>
              </View>
            </View>
            <View style={[styles.row, styles.divider]}>
              <View style={styles.flexText}>
                <Text variant="bodyStrong">Compartir mi ubicación</Text>
                <Text variant="footnote" color={colors.textSecondary}>
                  {meeting.trustedContact} te ve en vivo
                </Text>
              </View>
              <Switch value={sharing} onValueChange={setSharing} label="Compartir mi ubicación" tone="mint" />
            </View>
          </Surface>
        </Reveal>
      ) : (
        <Skeleton height={150} radius={26} />
      )}

      <Reveal index={1} from="fade" style={styles.sos}>
        <SosButton
          onTrigger={() =>
            sos.mutate(undefined, {
              onSuccess: () =>
                Alert.alert('Ayuda en camino', 'Avisamos a tu contacto de confianza y te estamos conectando con el 911.'),
            })
          }
        />
        <Text variant="callout" color={colors.textSecondary} align="center" style={styles.sosCopy}>
          Avisamos a tu contacto y te conectamos con el 911.
        </Text>
      </Reveal>

      <Reveal index={2} style={styles.tips}>
        {tips.map((tip) => (
          <View key={tip} style={styles.tip}>
            <Icon name="check" size={18} color={colors.accent} strokeWidth={2.5} />
            <Text variant="callout">{tip}</Text>
          </View>
        ))}
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexText: { flex: 1, gap: 2 },
  lg: { fontSize: 16 },
  card: { gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  timer: { alignItems: 'flex-end' },
  sos: { alignItems: 'center', gap: 12, marginVertical: 12 },
  sosCopy: { maxWidth: 270 },
  tips: { gap: 8 },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footer: { flexDirection: 'row', gap: 10 },
});
