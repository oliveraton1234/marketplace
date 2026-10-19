import type { BottomTabBarProps } from 'expo-router/tabs';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, GlassDock, Icon, IconButton, PressableScale, type IconName, durations, easings } from '@/design-system';

const tabIcons: Record<string, IconName> = { home: 'home', match: 'cards', services: 'wrench', profile: 'user' };

/** Height reserved by screens so content can scroll above the dock. */
export const TAB_BAR_SPACE = 92;

function TabButton({ focused, icon, label, onPress }: { focused: boolean; icon: IconName; label: string; onPress: () => void }) {
  const pill = useAnimatedStyle(() => ({
    opacity: withTiming(focused ? 1 : 0, { duration: durations.fast, easing: easings.standard }),
  }));

  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      style={styles.tab}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.activePill, pill]} />
      <Icon name={icon} size={22} color={focused ? colors.primary : colors.textTertiary} />
    </PressableScale>
  );
}

/**
 * Floating glass tab bar from the aurora design: four destinations around
 * a central gradient "Publicar" action that opens the publish flow.
 */
export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const routes = state.routes.map((route, index) => {
    const focused = state.index === index;
    const onPress = () => {
      const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
    };
    return (
      <TabButton
        key={route.key}
        focused={focused}
        icon={tabIcons[route.name] ?? 'home'}
        label={descriptors[route.key]?.options.title ?? route.name}
        onPress={onPress}
      />
    );
  });

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 16) + 8 }]}>
      <GlassDock style={styles.dock}>
        <View accessibilityRole="tablist" accessibilityLabel="Navegación principal" style={styles.row}>
          {routes.slice(0, 2)}
          <IconButton
            icon="plus"
            label="Publicar"
            variant="gradient"
            size={52}
            iconSize={24}
            onPress={() => router.push('/publish/photos')}
          />
          {routes.slice(2)}
        </View>
      </GlassDock>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20 },
  dock: { height: 68 },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 10 },
  tab: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  activePill: { borderRadius: 24, backgroundColor: colors.primaryTintMd },
});
