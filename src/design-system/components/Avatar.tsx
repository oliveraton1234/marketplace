import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, gradients, palette } from '../tokens';
import { Text } from './Text';

export type AvatarProps = {
  initials: string;
  size?: number;
  /** Fill color behind the initials. */
  color?: string;
  textColor?: string;
  /** Aurora ring around the avatar (verified / featured users). */
  ring?: 'brand' | 'warm' | 'mint' | false;
  /** Gap between ring and avatar, painted with the screen background. */
  gap?: number;
  children?: ReactNode;
  accessibilityLabel?: string;
};

const ringStops = {
  brand: gradients.ring,
  warm: gradients.ringWarm,
  mint: [palette.mint, palette.violet, palette.mint] as const,
};

export function Avatar({
  initials,
  size = 46,
  color = palette.violetHaze,
  textColor,
  ring = false,
  gap = 0,
  children,
  accessibilityLabel,
}: AvatarProps) {
  const fg = textColor ?? (color === palette.violetHaze ? palette.violetNight : palette.white);
  const ringWidth = ring ? Math.max(2, Math.round(size / 30)) : 0;
  const inner = size - ringWidth * 2;
  const fontSize = Math.round(size * 0.32);

  const face = (
    <View
      style={[
        styles.center,
        {
          width: inner,
          height: inner,
          borderRadius: inner / 2,
          backgroundColor: color,
          borderWidth: gap,
          borderColor: colors.background,
        },
      ]}>
      <Text variant="headline" color={fg} style={{ fontSize, lineHeight: fontSize * 1.2 }}>
        {initials}
      </Text>
    </View>
  );

  return (
    <View accessible accessibilityLabel={accessibilityLabel ?? initials} style={{ width: size, height: size }}>
      {ring ? (
        <LinearGradient
          colors={ringStops[ring]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.center, { width: size, height: size, borderRadius: size / 2 }]}>
          {face}
        </LinearGradient>
      ) : (
        face
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
