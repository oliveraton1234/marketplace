import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import {
  auroraPresets,
  colors,
  Field,
  gradients,
  Icon,
  palette,
  PressableScale,
  Reveal,
  Screen,
  ScreenHeader,
  SectionLabel,
  Text,
  type IconName,
  durations,
} from '@/design-system';

const topics: { label: string; icon: IconName; color: string; href: Href }[] = [
  { label: 'Cambios y ofertas', icon: 'swap', color: palette.violet, href: '/trades' },
  { label: 'Pagos y créditos', icon: 'creditCard', color: palette.forest, href: '/payments' },
  { label: 'Servicios', icon: 'wrench', color: palette.violetNight, href: '/services' },
  { label: 'Seguridad', icon: 'shield', color: palette.berry, href: '/safety' },
];

const faqs = [
  {
    q: '¿Cómo funciona un cambio con efectivo?',
    a: 'Eliges lo que das, agregas efectivo si hace falta y el medidor te dice si el cambio es justo. El efectivo se entrega en persona o se protege en la app hasta cerrar el trato.',
  },
  {
    q: '¿Cuándo se libera mi pago?',
    a: 'Cuando confirmas que el servicio terminó o que recibiste el objeto. Mientras tanto queda protegido.',
  },
  {
    q: 'Cancelar un servicio agendado',
    a: 'Desde Mis cambios abre el servicio y toca Cancelar. Sin costo si faltan más de 2 horas.',
  },
];

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Animated.View layout={LinearTransition.duration(durations.base)} style={styles.faq}>
      <PressableScale
        pressedScale={0.99}
        accessibilityState={{ expanded: open }}
        accessibilityLabel={q}
        onPress={() => setOpen((o) => !o)}
        style={styles.faqRow}>
        <Text variant="bodyStrong" style={styles.flex}>
          {q}
        </Text>
        <View style={open && styles.chevronOpen}>
          <Icon name="chevronRight" size={18} color={colors.textMuted} strokeWidth={2.25} />
        </View>
      </PressableScale>
      {open && (
        <Animated.View entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)}>
          <Text variant="callout" color={colors.textSecondary} style={styles.answer}>
            {a}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export function HelpScreen() {
  const [query, setQuery] = useState('');
  const visibleFaqs = useMemo(() => faqs.filter((f) => f.q.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  return (
    <Screen
      aurora={auroraPresets.dual}
      gap={16}
      footer={
        <PressableScale
          accessibilityLabel="Habla con una persona. Respondemos en unos 5 minutos"
          onPress={() => router.push({ pathname: '/chats/[id]', params: { id: 'c-support' } })}>
          <LinearGradient colors={gradients.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.human}>
            <View style={styles.flex}>
              <Text variant="bodyBold" color={palette.white} style={styles.lg}>
                Habla con una persona
              </Text>
              <Text variant="footnote" color={palette.violetHaze}>
                Respondemos en unos 5 minutos
              </Text>
            </View>
            <View style={styles.humanIcon}>
              <Icon name="message" size={22} color={palette.violetNight} />
            </View>
          </LinearGradient>
        </PressableScale>
      }>
      <ScreenHeader />
      <Text variant="title2" accessibilityRole="header">
        ¿En qué te ayudamos?
      </Text>
      <Field
        shape="pill"
        icon="search"
        placeholder="Escribe tu duda"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
      />
      <View style={styles.grid}>
        {topics.map((t, i) => (
          <Reveal key={t.label} index={i} style={styles.cell}>
            <PressableScale accessibilityLabel={t.label} onPress={() => router.push(t.href)} style={styles.topic}>
              <View style={[styles.topicIcon, { backgroundColor: t.color }]}>
                <Icon name={t.icon} size={20} color={palette.white} strokeWidth={2.25} />
              </View>
              <Text variant="bodyBold">{t.label}</Text>
            </PressableScale>
          </Reveal>
        ))}
      </View>
      <SectionLabel>Preguntas frecuentes</SectionLabel>
      <View>
        {visibleFaqs.map((f) => (
          <Faq key={f.q} {...f} />
        ))}
        {!visibleFaqs.length && (
          <Text variant="callout" color={colors.textSecondary}>
            No encontramos esa duda. Escríbenos y te ayudamos.
          </Text>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  lg: { fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  cell: { width: '50%', padding: 5 },
  topic: { padding: 16, gap: 14, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  topicIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  faq: { borderBottomWidth: 1, borderBottomColor: colors.border },
  faqRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 12 },
  chevronOpen: { transform: [{ rotate: '90deg' }] },
  answer: { paddingBottom: 14 },
  human: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingLeft: 16, borderRadius: 28 },
  humanIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
