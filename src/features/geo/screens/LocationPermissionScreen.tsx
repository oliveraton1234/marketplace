import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Aurora, Button, colors, gradients, Icon, palette, Reveal, shadows, Text, type IconName } from '@/design-system';
import { useQueryClient } from '@tanstack/react-query';

import { useSessionStore } from '@/features/auth/store/session.store';
import { requestLocationAccess } from '@/shared/device/location';

const perks: { icon: IconName; bg: string; fg: string; label: string }[] = [
  { icon: 'map', bg: colors.primaryTintBold, fg: colors.primaryInk, label: 'Distancias reales a cada objeto' },
  { icon: 'shield', bg: colors.accentTint, fg: colors.success, label: 'Puntos de encuentro seguros' },
  { icon: 'eyeOff', bg: colors.pinkTintMd, fg: colors.danger, label: 'Nunca mostramos tu calle exacta' },
];

/** Expanding sonar ring behind the pin. */
function Ripple({ delay }: { delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withTiming(1, { duration: 2600, easing: Easing.out(Easing.quad) }), -1));
  }, [delay, t]);
  const style = useAnimatedStyle(() => ({ opacity: 1 - t.value, transform: [{ scale: 0.6 + t.value * 0.9 }] }));
  return <Animated.View style={[styles.ripple, style]} />;
}

export function LocationPermissionScreen() {
  const insets = useSafeAreaInsets();
  const signedIn = useSessionStore((s) => Boolean(s.session));
  const signIn = useSessionStore((s) => s.signIn);
  const queryClient = useQueryClient();

  const finish = () => {
    if (!signedIn) signIn({ userId: 'u-daniel', token: 'local-session' });
    router.replace('/home');
  };

  const allow = async () => {
    try {
      await requestLocationAccess({ skipPrimer: true });
      queryClient.invalidateQueries({ queryKey: ['device'] });
    } finally {
      finish();
    }
  };

  return (
    <View style={styles.root}>
      <Aurora blobs={[{ tint: 'mint', size: 470, left: -40, top: insets.top - 20, falloff: 0.62 }]} />
      <View style={[styles.stage, { marginTop: insets.top + 40 }]}>
        <View style={[styles.orbit, { width: 300, height: 300, borderRadius: 150 }]} />
        <View style={[styles.orbit, { width: 220, height: 220, borderRadius: 110 }]} />
        <Ripple delay={0} />
        <Ripple delay={1300} />
        <Reveal from="fade">
          <LinearGradient
            colors={gradients.cta}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.pin, shadows.glowViolet]}>
            <Icon name="pin" size={54} color={palette.white} strokeWidth={1.8} />
          </LinearGradient>
        </Reveal>
        <View style={[styles.spark, { left: 25, top: 60, width: 14, height: 14, backgroundColor: palette.violetSoft }]} />
        <View style={[styles.spark, { right: 40, top: 180, width: 12, height: 12, backgroundColor: palette.mint }]} />
        <View style={[styles.spark, { right: 60, top: 30, width: 10, height: 10, backgroundColor: palette.pink }]} />
      </View>

      <View style={styles.copy}>
        <Reveal index={2} style={styles.titles}>
          <Text variant="title2" accessibilityRole="header">
            Encuentra cosas cerca de ti
          </Text>
          <Text variant="body" color={colors.textSecondary}>
            Usamos tu ubicación solo mientras usas la app.
          </Text>
        </Reveal>
        <View style={styles.perks}>
          {perks.map((perk, i) => (
            <Reveal key={perk.label} index={3 + i} style={styles.perk}>
              <View style={[styles.perkIcon, { backgroundColor: perk.bg }]}>
                <Icon name={perk.icon} size={18} color={perk.fg} strokeWidth={2.25} />
              </View>
              <Text variant="bodyStrong">{perk.label}</Text>
            </Reveal>
          ))}
        </View>
      </View>

      <View style={styles.spacer} />
      <View style={[styles.actions, { paddingBottom: insets.bottom + 24 }]}>
        <Button label="Permitir ubicación" onPress={allow} />
        <Button label="Ahora no" variant="link" onPress={finish} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  stage: { alignSelf: 'center', width: 300, height: 300, alignItems: 'center', justifyContent: 'center' },
  orbit: { position: 'absolute', borderWidth: 1, borderColor: colors.border },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(123,63,242,0.25)',
  },
  pin: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  spark: { position: 'absolute', borderRadius: 999 },
  copy: { paddingHorizontal: 24, marginTop: 24, gap: 18 },
  spacer: { flex: 1 },
  titles: { gap: 8 },
  perks: { gap: 12 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  perkIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actions: { paddingHorizontal: 24, paddingTop: 16, gap: 4 },
});
