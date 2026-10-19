import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Alert, Linking, StyleSheet } from 'react-native';

import {
  auroraPresets,
  Button,
  colors,
  ListGroup,
  ListRow,
  Reveal,
  Screen,
  ScreenHeader,
  SectionLabel,
  SegmentedControl,
  Switch,
} from '@/design-system';
import { useSessionStore } from '@/features/auth/store/session.store';
import { requestLocationAccess, useLocationPermission } from '@/shared/device/location';

import { usePreferencesStore, type Appearance } from '../store/preferences.store';

const appearanceOptions: { value: Appearance; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'auto', label: 'Auto' },
];

export function SettingsScreen() {
  const prefs = usePreferencesStore();
  const signOut = useSessionStore((s) => s.signOut);
  const identityVerified = useSessionStore((s) => s.identityVerified);
  const { data: locationStatus } = useLocationPermission();
  const queryClient = useQueryClient();

  const enableLocation = async () => {
    if (locationStatus === 'granted') return Linking.openSettings();
    await requestLocationAccess();
    queryClient.invalidateQueries({ queryKey: ['device'] });
  };

  const confirmSignOut = () =>
    Alert.alert('¿Cerrar sesión?', 'Tus cambios y mensajes se quedan guardados en tu cuenta.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/welcome');
        },
      },
    ]);

  return (
    <Screen aurora={auroraPresets.topRight} gap={12}>
      <ScreenHeader title="Ajustes" titleVariant="title3" />

      <Reveal style={styles.section}>
        <SectionLabel>Cuenta</SectionLabel>
        <ListGroup>
          <ListRow title="Datos personales" onPress={() => router.push('/profile')} />
          <ListRow
            title="Verificación"
            value={identityVerified ? 'Verificado' : 'Pendiente'}
            valueColor={identityVerified ? colors.success : colors.primaryInk}
            onPress={() => router.push('/verify-identity')}
          />
          <ListRow title="Métodos de pago" onPress={() => router.push('/payments')} />
        </ListGroup>
      </Reveal>

      <Reveal index={1} style={styles.section}>
        <SectionLabel>Preferencias</SectionLabel>
        <ListGroup>
          <ListRow
            title="Apariencia"
            height={64}
            trailing={
              <SegmentedControl
                compact
                height={34}
                label="Apariencia"
                options={appearanceOptions}
                value={prefs.appearance}
                onChange={(v) => prefs.set('appearance', v)}
              />
            }
          />
          <ListRow
            title="Notificaciones"
            trailing={
              <Switch label="Notificaciones" value={prefs.notifications} onValueChange={(v) => prefs.set('notifications', v)} />
            }
          />
          <ListRow title="Idioma" value="Español" />
        </ListGroup>
      </Reveal>

      <Reveal index={2} style={styles.section}>
        <SectionLabel>Privacidad</SectionLabel>
        <ListGroup>
          <ListRow
            title="Ubicación aproximada"
            subtitle="Muestra tu colonia, no tu calle"
            trailing={
              <Switch
                label="Ubicación aproximada"
                value={prefs.approximateLocation}
                onValueChange={(v) => prefs.set('approximateLocation', v)}
              />
            }
          />
          <ListRow
            title="Acceso a ubicación"
            value={locationStatus === 'granted' ? 'Activado' : 'Activar'}
            valueColor={locationStatus === 'granted' ? colors.success : colors.primaryInk}
            onPress={enableLocation}
          />
          <ListRow title="Cámara y fotos" value="Al usarlas" onPress={() => Linking.openSettings()} />
          <ListRow title="Contactos de emergencia" onPress={() => router.push('/safety')} />
        </ListGroup>
      </Reveal>

      <Button label="Cerrar sesión" variant="danger" size="md" onPress={confirmSignOut} style={styles.signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12, marginTop: 8 },
  signOut: { marginTop: 6 },
});
