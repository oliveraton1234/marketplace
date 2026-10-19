import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, spacing } from '../tokens';
import { PressableScale } from './PressableScale';

type Tone = 'glass' | 'solid' | 'mint' | 'pink' | 'violet' | 'clear';

export type SurfaceProps = {
  children: ReactNode;
  tone?: Tone;
  radius?: number;
  padding?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Frosted card used for every grouped block of content. Becomes pressable when `onPress` is set. */
export function Surface({
  children,
  tone = 'glass',
  radius = radii.xl,
  padding = spacing.lg,
  onPress,
  accessibilityLabel,
  style,
}: SurfaceProps) {
  const base = [toneStyles[tone], { borderRadius: radius, padding }, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <PressableScale onPress={onPress} pressedScale={0.98} accessibilityLabel={accessibilityLabel} style={base}>
      {children}
    </PressableScale>
  );
}

const toneStyles = StyleSheet.create({
  glass: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  solid: { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border },
  mint: { backgroundColor: colors.accentTintSoft, borderWidth: 1, borderColor: 'rgba(111,227,184,0.30)' },
  pink: { backgroundColor: colors.pinkTint, borderWidth: 1, borderColor: 'rgba(255,111,216,0.28)' },
  violet: { backgroundColor: colors.primaryTintStrong, borderWidth: 1, borderColor: 'rgba(181,140,255,0.7)' },
  clear: { backgroundColor: 'transparent' },
});
