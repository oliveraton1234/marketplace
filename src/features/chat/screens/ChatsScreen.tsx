import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  auroraPresets,
  Badge,
  colors,
  CountBubble,
  IconButton,
  PressableScale,
  Reveal,
  Screen,
  ScreenHeader,
  SegmentedControl,
  Skeleton,
  Text,
} from '@/design-system';

import { ConversationAvatar } from '../components/ConversationAvatar';
import type { ConversationFilter, ConversationPreview } from '../domain/chat';
import { useConversations } from '../hooks/use-chat';

const filters: { value: ConversationFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'offers', label: 'Ofertas · 2' },
  { value: 'services', label: 'Servicios' },
];

function ConversationRow({ item }: { item: ConversationPreview }) {
  const unread = item.unread > 0;
  return (
    <PressableScale
      pressedScale={0.98}
      accessibilityLabel={`${item.title}. ${item.lastMessage}. ${item.timeLabel}${unread ? `, ${item.unread} sin leer` : ''}`}
      onPress={() => router.push({ pathname: '/chats/[id]', params: { id: item.id } })}
      style={[styles.row, item.highlight && styles.highlight]}>
      <ConversationAvatar user={item.counterpart} ring={item.kind === 'offer'} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text variant="bodyBold" style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text variant={unread ? 'captionBold' : 'caption'} color={unread ? colors.success : colors.textTertiary}>
            {item.timeLabel}
          </Text>
        </View>
        <Text
          variant={unread ? 'calloutStrong' : 'callout'}
          color={unread ? colors.text : colors.textSecondary}
          numberOfLines={1}>
          {item.lastMessage}
        </Text>
        {item.offerLabel && <Badge label={item.offerLabel} tone="violet" height={22} />}
      </View>
      {unread && <CountBubble count={item.unread} />}
    </PressableScale>
  );
}

export function ChatsScreen() {
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const { data, isPending } = useConversations(filter);

  return (
    <Screen aurora={auroraPresets.dualReverse} gap={16}>
      <ScreenHeader
        title="Mensajes"
        titleVariant="title3"
        trailing={<IconButton icon="search" label="Buscar mensajes" iconSize={20} />}
      />
      <SegmentedControl label="Filtrar mensajes" options={filters} value={filter} onChange={setFilter} />
      <View style={styles.list}>
        {isPending
          ? [0, 1, 2].map((i) => <Skeleton key={i} height={76} radius={24} />)
          : data?.map((item, i) => (
              <Reveal key={item.id} index={i}>
                <ConversationRow item={item} />
              </Reveal>
            ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 24 },
  highlight: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  body: { flex: 1, minWidth: 0, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  title: { flex: 1, fontSize: 16 },
});
