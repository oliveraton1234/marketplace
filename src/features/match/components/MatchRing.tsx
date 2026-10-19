import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { colors, durations, easings, palette, Text } from '@/design-system';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const R = 20;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Circular match score that fills on appear. */
export function MatchRing({ score }: { score: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(score / 100, { duration: durations.slow * 2, easing: easings.standard });
  }, [progress, score]);

  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: CIRCUMFERENCE * (1 - progress.value) }));

  return (
    <View style={styles.badge} accessible accessibilityLabel={`${score}% de coincidencia`}>
      <Svg width={56} height={56} viewBox="0 0 48 48" style={styles.ring}>
        <Circle cx={24} cy={24} r={R} fill="none" stroke="rgba(13,11,20,0.10)" strokeWidth={4} />
        <AnimatedCircle
          cx={24}
          cy={24}
          r={R}
          fill="none"
          stroke={palette.mint}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <Text variant="bodyBold" style={styles.value}>
        {score}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { position: 'absolute', left: 4, top: 4, transform: [{ rotate: '-90deg' }] },
  value: { fontFamily: 'Rubik_700Bold' },
});
