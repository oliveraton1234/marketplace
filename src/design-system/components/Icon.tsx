import { memo } from 'react';
import { Platform } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '../tokens';

type Shape =
  | { d: string }
  | { circle: [cx: number, cy: number, r: number] }
  | { rect: [x: number, y: number, w: number, h: number, rx: number] };

type IconDef = { shapes: Shape[]; filled?: boolean };

const swapArrows: Shape[] = [{ d: 'M7 4 3 8l4 4' }, { d: 'M3 8h14' }, { d: 'm17 20 4-4-4-4' }, { d: 'M21 16H7' }];
const wrench =
  'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z';
const shield = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z';
const heart =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z';
const star = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

/** Stroke icon set (24×24 grid) matching the SwapIt aurora artboards. */
const icons = {
  chevronLeft: { shapes: [{ d: 'm15 18-6-6 6-6' }] },
  chevronRight: { shapes: [{ d: 'm9 18 6-6-6-6' }] },
  chevronDown: { shapes: [{ d: 'm6 9 6 6 6-6' }] },
  arrowRight: { shapes: [{ d: 'M5 12h14M13 6l6 6-6 6' }] },
  close: { shapes: [{ d: 'M18 6 6 18M6 6l12 12' }] },
  plus: { shapes: [{ d: 'M12 5v14M5 12h14' }] },
  minus: { shapes: [{ d: 'M5 12h14' }] },
  play: { shapes: [{ d: 'M7 4v16l13-8z' }], filled: true },
  drop: {
    shapes: [{ d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z' }],
  },
  hammer: {
    shapes: [
      { d: 'm15 12-8.4 8.4a2.1 2.1 0 1 1-3-3L12 9' },
      { d: 'm18 15 4-4' },
      {
        d: 'm21.5 11.5-1.9-1.9A2 2 0 0 1 19 8.2V7l-2.3-2.3a6 6 0 0 0-4.2-1.7L9 3l.9.8A6.2 6.2 0 0 1 12 8.4V10l2 2h1.2a2 2 0 0 1 1.4.6l1.9 1.9',
      },
    ],
  },
  paintRoller: {
    shapes: [
      { rect: [2, 2, 16, 6, 2] },
      { d: 'M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' },
      { rect: [8, 16, 4, 6, 1] },
    ],
  },
  key: { shapes: [{ circle: [7.5, 15.5, 5.5] }, { d: 'm21 2-9.6 9.6' }, { d: 'm15.5 7.5 3 3L22 7l-3-3' }] },
  bricks: { shapes: [{ rect: [3, 5, 18, 14, 2] }, { d: 'M3 12h18M9 5v7M15 12v7' }] },
  leaf: {
    shapes: [
      { d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z' },
      { d: 'M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12' },
    ],
  },
  truck: {
    shapes: [
      { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9' },
      { d: 'M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4a1 1 0 0 0-.8-.4H14' },
      { circle: [17, 18, 2] },
      { circle: [7, 18, 2] },
    ],
  },
  plug: { shapes: [{ d: 'M12 22v-5M9 8V2M15 8V2' }, { d: 'M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z' }] },
  dotsHorizontal: { shapes: [{ circle: [5, 12, 1.6] }, { circle: [12, 12, 1.6] }, { circle: [19, 12, 1.6] }], filled: true },
  check: { shapes: [{ d: 'M20 6 9 17l-5-5' }] },
  pin: { shapes: [{ d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z' }, { circle: [12, 10, 3] }] },
  message: { shapes: [{ d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' }] },
  sparkle: { shapes: [{ d: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z' }, { d: 'M19 3v4M17 5h4' }] },
  sparkleSolo: { shapes: [{ d: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z' }] },
  mic: { shapes: [{ rect: [9, 3, 6, 11, 3] }, { d: 'M5 11a7 7 0 0 0 14 0M12 18v3' }] },
  camera: {
    shapes: [
      { d: 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z' },
      { circle: [12, 13, 3] },
    ],
  },
  headphones: { shapes: [{ d: 'M3 18v-6a9 9 0 0 1 18 0v6' }, { d: 'M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z' }] },
  music: { shapes: [{ d: 'M9 18V5l12-2v13' }, { circle: [6, 18, 3] }, { circle: [18, 16, 3] }] },
  bike: { shapes: [{ circle: [5.5, 17.5, 3.5] }, { circle: [18.5, 17.5, 3.5] }, { d: 'M15 6h1M12 17.5V14l-3-3 4-3 2 3h2' }] },
  home: { shapes: [{ d: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' }] },
  cards: { shapes: [{ rect: [7, 3, 12, 16, 2.5] }, { d: 'M4 7v11a3 3 0 0 0 3 3h9' }] },
  map: { shapes: [{ d: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z' }, { d: 'M9 4v14M15 6v14' }] },
  user: { shapes: [{ circle: [12, 8, 4] }, { d: 'M4 21a8 8 0 0 1 16 0' }] },
  userOutline: { shapes: [{ circle: [12, 9, 4] }, { d: 'M5 20a7 7 0 0 1 14 0' }] },
  userPlus: { shapes: [{ circle: [9, 8, 4] }, { d: 'M2 21a7 7 0 0 1 14 0M19 8v6M16 11h6' }] },
  swap: { shapes: swapArrows },
  info: { shapes: [{ circle: [12, 12, 9] }, { d: 'M12 16v-5M12 8h.01' }] },
  help: { shapes: [{ circle: [12, 12, 9] }, { d: 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01' }] },
  share: { shapes: [{ d: 'M12 3v12M7 8l5-5 5 5' }, { d: 'M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6' }] },
  heart: { shapes: [{ d: heart }] },
  heartFilled: { shapes: [{ d: heart }], filled: true },
  shield: { shapes: [{ d: shield }] },
  shieldCheck: { shapes: [{ d: shield }, { d: 'm9 12 2 2 4-4' }] },
  search: { shapes: [{ circle: [11, 11, 7] }, { d: 'm20 20-3.5-3.5' }] },
  searchX: { shapes: [{ circle: [11, 11, 7] }, { d: 'm20 20-3.5-3.5M8.5 8.5l5 5M13.5 8.5l-5 5' }] },
  bell: { shapes: [{ d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' }, { d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' }] },
  wrench: { shapes: [{ d: wrench }] },
  creditCard: { shapes: [{ rect: [2, 5, 20, 14, 3] }, { d: 'M2 10h20' }] },
  cash: { shapes: [{ rect: [2, 6, 20, 12, 2] }, { circle: [12, 12, 2.5] }] },
  gift: {
    shapes: [
      { rect: [3, 8, 18, 13, 2] },
      { d: 'M12 8v13M3 12h18M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5' },
    ],
  },
  star: { shapes: [{ d: star }], filled: true },
  bolt: { shapes: [{ d: 'M13 2 3 14h9l-1 8 10-12h-9z' }] },
  sliders: { shapes: [{ d: 'M4 7h10M18 7h2M4 17h2M10 17h10' }, { circle: [16, 7, 2] }, { circle: [8, 17, 2] }] },
  phone: {
    shapes: [
      {
        d: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
      },
    ],
  },
  dots: { shapes: [{ circle: [12, 5, 2] }, { circle: [12, 12, 2] }, { circle: [12, 19, 2] }], filled: true },
  lock: { shapes: [{ rect: [5, 11, 14, 10, 2] }, { d: 'M8 11V7a4 4 0 0 1 8 0v4' }] },
  refresh: { shapes: [{ d: 'M21 12a9 9 0 1 1-3-6.7L21 8' }, { d: 'M21 3v5h-5' }] },
  wifiOff: {
    shapes: [
      { d: 'M2 2l20 20' },
      {
        d: 'M8.5 16.5a5 5 0 0 1 7 0M5 12.9a10 10 0 0 1 5.2-2.8M19 12.9a10 10 0 0 0-2.2-1.6M2 8.8a15 15 0 0 1 4.2-2.6M22 8.8A15 15 0 0 0 11 5.1',
      },
      { circle: [12, 20, 0.5] },
    ],
  },
  backspace: { shapes: [{ d: 'M21 5H8l-6 7 6 7h13a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z' }, { d: 'm16 9-6 6M10 9l6 6' }] },
  eyeOff: {
    shapes: [
      { d: 'M2 2l20 20M10.6 5.1A10 10 0 0 1 22 12s-1 2-3.2 4M6.6 6.6C3.6 8.5 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6' },
    ],
  },
  verified: {
    shapes: [
      {
        d: 'M12 2 14.4 4.2 17.6 3.9 18.4 7 21.2 8.7 20 11.7 21.2 14.7 18.4 16.4 17.6 19.5 14.4 19.2 12 21.4 9.6 19.2 6.4 19.5 5.6 16.4 2.8 14.7 4 11.7 2.8 8.7 5.6 7 6.4 3.9 9.6 4.2Z',
      },
    ],
    filled: true,
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Accessible label. Omit for decorative icons (hidden from screen readers). */
  label?: string;
};

/** Accessibility props that each platform's SVG host understands. */
export function svgA11y(label?: string) {
  if (Platform.OS === 'web') return label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true };
  return label
    ? { accessible: true, accessibilityLabel: label, accessibilityRole: 'image' as const }
    : { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const };
}

export const Icon = memo(function Icon({ name, size = 22, color = colors.text, strokeWidth = 2, label }: IconProps) {
  const def: IconDef = icons[name];
  const paint = def.filled
    ? { fill: color, stroke: 'none' }
    : { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...svgA11y(label)}>
      {def.shapes.map((shape, i) => {
        if ('d' in shape) return <Path key={i} d={shape.d} {...paint} />;
        if ('circle' in shape) {
          const [cx, cy, r] = shape.circle;
          return <Circle key={i} cx={cx} cy={cy} r={r} {...paint} />;
        }
        const [x, y, width, height, rx] = shape.rect;
        return <Rect key={i} x={x} y={y} width={width} height={height} rx={rx} {...paint} />;
      })}
    </Svg>
  );
});
