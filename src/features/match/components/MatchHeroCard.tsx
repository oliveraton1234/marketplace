import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { colors, gradients, Icon, palette, PressableScale, radii, Text } from '@/design-system';

/** Fanned mini cards hinting at the swipe deck. */
function CardFan() {
  return (
    <View style={styles.fan} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.mini, { left: 0, top: 10, backgroundColor: palette.violetCard, transform: [{ rotate: '-10deg' }] }]} />
      <View style={[styles.mini, { left: 14, top: 4, backgroundColor: palette.forestDeep, transform: [{ rotate: '-2deg' }] }]} />
      <View style={[styles.mini, styles.miniFront, { left: 28, top: 12, transform: [{ rotate: '8deg' }] }]}>
        <Icon name="camera" size={26} color={palette.violet} />
      </View>
    </View>
  );
}

export function MatchHeroCard({ interested, offering }: { interested: number; offering: string }) {
  return (
    <PressableScale
      pressedScale={0.98}
      accessibilityLabel={`Swap Match: ${interested} personas quieren tu ${offering}. Desliza y elige tu mejor cambio`}
      onPress={() => router.push('/match')}>
      <LinearGradient
        colors={gradients.hero}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.1, y: 1.2 }}
        style={styles.card}>
        <Svg width={180} height={180} style={styles.glow}>
          <Defs>
            <RadialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={palette.mint} stopOpacity={0.4} />
              <Stop offset="0.7" stopColor={palette.mint} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={90} cy={90} r={90} fill="url(#heroGlow)" />
        </Svg>
        <View style={styles.copy}>
          <View style={styles.pill}>
            <View style={styles.dot} />
            <Text variant="captionBold" color={palette.white}>
              Swap Match
            </Text>
          </View>
          <Text variant="title4" color={palette.white} style={styles.title}>
            {interested} personas quieren tu {offering}
          </Text>
          <Text variant="callout" color={palette.violetHaze}>
            Desliza y elige tu mejor cambio
          </Text>
        </View>
        <CardFan />
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, borderRadius: radii.xxl, flexDirection: 'row', alignItems: 'center', gap: 14, overflow: 'hidden' },
  glow: { position: 'absolute', right: -40, bottom: -60 },
  copy: { flex: 1, gap: 6 },
  pill: {
    alignSelf: 'flex-start',
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  title: { lineHeight: 25 },
  fan: { width: 84, height: 96 },
  mini: { position: 'absolute', width: 56, height: 72, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(13,11,20,0.08)' },
  miniFront: { backgroundColor: palette.ink, borderWidth: 0, alignItems: 'center', justifyContent: 'center' },
});
