import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, typography, type TypographyVariant } from '../tokens';

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
};

/** Typography primitive. Every string in the app renders through this. */
export function Text({ variant = 'body', color = colors.text, align, style, ...rest }: TextProps) {
  return (
    <RNText
      allowFontScaling
      maxFontSizeMultiplier={1.4}
      style={[typography[variant], { color }, align && { textAlign: align }, style]}
      {...rest}
    />
  );
}
