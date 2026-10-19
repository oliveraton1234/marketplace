import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Icon } from '@/design-system';

import type { ListingKind } from '../domain/listing';
import { listingArt } from '../ui/listing-art';

type ListingArtworkProps = {
  kind: ListingKind;
  iconSize?: number;
  strokeWidth?: number;
  radius?: number;
  /** Where the light source sits (0–1). */
  focus?: { x: number; y: number };
  label?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  iconOffsetTop?: number;
};

/** Soft radial wash + line glyph that stands in for a product photo. */
export function ListingArtwork({
  kind,
  iconSize = 44,
  strokeWidth = 1.5,
  radius = 18,
  focus = { x: 0.3, y: 0.2 },
  label,
  children,
  style,
  iconOffsetTop,
}: ListingArtworkProps) {
  const art = listingArt[kind];
  const id = `wash-${kind}-${Math.round(focus.x * 100)}-${Math.round(focus.y * 100)}`;

  return (
    <View style={[styles.frame, { borderRadius: radius }, style]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id={id} cx={`${focus.x * 100}%`} cy={`${focus.y * 100}%`} r="85%">
            <Stop offset="0" stopColor={art.wash[0]} />
            <Stop offset="0.75" stopColor={art.wash[1]} />
            <Stop offset="1" stopColor={art.wash[1]} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      <View style={[styles.icon, iconOffsetTop !== undefined && { justifyContent: 'flex-start', paddingTop: iconOffsetTop }]}>
        <Icon name={art.icon} size={iconSize} color={art.ink} strokeWidth={strokeWidth} label={label} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden' },
  icon: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});
