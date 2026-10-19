import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Aurora,
  auroraPresets,
  Button,
  colors,
  PressableScale,
  Reveal,
  ScreenHeader,
  StepIndicator,
  Text,
} from '@/design-system';
import { haptics } from '@/shared/lib/haptics';

import { OtpCells } from '../components/OtpCells';
import { formatPhone, OTP_LENGTH, OTP_RESEND_SECONDS } from '../domain/auth';
import { useRequestCode, useVerifyCode } from '../hooks/use-auth';
import { useCountdown } from '../hooks/use-countdown';
import { useSessionStore } from '../store/session.store';

export function VerifyCodeScreen() {
  const insets = useSafeAreaInsets();
  const phone = useSessionStore((s) => s.pendingPhone) || '9511234567';
  const [code, setCode] = useState('');
  const input = useRef<TextInput>(null);
  const verify = useVerifyCode();
  const resend = useRequestCode();
  const countdown = useCountdown(OTP_RESEND_SECONDS);

  // Focus after the push transition so the number pad reliably opens.
  useEffect(() => {
    const id = setTimeout(() => input.current?.focus(), 350);
    return () => clearTimeout(id);
  }, []);

  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const submit = (value = code) => {
    if (value.length < OTP_LENGTH) {
      haptics.warning();
      shake.set(withSequence(...[8, -8, 5, -5, 0].map((x) => withTiming(x, { duration: 50 }))));
      input.current?.focus();
      return;
    }
    verify.mutate(value, {
      onSuccess: () => {
        haptics.success();
        router.replace('/verify-identity');
      },
    });
  };

  const onChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    // Autofill from the SMS (or the last digit typed) submits on its own.
    if (digits.length === OTP_LENGTH) submit(digits);
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Aurora blobs={auroraPresets.topLeft} />
      <View style={[styles.top, { paddingTop: insets.top + 20 }]}>
        <ScreenHeader center={<StepIndicator step={2} />} />
        <Reveal style={styles.copy}>
          <Text variant="hero" accessibilityRole="header">
            Escribe el código
          </Text>
          <Text variant="bodyLg" color={colors.textSecondary}>
            Lo enviamos al{' '}
            <Text variant="bodyLg" style={styles.bold}>
              {formatPhone(phone)}
            </Text>
          </Text>
        </Reveal>

        {/* The cells are a visual mirror of a single system number-pad input (keeps SMS autofill working). */}
        <Pressable
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onPress={() => input.current?.focus()}>
          <Animated.View style={shakeStyle}>
            <OtpCells code={code} length={OTP_LENGTH} />
          </Animated.View>
        </Pressable>
        <TextInput
          ref={input}
          value={code}
          onChangeText={onChange}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={OTP_LENGTH}
          caretHidden
          accessibilityLabel={`Código de ${OTP_LENGTH} dígitos`}
          style={styles.hiddenInput}
        />

        <View style={styles.resend}>
          <Text variant="body" color={colors.textSecondary}>
            ¿No te llegó?
          </Text>
          <PressableScale
            disabled={!countdown.done}
            accessibilityLabel="Reenviar código"
            onPress={() => {
              resend.mutate({ phone, channel: 'sms' });
              countdown.restart();
            }}>
            <Text variant="bodyBold" color={colors.primaryInk}>
              {countdown.done ? 'Reenviar código' : `Reenviar en ${countdown.label}`}
            </Text>
          </PressableScale>
        </View>
      </View>

      <View style={styles.spacer} />
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
        <Button
          label={verify.isPending ? 'Verificando…' : 'Verificar'}
          variant="gradient"
          size="md"
          disabled={verify.isPending}
          onPress={() => submit()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: 24, gap: 24 },
  copy: { gap: 10, marginTop: 12 },
  bold: { fontFamily: 'DMSans_700Bold' },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  resend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { flex: 1, minHeight: 16 },
  footer: { paddingHorizontal: 20, paddingTop: 8 },
});
