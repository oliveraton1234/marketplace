import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { auroraTints, type AuroraTint } from '../tokens';

export type AuroraBlob = {
  tint: AuroraTint;
  size: number;
  /** Position relative to the screen; negative values bleed off-screen. */
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  /** 0–1: where the gradient fades out (default 0.66). */
  falloff?: number;
  intensity?: number;
};

/** Soft radial light blobs that give every screen its aurora atmosphere. */
export const Aurora = memo(function Aurora({ blobs }: { blobs: AuroraBlob[] }) {
  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {blobs.map((blob, i) => {
        const tint = auroraTints[blob.tint];
        const id = `aurora-${i}`;
        const { size, left, right, top, bottom } = blob;
        return (
          <Svg key={id} width={size} height={size} style={{ position: 'absolute', left, right, top, bottom }}>
            <Defs>
              <RadialGradient id={id} cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor={tint.color} stopOpacity={blob.intensity ?? tint.opacity} />
                <Stop offset={blob.falloff ?? 0.66} stopColor={tint.color} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
          </Svg>
        );
      })}
    </View>
  );
});

/** Curated presets so screens share a consistent mood. */
export const auroraPresets = {
  home: [
    { tint: 'violet', size: 380, left: -110, top: -140, falloff: 0.68 },
    { tint: 'mint', size: 340, right: -130, top: -60, falloff: 0.68 },
    { tint: 'lilac', size: 300, left: 60, top: 120, falloff: 0.7 },
  ],
  welcome: [
    { tint: 'violet', size: 520, left: -160, top: -40, falloff: 0.65 },
    { tint: 'mint', size: 460, right: -180, top: 140, falloff: 0.65 },
    { tint: 'pink', size: 360, left: 20, top: 300, falloff: 0.7 },
  ],
  topRight: [{ tint: 'violet', size: 420, right: -150, top: -150 }],
  topLeft: [{ tint: 'violet', size: 420, left: -150, top: -150 }],
  dual: [
    { tint: 'violet', size: 420, left: -120, top: -150 },
    { tint: 'mint', size: 340, right: -150, top: -60 },
  ],
  dualReverse: [
    { tint: 'violet', size: 400, right: -130, top: -150 },
    { tint: 'mint', size: 320, left: -150, top: -80 },
  ],
  center: [
    { tint: 'violet', size: 420, left: -120, top: 180 },
    { tint: 'mint', size: 400, right: -150, top: 360 },
  ],
  calm: [
    { tint: 'mint', size: 400, left: -100, top: -120 },
    { tint: 'pink', size: 380, right: -120, top: 380 },
  ],
} satisfies Record<string, AuroraBlob[]>;
