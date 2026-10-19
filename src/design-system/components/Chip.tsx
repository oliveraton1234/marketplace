import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../tokens';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  iconColor?: string;
  size?: 'md' | 'sm';
  /** `selectedTone="mint"` for tag pickers (rating tags), ink otherwise. */
  selectedTone?: 'ink' | 'mint' | 'violet';
};

/** Filter / choice chip. Selected state is exposed to assistive tech. */
export function Chip({ label, selected, onPress, icon, iconColor, size = 'md', selectedTone = 'ink' }: ChipProps) {
  const height = size === 'md' ? 40 : 38;
  const selectedStyle = selected ? toneStyles[selectedTone] : styles.idle;
  const fg = selected && selectedTone === 'ink' ? colors.textInverse : colors.text;

  return (
    <PressableScale
      haptic="selection"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      accessibilityLabel={label}
      style={[styles.chip, { height, borderRadius: height / 2 }, selectedStyle]}>
      <View style={styles.row}>
        {icon && <Icon name={icon} size={14} color={iconColor ?? fg} strokeWidth={2.5} />}
        <Text variant={size === 'md' ? 'calloutStrong' : 'footnoteBold'} color={iconColor && !selected ? iconColor : fg}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: spacing.lg - 2, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  idle: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
});

const toneStyles = StyleSheet.create({
  ink: { backgroundColor: colors.text, borderRadius: radii.pill },
  mint: { backgroundColor: colors.accentTint, borderWidth: 1, borderColor: colors.accent },
  violet: { backgroundColor: colors.primaryTintStrong, borderWidth: 1, borderColor: '#B58CFF' },
});
