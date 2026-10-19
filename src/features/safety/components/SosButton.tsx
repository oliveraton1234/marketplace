import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { palette, shadows, Text } from '@/design-system';
import { haptics } from '@/shared/lib/haptics';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 172;
const R = 82;
const C = 2 * Math.PI * R;
const HOLD_MS = 1500;

/**
 * Press-and-hold emergency button: a ring fills while held and fires
 * `onTrigger` when complete, preventing accidental activations.
 */
export function SosButton({ onTrigger }: { onTrigger: () => void }) {
  const hold = useSharedValue(0);

  const fire = () => {
    haptics.warning();
    onTrigger();
  };

  const start = () => {
    haptics.impact();
    hold.value = withTiming(1, { duration: HOLD_MS, easing: Easing.linear }, (done) => {
      if (done) scheduleOnRN(fire);
    });
  };
  const cancel = () => {
    cancelAnimation(hold);
    hold.value = withTiming(0, { duration: 200 });
  };

  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: C * (1 - hold.value) }));
  const core = useAnimatedStyle(() => ({ transform: [{ scale: 1 - hold.value * 0.03 }] }));

  return (
    <Pressable
      onPressIn={start}
      onPressOut={cancel}
      accessibilityRole="button"
      accessibilityLabel="Pedir ayuda de emergencia"
      accessibilityHint="Mantén presionado para avisar a tu contacto y llamar al 911"
      onAccessibilityAction={fire}
      accessibilityActions={[{ name: 'activate' }]}>
      <Animated.View style={styles.halo}>
        <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={palette.sos}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${C} ${C}`}
            animatedProps={ringProps}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
        <Animated.View style={[styles.core, shadows.glowSos, core]}>
          <Text variant="title2" color={palette.white} style={styles.sos}>
            SOS
          </Text>
          <Text variant="captionBold" color={palette.white}>
            mantén presionado
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  halo: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, padding: 14, backgroundColor: 'rgba(255,92,138,0.18)' },
  core: { flex: 1, borderRadius: 72, backgroundColor: palette.sos, alignItems: 'center', justifyContent: 'center' },
  sos: { fontFamily: 'Rubik_700Bold', fontSize: 34, letterSpacing: 1.4 },
});
