import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Aurora, auroraPresets, Button, colors, GradientText, LogoMark, Reveal, shadows, Text, Wordmark } from '@/design-system';

function LogoTile() {
  return (
    <View style={[styles.logoTile, shadows.soft]}>
      <LogoMark size={112} />
    </View>
  );
}

export function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const goToSignUp = () => router.push('/sign-up');

  return (
    <View style={styles.root}>
      <Aurora blobs={auroraPresets.welcome} />
      <View style={[styles.brand, { paddingTop: insets.top }]}>
        <Reveal from="fade">
          <LogoTile />
        </Reveal>
        <Reveal index={2}>
          <Wordmark />
        </Reveal>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <Reveal index={3} style={styles.copy}>
          <Text variant="hero" accessibilityRole="header">
            Cambia lo que no usas.
          </Text>
          <GradientText variant="hero">Contrata a quien sabe.</GradientText>
          <Text variant="bodyLg" color={colors.textSecondary} style={styles.lede}>
            Objetos, servicios y personas cerca de ti. Sin complicaciones.
          </Text>
        </Reveal>
        <Reveal index={5} style={styles.actions}>
          <Button label="Crear cuenta gratis" trailingIcon="arrowRight" onPress={goToSignUp} />
          <Button label="Usar mi número de teléfono" variant="secondary" onPress={goToSignUp} />
        </Reveal>
        <Reveal index={6}>
          <Text variant="footnote" color={colors.textTertiary} align="center">
            Al continuar aceptas los Términos y el Aviso de privacidad
          </Text>
        </Reveal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  brand: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  logoTile: {
    width: 168,
    height: 168,
    borderRadius: 56,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: { paddingHorizontal: 24, gap: 22 },
  copy: { gap: 0 },
  lede: { marginTop: 10 },
  actions: { gap: 10 },
});
