import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { G, Path, Rect } from 'react-native-svg';

import { palette } from '@/design-system';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Base coordinate space every pin is expressed in. */
export const MAP_SPACE = { width: 390, height: 844 } as const;

type MapCanvasProps = {
  /** Show the dashed walking route between you and the meeting point. */
  route?: boolean;
  /** Compact = the shorter tracking variant (only the top 420pt). */
  variant?: 'full' | 'tracking';
};

/** Stylized street map drawn in SVG; scales to fill its container. */
export function MapCanvas({ route = true, variant = 'full' }: MapCanvasProps) {
  const dash = useSharedValue(0);
  useEffect(() => {
    dash.value = withRepeat(withTiming(-22, { duration: 1200, easing: Easing.linear }), -1);
  }, [dash]);
  const routeProps = useAnimatedProps(() => ({ strokeDashoffset: dash.value }));

  if (variant === 'tracking') {
    return (
      <Svg style={StyleSheet.absoluteFill} viewBox="0 0 390 420" preserveAspectRatio="xMidYMid slice">
        <Rect width={390} height={420} fill={palette.mapGround} />
        <G stroke={palette.mapRoad} strokeWidth={10} fill="none" strokeLinecap="round">
          <Path d="M-10 90 H400M-10 200 H400M-10 320 H400M60 -10 V430M170 -10 V430M290 -10 V430" />
        </G>
        <Path
          d="M300 70 V200 H170 V320 H110"
          stroke={palette.violet}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <AnimatedPath
          d="M300 70 V140"
          stroke={palette.mint}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="10 12"
          animatedProps={routeProps}
        />
      </Svg>
    );
  }

  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 390 844" preserveAspectRatio="none">
      <Rect width={390} height={844} fill={palette.mapGround} />
      <Path d="M210 250 h120 v130 h-120z" fill="rgba(111,227,184,0.10)" />
      <G stroke={palette.mapRoad} strokeWidth={10} fill="none" strokeLinecap="round">
        <Path d="M-10 120 H400M-10 230 H400M-10 410 H400M-10 520 H400M-10 640 H400M70 -10 V860M190 -10 V860M300 -10 V860" />
      </G>
      <Path
        d="M-20 700 C 90 600, 160 480, 250 330 S 380 120, 420 60"
        stroke={palette.mapAvenue}
        strokeWidth={18}
        fill="none"
        strokeLinecap="round"
      />
      {route && (
        <AnimatedPath
          d="M118 470 C 160 420, 200 380, 250 330"
          stroke={palette.violetSoft}
          strokeWidth={4}
          fill="none"
          strokeDasharray="2 9"
          strokeLinecap="round"
          animatedProps={routeProps}
        />
      )}
    </Svg>
  );
}
