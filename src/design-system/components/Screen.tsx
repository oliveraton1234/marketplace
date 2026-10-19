import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, screenGutter, spacing } from '../tokens';
import { Aurora, type AuroraBlob } from './Aurora';

export type ScreenProps = {
  children: ReactNode;
  aurora?: AuroraBlob[];
  /** Pinned bottom content (CTA, glass dock, composer). */
  footer?: ReactNode;
  /** Absolute layer rendered above content (maps, hero art). */
  backdrop?: ReactNode;
  scroll?: boolean;
  gap?: number;
  padded?: boolean;
  background?: string;
  /** Extra bottom space so content clears a floating tab bar. */
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'always' | 'handled' | 'never';
};

/**
 * Screen scaffold: safe areas, aurora background, scroll + sticky footer.
 * Keeps every screen consistent and removes layout boilerplate from features.
 */
export function Screen({
  children,
  aurora,
  footer,
  backdrop,
  scroll = true,
  gap = spacing.lg,
  padded = true,
  background = colors.background,
  bottomInset = 0,
  contentStyle,
  keyboardShouldPersistTaps = 'handled',
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const content: StyleProp<ViewStyle> = [
    {
      gap,
      paddingTop: insets.top + spacing.xl,
      paddingHorizontal: padded ? screenGutter : 0,
      paddingBottom: (footer ? 120 : spacing.xxxl) + bottomInset + insets.bottom,
    },
    contentStyle,
  ];

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      {aurora && <Aurora blobs={aurora} />}
      {backdrop}
      {scroll ? (
        <ScrollView
          contentContainerStyle={content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          contentInsetAdjustmentBehavior="never">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.root, content]}>{children}</View>
      )}
      {footer && (
        <View
          style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.sm }]}
          pointerEvents="box-none">
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  footer: { position: 'absolute', left: screenGutter, right: screenGutter, bottom: 0, gap: spacing.md - 2 },
});
