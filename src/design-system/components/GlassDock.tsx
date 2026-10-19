import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '../tokens';

/**
 * Frosted floating container (tab bar, sticky action bars).
 * Uses a real blur on iOS and a translucent fill elsewhere.
 */
export function GlassDock({
  children,
  radius = radii.hero,
  style,
}: {
  children: ReactNode;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.shell, { borderRadius: radius }, style]}>
      {Platform.OS === 'ios' && <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />}
      <View style={[StyleSheet.absoluteFill, styles.tint]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#3C2878',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  tint: { backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.7)' : colors.surfaceStrong },
});
