import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, colors, gradients, Icon, palette, radii, Text } from '@/design-system';
import { permissionCopy, usePrimerStore } from '@/shared/device/permissions';

/**
 * Explains why a permission is needed before iOS/Android show their own prompt,
 * and how to revoke it later. Mounted once at the root.
 */
export function PermissionPrimerHost() {
  const insets = useSafeAreaInsets();
  const request = usePrimerStore((s) => s.request);
  const setRequest = usePrimerStore((s) => s.set);

  const close = (accepted: boolean) => {
    request?.resolve(accepted);
    setRequest(null);
  };

  const copy = request ? permissionCopy[request.kind] : null;
  const denied = request?.mode === 'denied';

  return (
    <Modal visible={Boolean(request)} transparent animationType="fade" statusBarTranslucent onRequestClose={() => close(false)}>
      <Pressable style={styles.backdrop} onPress={() => close(false)} accessibilityLabel="Cerrar" />
      {copy && (
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]} accessibilityViewIsModal>
          <View style={styles.grabber} />
          <LinearGradient colors={gradients.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.icon}>
            <Icon name={copy.icon} size={28} color={palette.white} />
          </LinearGradient>
          <Text variant="title4" align="center" accessibilityRole="header">
            {denied ? `Activa el permiso para ${copy.title.charAt(0).toLowerCase()}${copy.title.slice(1)}` : copy.title}
          </Text>
          <Text variant="callout" color={colors.textSecondary} align="center">
            {denied ? 'Lo desactivaste antes. Puedes activarlo en Ajustes de tu teléfono.' : 'SwapIt lo usa para:'}
          </Text>

          <View style={styles.uses}>
            {copy.uses.map((use) => (
              <View key={use} style={styles.use}>
                <View style={styles.check}>
                  <Icon name="check" size={12} color={colors.text} strokeWidth={3} />
                </View>
                <Text variant="body" style={styles.flex}>
                  {use}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.privacy}>
            <Icon name="lock" size={16} color={colors.success} strokeWidth={2.25} />
            <Text variant="footnote" color={colors.textSecondary} style={styles.flex}>
              {copy.privacy} Puedes cambiar este permiso cuando quieras en Ajustes. Consulta el Aviso de privacidad para más
              detalles.
            </Text>
          </View>

          <View style={styles.actions}>
            <Button label={denied ? 'Abrir Ajustes' : 'Continuar'} onPress={() => close(true)} />
            <Button label="Ahora no" variant="link" onPress={() => close(false)} />
          </View>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(13,11,20,0.45)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingHorizontal: 24,
    gap: 14,
    alignItems: 'center',
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    backgroundColor: colors.surfaceSolid,
  },
  grabber: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.borderStrong, marginBottom: 6 },
  icon: { width: 64, height: 64, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  uses: { alignSelf: 'stretch', gap: 10, marginTop: 4 },
  use: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacy: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: radii.lg,
    backgroundColor: colors.accentTintSoft,
  },
  actions: { alignSelf: 'stretch', gap: 2, marginTop: 4 },
});
