import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { colors, fontFamilies, radii, spacing } from '../tokens';
import { Icon, type IconName } from './Icon';
import { PressableScale } from './PressableScale';
import { Text } from './Text';

export type FieldProps = TextInputProps & {
  label?: string;
  icon?: IconName;
  trailing?: ReactNode;
  /** `pill` = search bars, `box` = form inputs. */
  shape?: 'pill' | 'box';
  emphasis?: 'body' | 'display';
  height?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

/** Text input with focus ring. Used for search, forms and the chat composer. */
export function Field({
  label,
  icon,
  trailing,
  shape = 'box',
  emphasis = 'body',
  height = 54,
  containerStyle,
  onFocus,
  onBlur,
  style,
  ...input
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  const radius = shape === 'pill' ? height / 2 : radii.md + 2;

  const control = (
    <View style={[styles.box, { height, borderRadius: radius }, focused && styles.focused, containerStyle]}>
      {icon && <Icon name={icon} size={18} color={colors.textTertiary} strokeWidth={2.25} />}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        selectionColor={colors.primary}
        accessibilityLabel={input.accessibilityLabel ?? label ?? input.placeholder}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, emphasis === 'display' ? styles.display : styles.body, style]}
        {...input}
      />
      {trailing}
    </View>
  );

  if (!label) return control;
  return (
    <View style={styles.labelled}>
      <Text variant="footnoteBold" color={colors.textTertiary} style={styles.label}>
        {label.toUpperCase()}
      </Text>
      {control}
    </View>
  );
}

/** Multi-line note field ("Cuéntanos más"). */
export function TextArea(props: TextInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor={colors.textTertiary}
      selectionColor={colors.primary}
      accessibilityLabel={props.accessibilityLabel ?? props.placeholder}
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={[styles.textarea, focused && styles.focused, props.style]}
    />
  );
}

/** Square checkbox row. */
export function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <PressableScale
      haptic="selection"
      pressedScale={0.98}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange(!checked)}
      style={styles.checkRow}>
      <View style={[styles.checkbox, checked && styles.checkboxOn]}>
        {checked && <Icon name="check" size={14} color={colors.surfaceSolid} strokeWidth={3.5} />}
      </View>
      <Text variant="body" color={colors.textSecondary} style={styles.flex}>
        {label}
      </Text>
    </PressableScale>
  );
}

/** Radio option card ("Parece una estafa o fraude"). */
export function RadioCard({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <PressableScale
      haptic="selection"
      pressedScale={0.98}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.radioCard, selected ? styles.radioCardOn : styles.radioCardOff]}>
      <View style={[styles.radio, selected && styles.radioOn]}>{selected && <View style={styles.radioDot} />}</View>
      <Text variant="bodyStrong">{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  labelled: { gap: spacing.sm },
  label: { letterSpacing: 0.5 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  focused: { borderWidth: 2, borderColor: colors.primary },
  input: { flex: 1, minWidth: 0, color: colors.text, paddingVertical: 0 },
  body: { fontFamily: fontFamilies.body.semibold, fontSize: 16 },
  display: { fontFamily: fontFamilies.display.semibold, fontSize: 22, letterSpacing: 0.4 },
  textarea: {
    minHeight: 88,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: 14,
    paddingBottom: 14,
    fontFamily: fontFamilies.body.regular,
    fontSize: 15,
    color: colors.text,
  },
  flex: { flex: 1 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  radioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  radioCardOn: { backgroundColor: colors.primaryTintStrong, borderColor: '#B58CFF' },
  radioCardOff: { backgroundColor: colors.surface, borderColor: colors.border },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primaryInk },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primaryInk },
});
