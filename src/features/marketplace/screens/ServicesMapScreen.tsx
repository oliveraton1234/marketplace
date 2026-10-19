import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Chip, colors, durations, Field, GlassDock, Icon, IconButton, palette, PressableScale, Text } from '@/design-system';
import { requestLocationAccess, useCurrentPlace } from '@/shared/device/location';
import { goBack } from '@/shared/lib/navigation';

import { ProviderCard } from '../components/ProviderCard';
import { ProvidersMap, type ProvidersMapHandle } from '../components/ProvidersMap';
import { serviceCategories, type ServiceCategory } from '../domain/provider';
import { useProviders } from '../hooks/use-marketplace';

/** Used until (or unless) the person shares their location. */
const FALLBACK_CENTER = { lat: 17.0617, lng: -96.7253 };
const TOP_OVERLAY = 150;
const BOTTOM_OVERLAY = 230;

/** Service providers around you on a real, pannable map. Only services appear here — never listings or people. */
export function ServicesMapScreen() {
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ category?: ServiceCategory }>();
  const [category, setCategory] = useState<ServiceCategory | undefined>(params.category);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim());
  const [selectedId, setSelectedId] = useState<string>();
  const map = useRef<ProvidersMapHandle>(null);

  const { data: place, isPending: locating } = useCurrentPlace();
  const center = place ? { lat: place.latitude, lng: place.longitude } : FALLBACK_CENTER;
  // "Buscar en esta zona": the searched area only changes when the person asks for it.
  const [searchArea, setSearchArea] = useState<{ lat: number; lng: number }>();
  const [pendingArea, setPendingArea] = useState<{ lat: number; lng: number }>();
  const { data: providers = [] } = useProviders({ category, query: deferredQuery || undefined, near: searchArea ?? center });
  const selected = providers.find((p) => p.id === selectedId) ?? providers[0];

  // Ask for location the first time the map opens (explainer first, then the system prompt).
  useEffect(() => {
    requestLocationAccess().then((granted) => {
      if (granted) queryClient.invalidateQueries({ queryKey: ['device'] });
    });
  }, [queryClient]);

  // Location can arrive after the map is drawn (first-time permission): glide to it once it does.
  const latitude = place?.latitude;
  const longitude = place?.longitude;
  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) map.current?.focus({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  const select = (id: string) => {
    setSelectedId(id);
    const provider = providers.find((p) => p.id === id);
    if (provider) map.current?.focus(provider.location);
  };

  const recenter = async () => {
    if (place) return map.current?.focus(center);
    if (await requestLocationAccess()) queryClient.invalidateQueries({ queryKey: ['device'] });
  };

  return (
    <View style={styles.root}>
      {/* Wait for the first location read so the map opens already centered on the person. */}
      {!locating && (
        <ProvidersMap
          ref={map}
          center={center}
          providers={providers}
          selectedId={selected?.id}
          onSelect={select}
          showsUserLocation={Boolean(place)}
          onUserMove={setPendingArea}
          edgePadding={{ top: insets.top + TOP_OVERLAY, bottom: insets.bottom + BOTTOM_OVERLAY }}
        />
      )}

      <View style={[styles.top, { top: insets.top + 12 }]} pointerEvents="box-none">
        <View style={styles.searchRow}>
          <IconButton
            icon="chevronLeft"
            label="Regresar"
            size={52}
            variant="glass"
            style={styles.solid}
            onPress={() => goBack('/services')}
          />
          <Field
            shape="pill"
            icon="search"
            height={52}
            placeholder="Buscar servicios en esta zona"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            containerStyle={styles.search}
          />
        </View>
        {pendingArea && (
          <Animated.View entering={FadeInDown.duration(durations.base)} style={styles.searchArea}>
            <PressableScale
              accessibilityLabel="Buscar en esta zona"
              onPress={() => {
                setSearchArea(pendingArea);
                setPendingArea(undefined);
                setSelectedId(undefined);
              }}
              style={styles.searchAreaButton}>
              <Icon name="refresh" size={16} color={palette.white} strokeWidth={2.5} />
              <Text variant="calloutStrong" color={palette.white}>
                Buscar en esta zona
              </Text>
            </PressableScale>
          </Animated.View>
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          style={styles.chipsBleed}>
          <Chip size="sm" label="Todos" selected={!category} onPress={() => setCategory(undefined)} />
          {serviceCategories.map((c) => (
            <Chip
              key={c.id}
              size="sm"
              label={c.label}
              icon={c.icon}
              selected={category === c.id}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={[styles.bottom, { bottom: insets.bottom + 16 }]} pointerEvents="box-none">
        <IconButton
          icon="pin"
          label={place ? 'Centrar en mi ubicación' : 'Usar mi ubicación'}
          size={48}
          variant="glass"
          color={colors.primary}
          style={[styles.solid, styles.locate]}
          onPress={recenter}
        />
        <GlassDock radius={30} style={styles.sheet}>
          <View style={styles.sheetHead}>
            <Text variant="bodyBold">
              {providers.length ? `${providers.length} disponibles en esta zona` : 'Nadie disponible en esta zona'}
            </Text>
            <PressableScale accessibilityLabel="Ver lista" hitSlop={10} onPress={() => goBack('/services')}>
              <Text variant="calloutStrong" color={colors.primaryInk} style={styles.bold}>
                Ver lista
              </Text>
            </PressableScale>
          </View>
          {selected && (
            <Animated.View key={selected.id} entering={FadeInDown.duration(durations.base)}>
              <ProviderCard provider={selected} />
            </Animated.View>
          )}
        </GlassDock>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: palette.mapGround },
  bold: { fontFamily: 'DMSans_700Bold' },
  solid: { backgroundColor: palette.white },
  top: { position: 'absolute', left: 20, right: 20, gap: 10 },
  searchRow: { flexDirection: 'row', gap: 10 },
  search: { flex: 1, backgroundColor: palette.white },
  chipsBleed: { marginHorizontal: -20 },
  chips: { gap: 8, paddingHorizontal: 20 },
  bottom: { position: 'absolute', left: 12, right: 12, gap: 10 },
  locate: { alignSelf: 'flex-end' },
  searchArea: { position: 'absolute', top: 126, alignSelf: 'center' },
  searchAreaButton: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.text,
  },
  sheet: { padding: 12, gap: 10 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6, paddingTop: 4 },
});
