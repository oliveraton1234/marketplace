import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import {
  auroraPresets,
  Button,
  CheckboxRow,
  colors,
  Field,
  Icon,
  PressableScale,
  radii,
  Reveal,
  Screen,
  ScreenHeader,
  StepIndicator,
  Text,
} from '@/design-system';
import { usePreferencesStore } from '@/features/settings/store/preferences.store';

import { defaultCountry, formatPhone, isValidPhone } from '../domain/auth';
import { useRequestCode } from '../hooks/use-auth';

export function SignUpScreen() {
  const [phone, setPhone] = useState('9511234567');
  const whatsappOffers = usePreferencesStore((s) => s.whatsappOffers);
  const setPreference = usePreferencesStore((s) => s.set);
  const requestCode = useRequestCode();
  const valid = isValidPhone(phone);

  const submit = (channel: 'sms' | 'email') =>
    requestCode.mutate({ phone, channel }, { onSuccess: () => router.push('/verify-code') });

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen
        aurora={[...auroraPresets.topRight, { tint: 'mint', size: 420, left: -160, bottom: -120 }]}
        gap={26}
        contentStyle={styles.content}
        footer={
          <View style={styles.footer}>
            <Button
              label={requestCode.isPending ? 'Enviando…' : 'Enviar código'}
              trailingIcon="arrowRight"
              disabled={!valid || requestCode.isPending}
              onPress={() => submit('sms')}
            />
            <Button label="Prefiero usar mi correo" variant="link" onPress={() => submit('email')} />
          </View>
        }>
        <ScreenHeader center={<StepIndicator step={1} />} />
        <Reveal style={styles.copy}>
          <Text variant="hero" accessibilityRole="header">
            ¿Cuál es tu número?
          </Text>
          <Text variant="bodyLg" color={colors.textSecondary}>
            Te mandamos un código para entrar. Nunca lo mostramos a otras personas.
          </Text>
        </Reveal>
        <Reveal index={1} style={styles.phoneRow}>
          <PressableScale accessibilityLabel={`País ${defaultCountry.iso} ${defaultCountry.dial}`} style={styles.country}>
            <Text variant="bodyBold" style={styles.countryText}>
              {defaultCountry.iso} {defaultCountry.dial}
            </Text>
            <Icon name="chevronDown" size={16} strokeWidth={2.25} />
          </PressableScale>
          <Field
            value={formatPhone(phone)}
            onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            accessibilityLabel="Número de teléfono"
            emphasis="display"
            height={64}
            containerStyle={styles.phoneField}
          />
        </Reveal>
        <Reveal index={2}>
          <CheckboxRow
            label="Avísame de nuevas ofertas por WhatsApp"
            checked={whatsappOffers}
            onChange={(value) => setPreference('whatsappOffers', value)}
          />
        </Reveal>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 24 },
  copy: { gap: 10, marginTop: 20 },
  phoneRow: { flexDirection: 'row', gap: 10 },
  country: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: radii.lg + 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryText: { fontSize: 17 },
  phoneField: { flex: 1, borderRadius: radii.lg + 2 },
  footer: { gap: 4 },
});
