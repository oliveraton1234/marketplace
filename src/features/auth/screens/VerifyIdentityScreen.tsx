import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import {
  Button,
  colors,
  Icon,
  ListGroup,
  palette,
  Reveal,
  Screen,
  ScreenHeader,
  shadows,
  StepIndicator,
  Text,
  PressableScale,
} from '@/design-system';

import { captureWithCamera } from '@/shared/device/media';
import { haptics } from '@/shared/lib/haptics';

import { useSessionStore } from '../store/session.store';

const steps = [
  { label: 'INE de frente', done: true },
  { label: 'INE de reverso', done: true },
  { label: 'Selfie', done: false },
];

/** Dashed ring slowly rotating around the selfie target. */
function ScanRing() {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 14000, easing: Easing.linear }), -1);
  }, [rotation]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Svg width={210} height={210}>
        <Circle cx={105} cy={105} r={103} stroke={palette.violetSoft} strokeWidth={3} strokeDasharray="9 7" fill="none" />
      </Svg>
    </Animated.View>
  );
}

export function VerifyIdentityScreen() {
  const markVerified = useSessionStore((s) => s.markIdentityVerified);
  const [selfie, setSelfie] = useState<string>();
  const allSteps = steps.map((step) => (step.label === 'Selfie' ? { ...step, done: Boolean(selfie) } : step));

  const takeSelfie = async () => {
    const [photo] = await captureWithCamera({ front: true });
    if (!photo) return;
    haptics.success();
    setSelfie(photo.uri);
    markVerified();
  };

  return (
    <Screen
      aurora={[
        { tint: 'violet', size: 390, left: 0, top: 120, falloff: 0.62 },
        { tint: 'mint', size: 360, right: -140, bottom: 40 },
      ]}
      gap={20}
      contentStyle={styles.content}
      footer={
        <View style={styles.footer}>
          {selfie ? (
            <Button label="Continuar" trailingIcon="arrowRight" onPress={() => router.push('/location-permission')} />
          ) : (
            <Button label="Tomar selfie" leadingIcon="camera" onPress={takeSelfie} />
          )}
          <Button label="Hacerlo después" variant="link" onPress={() => router.push('/location-permission')} />
        </View>
      }>
      <ScreenHeader center={<StepIndicator step={3} />} />
      <Reveal style={styles.copy}>
        <Text variant="title2" align="center" accessibilityRole="header">
          Verifica tu identidad
        </Text>
        <Text variant="body" color={colors.textSecondary} align="center">
          Así la gente sabe que eres real. Toma menos de un minuto.
        </Text>
      </Reveal>
      <Reveal index={1} from="fade" style={styles.targetWrap}>
        <View style={styles.target}>
          <ScanRing />
          <View style={styles.face}>
            {selfie ? (
              <Image source={{ uri: selfie }} style={styles.selfie} contentFit="cover" accessibilityLabel="Tu selfie" />
            ) : (
              <Icon name="userOutline" size={84} color={colors.primaryInk} strokeWidth={1.5} />
            )}
          </View>
          <PressableScale
            accessibilityLabel={selfie ? 'Tomar otra selfie' : 'Tomar selfie'}
            onPress={takeSelfie}
            style={[styles.cameraBadge, shadows.glowViolet]}>
            <Icon name={selfie ? 'refresh' : 'camera'} size={22} color={palette.white} />
          </PressableScale>
        </View>
      </Reveal>
      <Reveal index={2}>
        <ListGroup>
          {allSteps.map((step, i) => (
            <View key={step.label} style={styles.step}>
              <View style={[styles.stepDot, step.done ? styles.stepDone : styles.stepTodo]}>
                {step.done ? (
                  <Icon name="check" size={14} color={colors.text} strokeWidth={3.5} />
                ) : (
                  <Text variant="footnoteBold" color={colors.primaryInk}>
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text variant="bodyStrong" style={styles.flex}>
                {step.label}
              </Text>
              <Text variant="footnoteBold" color={step.done ? colors.success : colors.primaryInk}>
                {step.done ? 'Listo' : 'Falta'}
              </Text>
            </View>
          ))}
        </ListGroup>
      </Reveal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  selfie: { width: '100%', height: '100%' },
  content: { paddingHorizontal: 24 },
  copy: { gap: 8 },
  targetWrap: { alignItems: 'center' },
  target: { width: 210, height: 210, alignItems: 'center', justifyContent: 'center' },
  face: {
    overflow: 'hidden',
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    right: 8,
    bottom: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepDone: { backgroundColor: colors.accent },
  stepTodo: { borderWidth: 2, borderColor: '#B58CFF' },
  flex: { flex: 1 },
  footer: { gap: 4 },
});
