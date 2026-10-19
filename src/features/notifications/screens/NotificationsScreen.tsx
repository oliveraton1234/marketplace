import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Chip,
  colors,
  gradients,
  Icon,
  palette,
  PressableScale,
  Reveal,
  Screen,
  ScreenHeader,
  SectionLabel,
  Skeleton,
  Text,
  type IconName,
} from '@/design-system';

import type { AppNotification, NotificationFilter, NotificationKind } from '../domain/notification';
import { useMarkAllRead, useNotifications } from '../hooks/use-notifications';

const filters: { id: NotificationFilter; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'offers', label: 'Ofertas' },
  { id: 'services', label: 'Servicios' },
];

const visuals: Record<NotificationKind, { icon: IconName; bg?: string; fg: string; gradient?: boolean }> = {
  trade_accepted: { icon: 'check', bg: palette.mint, fg: colors.text },
  new_matches: { icon: 'cards', fg: palette.white, gradient: true },
  provider_on_way: { icon: 'wrench', bg: palette.violetNight, fg: palette.white },
  credits: { icon: 'star', bg: colors.accentTint, fg: colors.success },
  level_up: { icon: 'bolt', bg: colors.primaryTintBold, fg: colors.primaryInk },
};

/** Renders `**bold**` segments from the notification body. */
function RichBody({ body }: { body: string }) {
  const parts = body.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <Text variant="body" style={styles.body}>
      {parts.map((part, i) =>
        part.startsWith('**') ? (
          <Text key={i} variant="bodyBold">
            {part.slice(2, -2)}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

function NotificationRow({ item }: { item: AppNotification }) {
  const v = visuals[item.kind];
  const icon = <Icon name={v.icon} size={20} color={v.fg} strokeWidth={2.5} />;
  return (
    <PressableScale
      pressedScale={0.98}
      accessibilityLabel={`${item.body.replaceAll('**', '')}. ${item.timeLabel}${item.unread ? '. Sin leer' : ''}`}
      onPress={() => router.push(item.target)}
      style={[styles.row, item.unread && styles.unread]}>
      {v.gradient ? (
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.icon}>
          {icon}
        </LinearGradient>
      ) : (
        <View style={[styles.icon, { backgroundColor: v.bg }]}>{icon}</View>
      )}
      <View style={styles.flex}>
        <RichBody body={item.body} />
        <Text variant="caption" color={colors.textTertiary}>
          {item.timeLabel}
        </Text>
      </View>
      {item.unread && <View style={styles.dot} />}
    </PressableScale>
  );
}

export function NotificationsScreen() {
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const { data } = useNotifications(filter);
  const markAll = useMarkAllRead();
  const today = data?.filter((n) => n.section === 'today') ?? [];
  const week = data?.filter((n) => n.section === 'week') ?? [];

  return (
    <Screen
      aurora={[
        { tint: 'violet', size: 400, right: -130, top: -150 },
        { tint: 'mint', size: 360, left: -150, top: 260 },
      ]}
      gap={14}>
      <ScreenHeader
        title="Avisos"
        titleVariant="title3"
        trailing={
          <PressableScale accessibilityLabel="Marcar todos como leídos" onPress={() => markAll.mutate()} style={styles.markAll}>
            <Text variant="calloutStrong" color={colors.primaryInk} style={styles.bold}>
              Marcar leídos
            </Text>
          </PressableScale>
        }
      />
      <View style={styles.filters}>
        {filters.map((f) => (
          <Chip
            key={f.id}
            size="sm"
            label={f.id === 'all' && data ? `Todo · ${data.length}` : f.label}
            selected={filter === f.id}
            onPress={() => setFilter(f.id)}
          />
        ))}
      </View>

      {!data ? (
        [0, 1, 2].map((i) => <Skeleton key={i} height={72} radius={24} />)
      ) : (
        <>
          {today.length > 0 && <SectionLabel>Hoy</SectionLabel>}
          {today.map((n, i) => (
            <Reveal key={n.id} index={i}>
              <NotificationRow item={n} />
            </Reveal>
          ))}
          {week.length > 0 && <SectionLabel>Esta semana</SectionLabel>}
          {week.map((n, i) => (
            <Reveal key={n.id} index={today.length + i}>
              <NotificationRow item={n} />
            </Reveal>
          ))}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 3 },
  bold: { fontFamily: 'DMSans_700Bold' },
  markAll: { height: 44, justifyContent: 'center' },
  filters: { flexDirection: 'row', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 24 },
  unread: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  body: { lineHeight: 20 },
  dot: { width: 10, height: 10, marginTop: 6, borderRadius: 5, backgroundColor: palette.violetSoft },
});
