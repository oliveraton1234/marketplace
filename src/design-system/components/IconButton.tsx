import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, gradients, shadows } from '../tokens';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';

type Variant = 'glass' | 'solid' | 'tint' | 'gradient' | 'plain';

export type IconButtonProps = {
  icon: IconName;
  /** Required: icon-only buttons must be labelled for VoiceOver/TalkBack. */
  label: string;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  variant?: Variant;
  color?: string;
  badge?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  label,
  onPress,
  size = 44,
  iconSize = 22,
  variant = 'glass',
  color,
  badge,
  style,
}: IconButtonProps) {
  const fg = color ?? (variant === 'solid' || variant === 'gradient' ? colors.textInverse : colors.text);
  const shape: ViewStyle = { width: size, height: size, borderRadius: size / 2 };
  const glyph = <Icon name={icon} size={iconSize} color={fg} strokeWidth={2.25} />;

  return (
    <PressableScale
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={size < 44 ? (44 - size) / 2 : 0}
      style={[shape, variant === 'gradient' && shadows.glowViolet, style]}>
      {variant === 'gradient' ? (
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.center, shape]}>
          {glyph}
        </LinearGradient>
      ) : (
        <View style={[styles.center, shape, variantStyles[variant]]}>{glyph}</View>
      )}
      {badge}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});

const variantStyles = StyleSheet.create({
  glass: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  solid: { backgroundColor: colors.text },
  tint: { backgroundColor: colors.primaryTint },
  gradient: {},
  plain: {},
});
