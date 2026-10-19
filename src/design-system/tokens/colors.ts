/**
 * Aurora light palette. Single source of truth for every color in the app.
 * Never hardcode hex values in features — import from `@/design-system`.
 */
export const palette = {
  ink: '#0D0B14',
  paper: '#FBFAFF',
  white: '#FFFFFF',
  mapGround: '#F4F1FB',
  mapRoad: '#E4DDF2',
  mapAvenue: '#D6CCEE',

  violet: '#7B3FF2',
  violetDeep: '#5A2BD0',
  violetInk: '#6A2FE0',
  violetNight: '#3B1B8F',
  violetSoft: '#B58CFF',
  violetMist: '#D9C9FF',
  violetHaze: '#EDE5FF',
  violetCard: '#2A1F55',

  mint: '#6FE3B8',
  mintInk: '#0F7A55',
  mintDeep: '#0F6B4B',
  forest: '#2F8F6F',
  forestDeep: '#1F7A60',
  teal: '#1F9E74',

  pink: '#FF8FD8',
  magenta: '#C42A86',
  plum: '#8A3E7A',
  berry: '#B0306A',
  orchid: '#B0389F',
  sos: '#E8326A',

  textSecondary: '#5E5675',
  textTertiary: '#6B6485',
  textMuted: '#A59DC2',
} as const;

export const colors = {
  background: palette.paper,
  text: palette.ink,
  textSecondary: palette.textSecondary,
  textTertiary: palette.textTertiary,
  textMuted: palette.textMuted,
  textInverse: palette.paper,

  primary: palette.violet,
  primaryInk: palette.violetInk,
  accent: palette.mint,
  success: palette.mintInk,
  danger: palette.magenta,

  surface: 'rgba(255,255,255,0.82)',
  surfaceStrong: 'rgba(255,255,255,0.86)',
  surfaceSolid: palette.white,
  border: 'rgba(13,11,20,0.08)',
  borderStrong: 'rgba(13,11,20,0.14)',

  primaryTint: 'rgba(123,63,242,0.08)',
  primaryTintMd: 'rgba(123,63,242,0.12)',
  primaryTintStrong: 'rgba(123,63,242,0.18)',
  primaryTintBold: 'rgba(123,63,242,0.25)',
  accentTint: 'rgba(111,227,184,0.16)',
  accentTintSoft: 'rgba(111,227,184,0.10)',
  pinkTint: 'rgba(255,111,216,0.10)',
  pinkTintMd: 'rgba(255,111,216,0.16)',
} as const;

/** Reusable gradient stops (used by expo-linear-gradient). */
export const gradients = {
  brand: [palette.violet, palette.mint] as const,
  cta: [palette.violet, palette.forest] as const,
  hero: [palette.violet, palette.violetDeep, '#2E9C7A'] as const,
  headline: [palette.violet, palette.teal] as const,
  ring: [palette.violet, palette.mint, palette.violetSoft] as const,
  ringWarm: [palette.violet, palette.mint, palette.pink] as const,
  progress: [palette.violetSoft, palette.mint] as const,
} as const;

/** Aurora blob tints (center color, fully transparent at the edge). */
export const auroraTints = {
  violet: { color: palette.violet, opacity: 0.3 },
  mint: { color: palette.mint, opacity: 0.4 },
  lilac: { color: palette.violetSoft, opacity: 0.28 },
  pink: { color: '#FF6FD8', opacity: 0.2 },
} as const;

export type AuroraTint = keyof typeof auroraTints;
