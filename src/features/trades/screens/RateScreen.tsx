import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import {
  Avatar,
  Button,
  Chip,
  colors,
  Icon,
  IconButton,
  PressableScale,
  Screen,
  Text,
  TextArea,
  durations,
} from '@/design-system';
import { mockUsers } from '@/features/users/data/users.mock';

import { useRateTrade } from '../hooks/use-trades';
import { goBack } from '@/shared/lib/navigation';

const words = ['', 'Mal', 'Regular', 'Bien', 'Muy bien', '¡Excelente!'];
const tagOptions = ['Puntual', 'Amable', 'Tal como se describe', 'Buen trato', 'Lo recomiendo'];
const REWARD = 20;

function Star({ index, active, onPress }: { index: number; active: boolean; onPress: () => void }) {
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${index} ${index === 1 ? 'estrella' : 'estrellas'}`}
      onPress={onPress}
      style={[styles.star, { backgroundColor: active ? 'rgba(123,63,242,0.22)' : colors.surface }]}>
      <Icon name="star" size={30} color={active ? colors.primary : 'rgba(13,11,20,0.22)'} />
    </PressableScale>
  );
}

export function RateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = mockUsers.sofia;
  const [rating, setRating] = useState(5);
  const [tags, setTags] = useState<string[]>(['Puntual', 'Amable']);
  const [comment, setComment] = useState('');
  const rate = useRateTrade();

  const submit = () =>
    rate.mutate({ ratingId: id ?? 'r-1', stars: rating, tags, comment }, { onSuccess: () => router.dismissTo('/profile') });

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen
        aurora={[
          { tint: 'violet', size: 410, left: -10, top: -90, falloff: 0.64 },
          { tint: 'pink', size: 380, right: -160, top: 360 },
        ]}
        gap={16}
        contentStyle={styles.content}
        footer={
          <Button
            label={rate.isPending ? 'Enviando…' : 'Enviar'}
            disabled={rate.isPending}
            onPress={submit}
            accessory={
              <View style={styles.reward}>
                <Text variant="footnoteBold">+{REWARD} créditos</Text>
              </View>
            }
          />
        }>
        <IconButton icon="close" label="Cerrar" iconSize={20} onPress={() => goBack()} style={styles.close} />
        <Animated.View entering={FadeIn.duration(durations.slow)}>
          <Avatar initials={person.initials} size={96} color={person.avatarColor} ring="warm" gap={4} />
        </Animated.View>
        <View style={styles.titles}>
          <Text variant="title3" align="center" accessibilityRole="header">
            ¿Cómo te fue con {person.shortName}?
          </Text>
          <Text variant="callout" color={colors.textSecondary}>
            Cambio de guitarra · ayer
          </Text>
        </View>
        <View accessibilityRole="radiogroup" accessibilityLabel="Calificación" style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} index={n} active={n <= rating} onPress={() => setRating(n)} />
          ))}
        </View>
        <Text variant="subhead" color={colors.primaryInk} accessibilityLiveRegion="polite">
          {words[rating]}
        </Text>
        <View style={styles.tags}>
          {tagOptions.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              selected={tags.includes(tag)}
              selectedTone="mint"
              onPress={() => setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]))}
            />
          ))}
        </View>
        <TextArea
          placeholder="Cuéntale a otros cómo fue (opcional)"
          value={comment}
          onChangeText={setComment}
          style={styles.comment}
          maxLength={280}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { alignItems: 'center' },
  close: { alignSelf: 'flex-end' },
  titles: { alignItems: 'center', gap: 6 },
  stars: { flexDirection: 'row', gap: 8 },
  star: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  comment: { alignSelf: 'stretch', minHeight: 84 },
  reward: { height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.accent, justifyContent: 'center' },
});
