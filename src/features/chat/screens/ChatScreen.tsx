import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Aurora,
  Button,
  Chip,
  colors,
  Field,
  gradients,
  Icon,
  IconButton,
  palette,
  PressableScale,
  screenGutter,
  Skeleton,
  Surface,
  Text,
  durations,
} from '@/design-system';
import { ListingArtwork } from '@/features/catalog/components/ListingArtwork';
import { listingArt } from '@/features/catalog/ui/listing-art';

import { chooseMedia } from '@/shared/device/media';
import { MediaThumb } from '@/shared/ui/MediaThumb';

import { ConversationAvatar } from '../components/ConversationAvatar';
import { TypingDots } from '../components/TypingDots';
import type { Message } from '../domain/chat';
import { useConversation, useSendMessage } from '../hooks/use-chat';
import { goBack } from '@/shared/lib/navigation';

function Bubble({ message }: { message: Message }) {
  const mine = message.from === 'me';
  if (message.type === 'media') {
    return (
      <MediaThumb
        asset={{ uri: message.uri, type: message.mediaType, width: 0, height: 0, durationMs: message.durationMs }}
        style={[styles.media, mine ? styles.mine : styles.theirs, mine ? styles.mineCorner : styles.theirsCorner]}
      />
    );
  }
  if (message.type === 'photo') {
    return (
      <ListingArtwork
        kind={message.kind}
        iconSize={48}
        focus={{ x: 0.7, y: 0.3 }}
        label="Foto enviada"
        radius={22}
        style={[styles.photo, mine ? styles.mine : styles.theirs, mine ? styles.mineCorner : styles.theirsCorner]}
      />
    );
  }
  return (
    <View
      style={[
        styles.bubble,
        mine ? [styles.mine, styles.mineBubble, styles.mineCorner] : [styles.theirs, styles.theirsBubble, styles.theirsCorner],
      ]}>
      <Text variant="body" color={mine ? palette.white : colors.text}>
        {message.text}
      </Text>
    </View>
  );
}

export function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data: chat } = useConversation(id);
  const send = useSendMessage(id);
  const [draft, setDraft] = useState('');
  const scroll = useRef<ScrollView>(null);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value) return;
    send.mutate({ type: 'text', text: value });
    setDraft('');
  };

  const attach = async () => {
    const [asset] = await chooseMedia();
    if (asset) send.mutate({ type: 'media', uri: asset.uri, mediaType: asset.type, durationMs: asset.durationMs });
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Aurora blobs={[{ tint: 'violet', size: 420, left: -160, top: 220 }]} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <IconButton icon="chevronLeft" label="Regresar" onPress={() => goBack()} />
        {chat ? (
          <>
            <ConversationAvatar user={chat.counterpart} size={44} />
            <View style={styles.flex}>
              <Text variant="bodyBold" style={styles.name}>
                {chat.counterpart.name}
              </Text>
              <Text variant="footnote" color={chat.online ? colors.success : colors.textTertiary} style={styles.status}>
                {chat.online ? 'En línea' : 'Desconectado'}
              </Text>
            </View>
          </>
        ) : (
          <Skeleton height={44} width={180} radius={22} />
        )}
        <IconButton icon="dots" label="Más opciones" variant="plain" onPress={() => router.push('/report')} />
      </View>

      <ScrollView
        ref={scroll}
        style={styles.flex}
        contentContainerStyle={styles.thread}
        keyboardDismissMode="interactive"
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
        {chat?.offer && (
          <Surface radius={24} padding={14} style={styles.offer}>
            <View style={styles.offerRow}>
              <View style={[styles.offerTile, { backgroundColor: listingArt[chat.offer.give].tile }]}>
                <Icon name={listingArt[chat.offer.give].icon} size={24} color={palette.white} strokeWidth={1.75} />
              </View>
              <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.swapIcon}>
                <Icon name="swap" size={16} color={palette.white} strokeWidth={2.5} />
              </LinearGradient>
              <View style={[styles.offerTile, { backgroundColor: listingArt[chat.offer.receive].tile }]}>
                <Icon name={listingArt[chat.offer.receive].icon} size={24} color={palette.white} strokeWidth={1.75} />
              </View>
              <View style={styles.offerText}>
                <Text variant="calloutStrong" style={styles.bold}>
                  {chat.offer.title}
                </Text>
                <Text variant="captionBold" color={colors.success}>
                  {chat.offer.status}
                </Text>
              </View>
            </View>
            <View style={styles.offerActions}>
              <Button
                label="Contraoferta"
                variant="outline"
                size="sm"
                style={styles.flex}
                onPress={() => router.push({ pathname: '/offer/[id]', params: { id: 'l-canon-ae1' } })}
              />
              <Button
                label="Aceptar cambio"
                variant="accent"
                size="sm"
                style={styles.flex}
                onPress={() => router.push('/meeting')}
              />
            </View>
          </Surface>
        )}

        <Text variant="captionBold" color={colors.textTertiary} align="center" style={styles.day}>
          Hoy
        </Text>

        {chat?.messages.map((m) => (
          <Animated.View key={m.id} entering={FadeIn.duration(durations.base)} layout={LinearTransition}>
            <Bubble message={m} />
          </Animated.View>
        ))}
        {chat?.isTyping && <TypingDots name={chat.counterpart.shortName} />}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quick}
          keyboardShouldPersistTaps="handled">
          {chat?.quickReplies.map((reply) => (
            <Chip key={reply} label={reply} size="sm" onPress={() => submit(reply)} />
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <IconButton icon="plus" label="Adjuntar foto o video" size={48} onPress={attach} />
          <Field
            shape="pill"
            height={48}
            placeholder="Escribe un mensaje"
            value={draft}
            onChangeText={setDraft}
            returnKeyType="send"
            onSubmitEditing={() => submit(draft)}
            containerStyle={styles.flex}
          />
          <PressableScale accessibilityLabel="Enviar" disabled={!draft.trim()} onPress={() => submit(draft)}>
            <LinearGradient colors={gradients.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.send}>
              <Icon name="arrowRight" size={20} color={palette.white} strokeWidth={2.25} />
            </LinearGradient>
          </PressableScale>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  bold: { fontFamily: 'DMSans_700Bold' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: screenGutter,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  name: { fontSize: 16 },
  status: { fontFamily: 'DMSans_600SemiBold' },
  thread: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16, gap: 10 },
  offer: { gap: 12 },
  offerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  offerTile: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  swapIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  offerText: { flex: 1, alignItems: 'flex-end', gap: 2 },
  offerActions: { flexDirection: 'row', gap: 8 },
  day: { marginTop: 4 },
  bubble: { maxWidth: 260, paddingVertical: 12, paddingHorizontal: 16 },
  mine: { alignSelf: 'flex-end' },
  theirs: { alignSelf: 'flex-start' },
  mineBubble: { backgroundColor: colors.primary },
  theirsBubble: { backgroundColor: colors.surface },
  mineCorner: { borderTopLeftRadius: 22, borderTopRightRadius: 22, borderBottomLeftRadius: 22, borderBottomRightRadius: 6 },
  theirsCorner: { borderTopLeftRadius: 22, borderTopRightRadius: 22, borderBottomLeftRadius: 6, borderBottomRightRadius: 22 },
  photo: { width: 180, height: 110 },
  media: { width: 200, height: 240 },
  composer: { paddingTop: 10, paddingHorizontal: 16, gap: 10 },
  quick: { gap: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  send: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
});
