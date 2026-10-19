import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { colors, Text, springs } from '@/design-system';
import type { Listing } from '@/features/catalog/domain/listing';

import { MatchCard } from './MatchCard';

export type SwipeDirection = 'left' | 'right';
export type SwipeDeckHandle = { swipe: (direction: SwipeDirection) => void };

type SwipeDeckProps = {
  current: Listing;
  /** Monotonic cursor; changes every swipe even if the same listing comes back. */
  position: number;
  onSwiped: (direction: SwipeDirection) => void;
};

/**
 * Tinder-style deck: drag the top card, release past the threshold to
 * pass (left) or want (right). Physics run entirely on the UI thread.
 */
export const SwipeDeck = forwardRef<SwipeDeckHandle, SwipeDeckProps>(function SwipeDeck({ current, position, onSwiped }, ref) {
  const { width } = useWindowDimensions();
  const threshold = width * 0.28;
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  // The next card takes the top slot only after React rendered it, so the old one never flashes back.
  useEffect(() => {
    x.value = 0;
    y.value = 0;
  }, [position, x, y]);

  const settle = (direction: SwipeDirection) => onSwiped(direction);

  const flyOut = (direction: SwipeDirection) => {
    'worklet';
    const target = (direction === 'right' ? 1 : -1) * width * 1.4;
    x.value = withTiming(target, { duration: 260 }, (finished) => {
      if (finished) scheduleOnRN(settle, direction);
    });
  };

  useImperativeHandle(ref, () => ({ swipe: (direction) => flyOut(direction) }));

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = e.translationY * 0.25;
    })
    .onEnd((e) => {
      const shouldDismiss = Math.abs(x.value) > threshold || Math.abs(e.velocityX) > 900;
      if (shouldDismiss) {
        flyOut(x.value > 0 ? 'right' : 'left');
      } else {
        x.value = withSpring(0, springs.gentle);
        y.value = withSpring(0, springs.gentle);
      }
    });

  const topCard = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${interpolate(x.value, [-width, width], [-14, 14], Extrapolation.CLAMP)}deg` },
    ],
  }));

  const progress = () => {
    'worklet';
    return Math.min(1, Math.abs(x.value) / threshold);
  };
  const backA = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-5 + progress() * 2}deg` }, { scale: 0.96 + progress() * 0.02 }],
  }));
  const backB = useAnimatedStyle(() => ({
    transform: [{ rotate: `${3 - progress() * 3}deg` }, { scale: 0.98 + progress() * 0.02 }],
  }));
  const wantStamp = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [20, threshold], [0, 1], Extrapolation.CLAMP) }));
  const passStamp = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [-threshold, -20], [1, 0], Extrapolation.CLAMP) }));

  return (
    <View style={styles.deck}>
      <Animated.View style={[styles.ghost, styles.ghostA, backA]} />
      <Animated.View style={[styles.ghost, styles.ghostB, backB]} />
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[styles.top, topCard]}
          accessible
          accessibilityLabel={`${current.title} de ${current.owner.name}`}
          accessibilityHint="Desliza a la derecha para proponer cambio, a la izquierda para pasar"
          accessibilityActions={[
            { name: 'activate', label: 'Quiero cambiar' },
            { name: 'escape', label: 'Pasar' },
          ]}
          onAccessibilityAction={(e) => flyOut(e.nativeEvent.actionName === 'escape' ? 'left' : 'right')}>
          <MatchCard listing={current} />
          <Animated.View style={[styles.stamp, styles.stampWant, wantStamp]}>
            <Text variant="headline" color={colors.success}>
              ¡LO QUIERO!
            </Text>
          </Animated.View>
          <Animated.View style={[styles.stamp, styles.stampPass, passStamp]}>
            <Text variant="headline" color={colors.danger}>
              PASO
            </Text>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  deck: { flex: 1 },
  ghost: {
    position: 'absolute',
    borderRadius: 34,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostA: { left: 22, right: 22, top: 0, bottom: 26 },
  ghostB: { left: 12, right: 12, top: 4, bottom: 18 },
  top: { position: 'absolute', left: 0, right: 0, top: 10, bottom: 0 },
  stamp: { position: 'absolute', top: 28, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 3 },
  stampWant: {
    left: 22,
    borderColor: colors.accent,
    backgroundColor: 'rgba(255,255,255,0.9)',
    transform: [{ rotate: '-12deg' }],
  },
  stampPass: {
    right: 96,
    borderColor: colors.danger,
    backgroundColor: 'rgba(255,255,255,0.9)',
    transform: [{ rotate: '12deg' }],
  },
});
