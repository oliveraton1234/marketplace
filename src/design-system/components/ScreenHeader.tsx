import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { goBack } from '@/shared/lib/navigation';

import { spacing, type TypographyVariant } from '../tokens';
import { IconButton } from './IconButton';
import { Text } from './Text';

export type ScreenHeaderProps = {
  title?: string;
  subtitle?: ReactNode;
  titleVariant?: TypographyVariant;
  /** `close` renders an ✕ (modal flows), `back` a chevron. */
  leading?: 'back' | 'close' | 'none';
  onLeadingPress?: () => void;
  center?: ReactNode;
  trailing?: ReactNode;
};

/** Top bar with a glass back button, title and optional trailing actions. */
export function ScreenHeader({
  title,
  subtitle,
  titleVariant = 'title4',
  leading = 'back',
  onLeadingPress,
  center,
  trailing,
}: ScreenHeaderProps) {
  const handleLeading = onLeadingPress ?? (() => goBack());

  return (
    <View style={styles.row}>
      {leading !== 'none' && (
        <IconButton
          icon={leading === 'close' ? 'close' : 'chevronLeft'}
          iconSize={leading === 'close' ? 20 : 22}
          label={leading === 'close' ? 'Cerrar' : 'Regresar'}
          onPress={handleLeading}
        />
      )}
      {center ? (
        <View style={styles.center}>{center}</View>
      ) : (
        <View style={styles.titles}>
          {title && (
            <Text variant={titleVariant} accessibilityRole="header">
              {title}
            </Text>
          )}
          {subtitle}
        </View>
      )}
      {trailing ?? (center ? <View style={styles.spacer} /> : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titles: { flex: 1, gap: 2 },
  center: { flex: 1, alignItems: 'center' },
  spacer: { width: 44 },
});
