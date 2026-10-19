import { router, type Href } from 'expo-router';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import {
  auroraPresets,
  Avatar,
  Badge,
  Button,
  colors,
  Icon,
  IconButton,
  palette,
  PressableScale,
  ProgressBar,
  Reveal,
  Screen,
  screenGutter,
  SectionLabel,
  Skeleton,
  StatTile,
  Surface,
  Text,
  useCountUp,
  type IconName,
} from '@/design-system';
import { TAB_BAR_SPACE } from '@/features/navigation/FloatingTabBar';
import { formatMoney, formatNumber } from '@/shared/lib/format';

import { useMe } from '../hooks/use-me';

const shortcuts: { label: string; icon: IconName; color: string; href: Href }[] = [
  { label: 'Mis cambios', icon: 'swap', color: palette.violetSoft, href: '/trades' },
  { label: 'Modo proveedor', icon: 'wrench', color: palette.mint, href: '/provider-mode' },
  { label: 'Ayuda', icon: 'help', color: palette.magenta, href: '/help' },
];

function CreditsCard({ credits, value, thisWeek }: { credits: number; value: number; thisWeek: number }) {
  const shown = useCountUp(credits);
  return (
    <Surface radius={28} padding={18} style={styles.credits}>
      <Svg width={200} height={200} style={styles.creditsGlow}>
        <Defs>
          <RadialGradient id="creditsGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={palette.violetSoft} stopOpacity={0.28} />
            <Stop offset="0.7" stopColor={palette.violetSoft} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={100} cy={100} r={100} fill="url(#creditsGlow)" />
      </Svg>
      <View style={styles.rowBetween}>
        <SectionLabel color={colors.primaryInk}>Créditos Swap</SectionLabel>
        <Badge label={`+${thisWeek} esta semana`} />
      </View>
      <View
        style={styles.creditsValue}
        accessible
        accessibilityLabel={`${formatNumber(credits)} créditos, equivalen a ${formatMoney(value)}`}>
        <Text variant="bigNumber">{formatNumber(shown)}</Text>
        <Text variant="callout" color={colors.textSecondary}>
          ≈ {formatMoney(value)} para cambios o servicios
        </Text>
      </View>
      <View style={styles.creditActions}>
        <Button label="Usar créditos" size="sm" style={styles.flex} onPress={() => router.push('/payments')} />
        <Button
          label="Invitar y ganar"
          size="sm"
          variant="outline"
          style={styles.flex}
          onPress={() => Share.share({ message: 'Únete a SwapIt y gana créditos en tu primer cambio' })}
        />
      </View>
    </Surface>
  );
}

export function ProfileScreen() {
  const { data: me } = useMe();

  return (
    <Screen aurora={auroraPresets.dual} gap={16} bottomInset={TAB_BAR_SPACE}>
      <View style={styles.topActions}>
        <IconButton
          icon="share"
          label="Compartir perfil"
          iconSize={20}
          onPress={() => Share.share({ message: 'Mi perfil en SwapIt' })}
        />
        <IconButton icon="bell" label="Avisos" iconSize={20} onPress={() => router.push('/notifications')} />
        <IconButton icon="sliders" label="Ajustes" iconSize={20} onPress={() => router.push('/settings')} />
      </View>

      {!me ? (
        <View style={styles.loading}>
          <Skeleton height={92} width={92} radius={46} />
          <Skeleton height={160} radius={28} />
        </View>
      ) : (
        <>
          <Reveal style={styles.identity}>
            <View>
              <Avatar initials={me.initials} size={92} ring="warm" gap={4} />
              <View style={styles.level}>
                <Text variant="captionBold" color={colors.textInverse}>
                  Nivel {me.level}
                </Text>
              </View>
            </View>
            <View style={styles.identityText}>
              <View style={styles.nameRow}>
                <Text variant="title3" accessibilityRole="header">
                  {me.name}
                </Text>
                {me.verified && <Icon name="verified" size={20} color={colors.accent} label="Verificado" />}
              </View>
              <Text variant="callout" color={colors.textSecondary}>
                {me.title} · {me.city}
              </Text>
              <ProgressBar value={me.levelProgress} label={`Progreso al nivel ${me.level + 1}`} />
              <Text variant="caption" color={colors.textTertiary}>
                {me.tradesToNextLevel} cambios más para Nivel {me.level + 1}
              </Text>
            </View>
          </Reveal>

          <Reveal index={1}>
            <CreditsCard credits={me.credits} value={me.creditsValue} thisWeek={me.creditsThisWeek} />
          </Reveal>

          <Reveal index={2} style={styles.stats}>
            <StatTile value={String(me.stats.trades)} label="Cambios" />
            <StatTile value={String(me.rating)} label={`${me.stats.reviews} reseñas`} />
            <StatTile value={`${me.stats.reusedKg} kg`} label="reusados" tone="mint" />
          </Reveal>

          <Reveal index={3} style={styles.badges}>
            <SectionLabel>Insignias</SectionLabel>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.bleed}
              contentContainerStyle={styles.badgeRail}>
              {me.badges.map((badge) => (
                <View key={badge.id} style={styles.badge}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                    <Icon name={badge.icon} size={14} color={palette.white} strokeWidth={2.5} />
                  </View>
                  <Text variant="footnote" style={styles.badgeText}>
                    {badge.label}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </Reveal>

          <Reveal index={4} style={styles.shortcuts}>
            {shortcuts.map((s) => (
              <PressableScale
                key={s.label}
                accessibilityLabel={s.label}
                onPress={() => router.push(s.href)}
                style={styles.shortcut}>
                <Icon name={s.icon} size={20} color={s.color} strokeWidth={2.25} />
                <Text variant="footnoteBold">{s.label}</Text>
              </PressableScale>
            ))}
          </Reveal>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: { gap: 16 },
  topActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: -18 },
  level: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.text,
    justifyContent: 'center',
  },
  identityText: { flex: 1, gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  credits: { gap: 14, overflow: 'hidden', marginTop: 6 },
  creditsGlow: { position: 'absolute', right: -50, top: -70 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  creditsValue: { flexDirection: 'row', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' },
  creditActions: { flexDirection: 'row', gap: 8 },
  stats: { flexDirection: 'row', gap: 8 },
  badges: { gap: 10 },
  bleed: { marginHorizontal: -screenGutter },
  badgeRail: { gap: 8, paddingHorizontal: screenGutter },
  badge: {
    height: 40,
    paddingLeft: 6,
    paddingRight: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeIcon: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: 'DMSans_600SemiBold' },
  shortcuts: { flexDirection: 'row', gap: 8 },
  shortcut: {
    flex: 1,
    padding: 12,
    gap: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
