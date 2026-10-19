import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, gradients, radii, shadows, spacing } from '../tokens';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

type Variant = 'primary' | 'gradient' | 'secondary' | 'outline' | 'onDark' | 'link' | 'accent' | 'inverse' | 'danger';
type Size = 'lg' | 'md' | 'sm';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  trailingIcon?: IconName;
  leadingIcon?: IconName;
  /** Extra content rendered after the label (e.g. a reward pill). */
  accessory?: ReactNode;
  disabled?: boolean;
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

const heights: Record<Size, number> = { lg: 58, md: 54, sm: 44 };

const foreground: Record<Variant, string> = {
  primary: colors.textInverse,
  gradient: colors.surfaceSolid,
  secondary: colors.text,
  outline: colors.text,
  onDark: colors.surfaceSolid,
  link: colors.primaryInk,
  // Ink on mint: paper-on-mint fails WCAG contrast.
  accent: colors.text,
  inverse: '#3B1B8F',
  danger: colors.danger,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  trailingIcon,
  leadingIcon,
  accessory,
  disabled,
  glow,
  style,
  accessibilityHint,
}: ButtonProps) {
  const height = variant === 'link' ? 44 : heights[size];
  const fg = foreground[variant];
  const content = (
    <View style={styles.row}>
      {leadingIcon && <Icon name={leadingIcon} size={18} color={fg} strokeWidth={2.5} />}
      <Text variant={size === 'sm' ? 'calloutStrong' : 'bodyBold'} color={fg} style={size !== 'sm' && styles.labelLg}>
        {label}
      </Text>
      {accessory}
      {trailingIcon && <Icon name={trailingIcon} size={20} color={fg} strokeWidth={2.25} />}
    </View>
  );

  const shape: ViewStyle = { height, borderRadius: radii.pill };

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={[shape, glow && shadows.glowViolet, style]}>
      {variant === 'gradient' ? (
        <LinearGradient colors={gradients.cta} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.fill, shape]}>
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.fill, shape, variantStyles[variant]]}>{content}</View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  labelLg: { fontSize: 16 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.text },
  gradient: {},
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  onDark: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  link: { backgroundColor: 'transparent' },
  accent: { backgroundColor: colors.accent },
  inverse: { backgroundColor: colors.surfaceSolid },
  danger: { backgroundColor: 'transparent' },
});
