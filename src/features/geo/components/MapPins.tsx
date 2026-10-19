import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, FadeIn } from 'react-native-reanimated';

import { colors, Icon, palette, PressableScale, shadows, Text, durations } from '@/design-system';

import type { MapPin } from '../domain/geo';

/** Pulsing halo for live entities (you, a provider en route). */
export function Pulse({ size, color }: { size: number; color: string }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }), -1);
  }, [t]);
  const style = useAnimatedStyle(() => ({ opacity: 0.6 * (1 - t.value), transform: [{ scale: 0.7 + t.value * 0.8 }] }));
  return (
    <Animated.View
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}
    />
  );
}

type PinProps = { pin: MapPin; scale: { x: number; y: number }; index: number };

export function MapPinView({ pin, scale, index }: PinProps) {
  const position = { left: pin.at.x * scale.x, top: pin.at.y * scale.y };
  const entering = FadeIn.delay(120 + index * 60).duration(durations.base);

  switch (pin.type) {
    case 'listing':
      return (
        <Animated.View entering={entering} style={[styles.abs, position]}>
          <PressableScale
            accessibilityLabel={`Ver publicación: ${pin.label}`}
            onPress={() => router.push({ pathname: '/listing/[id]', params: { id: pin.listingId } })}
            style={[
              styles.pricePin,
              pin.emphasis === 'ink' ? styles.inkPin : styles.glassPin,
              pin.emphasis === 'ink' && shadows.soft,
            ]}>
            <Text variant="footnoteBold" color={pin.emphasis === 'ink' ? colors.textInverse : colors.text}>
              {pin.label}
            </Text>
          </PressableScale>
        </Animated.View>
      );
    case 'provider':
      return (
        <Animated.View entering={entering} style={[styles.abs, position]}>
          <PressableScale
            accessibilityLabel={`Proveedor: ${pin.label}`}
            onPress={() => router.push({ pathname: '/provider/[id]', params: { id: pin.providerId } })}
            style={[styles.providerPin, shadows.glowViolet]}>
            <View style={styles.providerIcon}>
              <Icon name="wrench" size={16} color={palette.violet} strokeWidth={2.25} />
            </View>
            <Text variant="footnoteBold" color={palette.white}>
              {pin.label}
            </Text>
          </PressableScale>
        </Animated.View>
      );
    case 'safe_spot':
      return (
        <Animated.View
          entering={entering}
          style={[styles.abs, styles.halo, position, { backgroundColor: 'rgba(111,227,184,0.22)' }]}>
          <View style={styles.safeCore}>
            <Icon name="shield" size={16} color={colors.text} strokeWidth={2.5} label="Punto seguro" />
          </View>
        </Animated.View>
      );
    case 'me':
      return (
        <View accessible accessibilityLabel="Tu ubicación" style={[styles.abs, styles.halo, position]}>
          <Pulse size={48} color="rgba(181,140,255,0.45)" />
          <View style={styles.meDot} />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  abs: { position: 'absolute' },
  pricePin: { height: 34, paddingHorizontal: 12, borderRadius: 17, justifyContent: 'center' },
  inkPin: { backgroundColor: colors.text },
  glassPin: { backgroundColor: colors.surfaceStrong, borderWidth: 1, borderColor: colors.border },
  providerPin: {
    height: 38,
    paddingLeft: 4,
    paddingRight: 12,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.violet,
  },
  providerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  safeCore: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.violetSoft,
    borderWidth: 3,
    borderColor: palette.white,
  },
});
