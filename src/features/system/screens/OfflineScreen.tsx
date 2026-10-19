import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Aurora, Badge, Button, colors, Icon, Reveal, Text } from '@/design-system';

/** Full-screen offline state. Pending actions are queued and retried. */
export function OfflineScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Aurora
        blobs={[
          { tint: 'violet', size: 300, left: -60, top: 170, falloff: 0.64 },
          { tint: 'pink', size: 280, right: -60, top: 230, falloff: 0.64 },
        ]}
      />
      <View style={styles.center}>
        <View style={styles.tile}>
          <Icon name="wifiOff" size={64} color={colors.primaryInk} strokeWidth={1.6} />
        </View>
        <Reveal index={1} style={styles.copy}>
          <Text variant="title3" align="center" accessibilityRole="header">
            Sin conexión
          </Text>
          <Text variant="body" color={colors.textSecondary} align="center">
            Tus mensajes y ofertas se guardan y se envían solos cuando vuelva el internet.
          </Text>
        </Reveal>
        <Badge label="2 mensajes en espera" icon="check" height={34} style={styles.badge} />
      </View>
      <View style={[styles.actions, { paddingBottom: insets.bottom + 24 }]}>
        <Button label="Reintentar" leadingIcon="refresh" onPress={() => router.replace('/home')} />
        <Button label="Ver mis cambios guardados" variant="link" onPress={() => router.push('/trades')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 22 },
  tile: {
    transform: [{ rotate: '-6deg' }],
    width: 140,
    height: 140,
    borderRadius: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { gap: 8 },
  badge: { alignSelf: 'center' },
  actions: { paddingHorizontal: 24, gap: 4 },
});
