import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, ZoomOut, FadeIn } from 'react-native-reanimated';

import {
  Badge,
  Button,
  Chip,
  colors,
  Field,
  Icon,
  palette,
  PressableScale,
  Screen,
  ScreenHeader,
  SectionLabel,
  StepIndicator,
  Text,
  type IconName,
  durations,
} from '@/design-system';
import { conditionLabels, type ListingCondition, type ListingIntent } from '@/features/catalog/domain/listing';
import { formatMoney } from '@/shared/lib/format';

import { usePublishDraft } from '../store/publish-draft.store';

const conditions = Object.keys(conditionLabels) as ListingCondition[];
const intents: { id: ListingIntent; label: string; icon: IconName }[] = [
  { id: 'sell', label: 'Vender', icon: 'creditCard' },
  { id: 'trade', label: 'Cambiar', icon: 'swap' },
  { id: 'gift', label: 'Regalar', icon: 'gift' },
];
const suggestions = ['Cámaras', 'Audífonos', 'Consolas', 'Patinetas', 'Libros'];

export function PublishDetailsScreen() {
  const draft = usePublishDraft();
  const [adding, setAdding] = useState(false);
  const price = Number(draft.price || 0);
  const sells = draft.intents.includes('sell');

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen
        aurora={[{ tint: 'violet', size: 420, right: -150, top: -160 }]}
        gap={14}
        footer={
          <Button
            label="Ver vista previa"
            disabled={!draft.title.trim() || draft.intents.length === 0}
            onPress={() => router.push('/publish/preview')}
          />
        }>
        <ScreenHeader center={<StepIndicator step={2} />} />

        <Field label="Título" value={draft.title} onChangeText={(title) => draft.update({ title })} maxLength={60} />

        <View style={styles.group}>
          <SectionLabel>Estado</SectionLabel>
          <View style={styles.wrap}>
            {conditions.map((c) => (
              <Chip
                key={c}
                size="sm"
                label={conditionLabels[c]}
                selected={draft.condition === c}
                onPress={() => draft.update({ condition: c })}
              />
            ))}
          </View>
        </View>

        <View style={styles.group}>
          <SectionLabel>¿Cómo la quieres mover?</SectionLabel>
          <View style={styles.intents}>
            {intents.map((intent) => {
              const on = draft.intents.includes(intent.id);
              return (
                <PressableScale
                  key={intent.id}
                  haptic="selection"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={intent.label}
                  onPress={() => draft.toggleIntent(intent.id)}
                  style={[styles.intent, on ? styles.intentOn : styles.intentOff]}>
                  <Icon name={intent.icon} size={20} color={on ? palette.violetSoft : colors.textMuted} strokeWidth={2.25} />
                  <Text variant={on ? 'bodyBold' : 'bodyStrong'} style={styles.intentLabel}>
                    {intent.label}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </View>

        {sells && (
          <View style={styles.group}>
            <SectionLabel>Precio</SectionLabel>
            <Field
              accessibilityLabel="Precio"
              value={price ? formatMoney(price) : ''}
              onChangeText={(text) => draft.update({ price: text.replace(/\D/g, '').slice(0, 7) })}
              keyboardType="number-pad"
              emphasis="display"
              placeholder="$0"
              containerStyle={styles.priceField}
              trailing={<Badge label="Justo: $2,800–3,300" icon="sparkleSolo" height={28} />}
            />
          </View>
        )}

        <View style={styles.group}>
          <SectionLabel>Me interesa a cambio</SectionLabel>
          <Animated.View layout={LinearTransition} style={styles.wrap}>
            {draft.wants.map((want) => (
              <Animated.View
                key={want}
                entering={FadeIn.duration(durations.fast)}
                exiting={ZoomOut.duration(150)}
                style={styles.want}>
                <Text variant="calloutStrong">{want}</Text>
                <PressableScale
                  accessibilityLabel={`Quitar ${want}`}
                  onPress={() => draft.removeWant(want)}
                  hitSlop={10}
                  style={styles.remove}>
                  <Icon name="close" size={12} strokeWidth={3} />
                </PressableScale>
              </Animated.View>
            ))}
            <PressableScale accessibilityLabel="Agregar interés" onPress={() => setAdding((a) => !a)} style={styles.addWant}>
              <Text variant="calloutStrong" color={colors.primaryInk} style={styles.bold}>
                + Agregar
              </Text>
            </PressableScale>
          </Animated.View>
          {adding && (
            <View style={styles.wrap}>
              {suggestions
                .filter((s) => !draft.wants.includes(s))
                .map((s) => (
                  <Chip key={s} size="sm" label={s} onPress={() => draft.addWant(s)} />
                ))}
            </View>
          )}
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  bold: { fontFamily: 'DMSans_700Bold' },
  group: { gap: 8 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  intents: { flexDirection: 'row', gap: 8 },
  intent: { flex: 1, height: 76, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  intentOn: { backgroundColor: colors.primaryTintStrong, borderColor: palette.violetSoft },
  intentOff: { backgroundColor: colors.surface, borderColor: colors.border },
  intentLabel: { fontSize: 14 },
  priceField: { borderWidth: 2, borderColor: colors.primary },
  want: {
    height: 36,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
  },
  remove: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWant: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: palette.violetSoft,
    justifyContent: 'center',
  },
});
