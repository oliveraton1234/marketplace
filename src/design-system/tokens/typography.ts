import type { TextStyle } from 'react-native';

/**
 * Font families as registered by `useFonts` in the root layout.
 * React Native picks a weight by family name, so weights map to families here.
 */
export const fontFamilies = {
  body: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    semibold: 'DMSans_600SemiBold',
    bold: 'DMSans_700Bold',
  },
  display: {
    medium: 'Rubik_500Medium',
    semibold: 'Rubik_600SemiBold',
    bold: 'Rubik_700Bold',
  },
} as const;

export type BodyWeight = keyof typeof fontFamilies.body;
export type DisplayWeight = keyof typeof fontFamilies.display;

const display = (size: number, weight: DisplayWeight = 'semibold', lineHeight = 1.1): TextStyle => ({
  fontFamily: fontFamilies.display[weight],
  fontSize: size,
  lineHeight: Math.round(size * lineHeight),
  letterSpacing: size >= 26 ? -0.02 * size : 0,
});

const body = (size: number, weight: BodyWeight = 'regular', lineHeight = 1.4): TextStyle => ({
  fontFamily: fontFamilies.body[weight],
  fontSize: size,
  lineHeight: Math.round(size * lineHeight),
});

export const typography = {
  hero: display(34),
  title1: display(32),
  title2: display(30),
  title3: display(26),
  title4: display(22),
  headline: display(19),
  subhead: display(18),
  stat: display(22, 'bold'),
  bigNumber: display(40, 'bold', 1),

  bodyLg: body(16, 'regular', 1.5),
  body: body(15),
  bodyStrong: body(15, 'semibold'),
  bodyBold: body(15, 'bold'),
  callout: body(14),
  calloutStrong: body(14, 'semibold'),
  footnote: body(13),
  footnoteBold: body(13, 'bold'),
  caption: body(12),
  captionBold: body(12, 'bold'),
  overline: { ...body(13, 'bold'), letterSpacing: 0.78, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
