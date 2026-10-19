import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  colors,
  Field,
  gradients,
  Icon,
  IconButton,
  palette,
  PressableScale,
  radii,
  Reveal,
  screenGutter,
  Skeleton,
  Text,
} from '@/design-system';

import { TAB_BAR_SPACE } from '@/features/navigation/FloatingTabBar';
import { useMe } from '@/features/users/hooks/use-me';
import { useCurrentPlace } from '@/shared/device/location';

import { ProviderCard } from '../components/ProviderCard';
import { ServiceCategoryGrid } from '../components/ServiceCategoryGrid';
import { serviceCategories, type ServiceCategory } from '../domain/provider';
import { useProviders } from '../hooks/use-marketplace';

const HEADER_GAP = 18;

export function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ category?: ServiceCategory }>();
  const [category, setCategory] = useState<ServiceCategory | undefined>(params.category);
  // The tab stays mounted, so apply a trade chosen elsewhere (e.g. a provider card on Inicio).
  const [appliedParam, setAppliedParam] = useState(params.category);
  if (params.category !== appliedParam) {
    setAppliedParam(params.category);
    if (params.category) setCategory(params.category);
  }
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim());
  const activeCategory = serviceCategories.find((c) => c.id === category);
  const { data: me } = useMe();
  const { data: place } = useCurrentPlace();
  const zone = place?.neighborhood ?? (me ? `${me.neighborhood}, ${me.city}` : ' ');
  const { data: providers, isPending } = useProviders({ category, query: deferredQuery || undefined });

  // Collapsing header: the title fades out while the search bar slides up and stays pinned under the pill row.
  const [headerHeight, setHeaderHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);
  const collapse = titleHeight + HEADER_GAP;
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -Math.min(Math.max(scrollY.value, 0), collapse) }],
  }));
  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.min(Math.max(scrollY.value, 0), collapse) }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, collapse * 0.55], [1, 0], Extrapolation.CLAMP),
  }));
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, collapse], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        scrollIndicatorInsets={{ top: headerHeight - collapse }}
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: insets.bottom + TAB_BAR_SPACE + 16 }}>
        <View style={styles.content}>
          <Reveal>
            <ServiceCategoryGrid selected={category} onSelect={setCategory} />
          </Reveal>

          <View style={styles.sectionHead}>
            <Text variant="title4" accessibilityRole="header">
              Disponibles cerca de ti
            </Text>
            <PressableScale accessibilityLabel="Ver en mapa" hitSlop={10} onPress={() => router.push('/services-map')}>
              <Text variant="calloutStrong" color={colors.primaryInk} style={styles.bold}>
                Ver en mapa
              </Text>
            </PressableScale>
          </View>

          <View style={styles.list}>
            {isPending ? (
              [0, 1, 2].map((i) => <Skeleton key={i} height={120} radius={24} />)
            ) : providers?.length ? (
              providers.map((p, i) => (
                <Reveal key={p.id} index={i}>
                  <ProviderCard provider={p} />
                </Reveal>
              ))
            ) : (
              <View style={styles.empty}>
                <Icon name="searchX" size={40} color={colors.primaryInk} strokeWidth={1.5} />
                <Text variant="bodyBold" align="center">
                  Nadie disponible con ese filtro
                </Text>
                <Text variant="callout" color={colors.textSecondary} align="center">
                  Prueba otro servicio o una búsqueda más general.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[styles.headerWrap, headerStyle]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        pointerEvents="box-none">
        <Animated.View style={[styles.headerShadow, shadowStyle]} />
        <LinearGradient
          colors={gradients.hero}
          locations={[0, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.2, y: 1.3 }}
          style={[styles.header, { paddingTop: insets.top + 12 }]}>
          {/* Same color above the header so pulling down never reveals a white strip. */}
          <View style={styles.overscroll} />
          <Animated.View style={[styles.headerRow, rowStyle]}>
            <View style={styles.zone}>
              <Icon name="pin" size={16} color={palette.mint} strokeWidth={2.25} />
              <Text variant="calloutStrong" color={palette.white} numberOfLines={1} style={styles.zoneText}>
                {zone}
              </Text>
            </View>
            <PressableScale
              accessibilityLabel="Ver servicios en el mapa"
              onPress={() => router.push({ pathname: '/services-map', params: category ? { category } : {} })}
              style={styles.mapButton}>
              <Icon name="map" size={18} color={palette.white} />
              <Text variant="calloutStrong" color={palette.white}>
                Mapa
              </Text>
            </PressableScale>
            <IconButton
              icon="bell"
              label="Avisos"
              variant="plain"
              color={palette.white}
              iconSize={20}
              style={styles.glassOnDark}
              onPress={() => router.push('/notifications')}
            />
          </Animated.View>
          <Animated.View style={titleStyle} onLayout={(e) => setTitleHeight(e.nativeEvent.layout.height)}>
            <Text variant="title2" color={palette.white} accessibilityRole="header">
              ¿Qué necesitas resolver en casa?
            </Text>
          </Animated.View>
          <Field
            shape="pill"
            icon="search"
            height={56}
            placeholder="Fuga en el baño, puerta que no cierra…"
            value={activeCategory ? activeCategory.label : query}
            onChangeText={(text) => {
              // Typing replaces the trade filter with a free-text search.
              setCategory(undefined);
              setQuery(activeCategory ? text.replace(activeCategory.label, '') : text);
            }}
            trailing={
              activeCategory || query ? (
                <IconButton
                  icon="close"
                  label="Borrar búsqueda"
                  size={32}
                  iconSize={14}
                  variant="tint"
                  onPress={() => {
                    setCategory(undefined);
                    setQuery('');
                  }}
                />
              ) : undefined
            }
            returnKeyType="search"
            containerStyle={styles.search}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  bold: { fontFamily: 'DMSans_700Bold' },
  headerWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  headerShadow: {
    ...StyleSheet.absoluteFill,
    borderBottomLeftRadius: radii.sheet,
    borderBottomRightRadius: radii.sheet,
    backgroundColor: palette.violetDeep,
    shadowColor: palette.violetNight,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  overscroll: { position: 'absolute', left: 0, right: 0, top: -600, height: 600, backgroundColor: palette.violet },
  header: {
    paddingHorizontal: screenGutter,
    paddingBottom: 24,
    gap: HEADER_GAP,
    borderBottomLeftRadius: radii.sheet,
    borderBottomRightRadius: radii.sheet,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 2 },
  zone: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 6 },
  zoneText: { flexShrink: 1 },
  mapButton: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  glassOnDark: { backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 22 },
  search: { backgroundColor: colors.surfaceSolid, borderColor: 'transparent' },
  content: { paddingHorizontal: screenGutter, paddingTop: 20, gap: 18 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  list: { gap: 12 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 32 },
});
