import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Polygon } from 'react-native-svg';

import { colors, palette } from '../tokens';
import { svgA11y } from './Icon';
import { Text } from './Text';

type LogoMarkProps = {
  size?: number;
  /** `brand` = violet / ink / lilac (default), `aurora` = violet / mint / ink. */
  tone?: 'brand' | 'aurora';
  withTails?: boolean;
};

/** Two interlocking speech bubbles: the SwapIt symbol. */
export function LogoMark({ size = 112, tone = 'brand', withTails = true }: LogoMarkProps) {
  const [first, second, overlap] =
    tone === 'brand' ? [palette.violet, palette.ink, palette.violetMist] : [palette.violet, palette.mint, palette.ink];
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" {...svgA11y('Símbolo de SwapIt')}>
      <Circle cx={44} cy={46} r={32} fill={first} />
      {withTails && <Polygon points="18,62 8,84 36,72" fill={first} stroke={first} strokeWidth={6} strokeLinejoin="round" />}
      <G transform="rotate(180 60 60)">
        <Circle cx={44} cy={46} r={32} fill={second} />
        {withTails && <Polygon points="18,62 8,84 36,72" fill={second} stroke={second} strokeWidth={6} strokeLinejoin="round" />}
      </G>
      <Path d="M75.75 42A32 32 0 0 1 44.25 78A32 32 0 0 1 75.75 42Z" fill={overlap} />
    </Svg>
  );
}

/** "swapit" wordmark with the violet "it". */
export function Wordmark({ size = 44 }: { size?: number }) {
  return (
    <View style={styles.row} accessible accessibilityLabel="SwapIt">
      <Text variant="hero" style={{ fontSize: size, lineHeight: size * 1.15, fontFamily: 'Rubik_700Bold' }}>
        swap
        <Text
          variant="hero"
          color={colors.primaryInk}
          style={{ fontSize: size, lineHeight: size * 1.15, fontFamily: 'Rubik_700Bold' }}>
          it
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
});
