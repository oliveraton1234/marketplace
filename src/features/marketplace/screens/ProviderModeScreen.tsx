import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import {
  Avatar,
  Badge,
  Button,
  colors,
  Reveal,
  Screen,
  ScreenHeader,
  Skeleton,
  Surface,
  Switch,
  Text,
  useCountUp,
} from '@/design-system';
import { formatDistance, formatMoney } from '@/shared/lib/format';

import { EarningsChart } from '../components/EarningsChart';
import { useProviderDashboard } from '../hooks/use-marketplace';

export function ProviderModeScreen() {
  const { data } = useProviderDashboard();
  const [receiving, setReceiving] = useState(true);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const earnings = useCountUp(data?.weekEarnings ?? 0);
  const requests = data?.requests.filter((r) => !dismissed.includes(r.id)) ?? [];

  return (
    <Screen
      aurora={[
        { tint: 'mint', size: 420, right: -120, top: -150 },
        { tint: 'violet', size: 380, left: -150, top: 60 },
      ]}
      gap={14}>
      <ScreenHeader
        title="Modo proveedor"
        subtitle={
          <Text variant="footnoteBold" color={receiving ? colors.success : colors.textTertiary}>
            {receiving ? 'Recibiendo trabajos' : 'En pausa'}
          </Text>
        }
        trailing={<Switch label="Recibir trabajos" value={receiving} onValueChange={setReceiving} tone="mint" size="lg" />}
      />

      {!data ? (
        <Skeleton height={190} radius={26} />
      ) : (
        <>
          <Reveal>
            <Surface radius={26} style={styles.earnings}>
              <View style={styles.earningsHead}>
                <View style={styles.gap4}>
                  <Text variant="footnote" color={colors.textSecondary}>
                    Ganaste esta semana
                  </Text>
                  <Text variant="bigNumber" style={styles.big}>
                    {formatMoney(earnings)}
                  </Text>
                </View>
                <Badge label={`+${data.weekDelta}% vs. la pasada`} />
              </View>
              <EarningsChart days={data.dailyEarnings} best={data.bestDayIndex} />
            </Surface>
          </Reveal>

          <View style={styles.sectionHead}>
            <Text variant="subhead" accessibilityRole="header">
              Solicitudes nuevas
            </Text>
            <Text variant="footnoteBold" color={colors.success}>
              {requests.length} cerca
            </Text>
          </View>

          {requests.map((r) => (
            <Animated.View key={r.id} exiting={FadeOut} layout={LinearTransition}>
              <Surface radius={24} padding={14} style={styles.request}>
                <View style={styles.row}>
                  <Avatar initials={r.client.initials} size={44} color={r.client.avatarColor} />
                  <View style={styles.flex}>
                    <Text variant="bodyBold">{r.title}</Text>
                    <Text variant="footnote" color={colors.textSecondary}>
                      {r.client.name} · {formatDistance(r.distanceKm)} · {r.when}
                    </Text>
                  </View>
                  <Text variant="subhead" style={styles.price}>
                    {formatMoney(r.price)}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Button
                    label="Rechazar"
                    variant="outline"
                    size="sm"
                    style={styles.flex}
                    onPress={() => setDismissed((d) => [...d, r.id])}
                  />
                  <Button
                    label="Aceptar"
                    size="sm"
                    style={styles.flex}
                    onPress={() => router.push({ pathname: '/tracking/[id]', params: { id: 'job-1' } })}
                  />
                </View>
              </Surface>
            </Animated.View>
          ))}
          {!requests.length && (
            <Text variant="callout" color={colors.textSecondary}>
              Sin solicitudes por ahora. Te avisamos en cuanto llegue una.
            </Text>
          )}

          <Text variant="subhead" accessibilityRole="header">
            Agenda de hoy
          </Text>
          <View style={styles.agenda}>
            {data.agenda.map((a) => (
              <View key={a.id} style={styles.row}>
                <Text variant="bodyBold" style={styles.time}>
                  {a.time}
                </Text>
                <View style={[styles.rule, { backgroundColor: a.color }]} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{a.title}</Text>
                  <Text variant="footnote" color={colors.textSecondary}>
                    {a.client} · {formatMoney(a.price)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  gap4: { gap: 4 },
  earnings: { gap: 14 },
  earningsHead: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  big: { fontSize: 34, lineHeight: 38 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  request: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  price: { fontFamily: 'Rubik_700Bold' },
  agenda: { gap: 10 },
  time: { width: 54, fontFamily: 'Rubik_700Bold' },
  rule: { width: 4, height: 40, borderRadius: 2 },
});
