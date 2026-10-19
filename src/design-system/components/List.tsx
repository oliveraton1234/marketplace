import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '../tokens';
import { Icon } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

/** Uppercase section label ("CUENTA", "MOVIMIENTOS"…). */
export function SectionLabel({ children, color = colors.textTertiary }: { children: string; color?: string }) {
  return (
    <Text variant="overline" color={color} accessibilityRole="header">
      {children}
    </Text>
  );
}

/** Grouped list with hairline separators, à la iOS inset-grouped tables. */
export function ListGroup({ children, framed = true }: { children: ReactNode; framed?: boolean }) {
  const items = Children.toArray(children);
  return (
    <View style={framed && styles.group}>
      {items.map((child, i) => (
        <Fragment key={i}>
          {child}
          {i < items.length - 1 && <View style={styles.separator} />}
        </Fragment>
      ))}
    </View>
  );
}

export type ListRowProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  /** Right side: value text, control, or chevron (default when pressable). */
  trailing?: ReactNode;
  value?: string;
  valueColor?: string;
  onPress?: () => void;
  height?: number;
};

export function ListRow({ title, subtitle, leading, trailing, value, valueColor, onPress, height = 54 }: ListRowProps) {
  const right =
    trailing ??
    (value ? (
      <Text variant={valueColor ? 'footnoteBold' : 'callout'} color={valueColor ?? colors.textSecondary}>
        {value}
      </Text>
    ) : onPress ? (
      <Icon name="chevronRight" size={18} color={colors.textMuted} strokeWidth={2.25} />
    ) : null);

  const body = (
    <View style={[styles.row, { minHeight: subtitle ? height + 10 : height }]}>
      {leading}
      <View style={styles.titles}>
        <Text variant="bodyStrong">{title}</Text>
        {subtitle && (
          <Text variant="footnote" color={colors.textSecondary}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );

  if (!onPress) return body;
  return (
    <PressableScale onPress={onPress} pressedScale={0.985} accessibilityLabel={title}>
      {body}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  group: {
    paddingHorizontal: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  separator: { height: StyleSheet.hairlineWidth * 2, backgroundColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titles: { flex: 1, gap: 2, paddingVertical: spacing.sm },
});
