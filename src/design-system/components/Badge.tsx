import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, palette, spacing } from '../tokens';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type Tone = 'mint' | 'violet' | 'solidViolet' | 'ink' | 'glass' | 'pink' | 'onDark';

export type BadgeProps = {
  label: string;
  tone?: Tone;
  /** Live dot before the label (e.g. "en vivo", "Disponible ahora"). */
  dot?: boolean;
  icon?: IconName;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const tones: Record<Tone, { bg: string; fg: string }> = {
  mint: { bg: colors.accentTint, fg: colors.success },
  violet: { bg: colors.primaryTintBold, fg: colors.primaryInk },
  solidViolet: { bg: colors.primary, fg: palette.white },
  ink: { bg: colors.text, fg: colors.textInverse },
  glass: { bg: colors.surfaceStrong, fg: colors.text },
  pink: { bg: colors.pinkTintMd, fg: colors.danger },
  onDark: { bg: 'rgba(255,255,255,0.16)', fg: palette.white },
};

/** Small status pill. */
export function Badge({ label, tone = 'mint', dot, icon, height = 26, style }: BadgeProps) {
  const { bg, fg } = tones[tone];
  return (
    <View style={[styles.badge, { height, borderRadius: height / 2, backgroundColor: bg }, style]}>
      {dot && <View style={styles.dot} />}
      {icon && <Icon name={icon} size={12} color={fg} strokeWidth={2.5} />}
      <Text variant="captionBold" color={fg}>
        {label}
      </Text>
    </View>
  );
}

/** Numeric counter bubble (unread messages). */
export function CountBubble({ count, style }: { count: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.count, style]} accessibilityLabel={`${count} sin leer`}>
      <Text variant="captionBold" color={palette.white} style={styles.countText}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, paddingHorizontal: spacing.md - 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  count: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontSize: 11, lineHeight: 14 },
});
