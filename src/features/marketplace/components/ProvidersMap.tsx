import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Aurora } from '@/design-system';

import type { GeoPoint, Provider } from '../domain/provider';
import { auroraMapStyle, mapVeil } from './map-style';
import { ProviderMapPin } from './ProviderMapPin';

export type ProvidersMapHandle = { focus: (point: GeoPoint) => void };

export type ProvidersMapProps = {
  center: GeoPoint;
  providers: Provider[];
  selectedId?: string;
  onSelect: (id: string) => void;
  /** Fires when the camera stops after the person moved the map (not after our own animations). */
  onUserMove?: (center: GeoPoint) => void;
  /** Extra padding so the user location / pins aren't hidden under overlays. */
  edgePadding: { top: number; bottom: number };
  showsUserLocation: boolean;
};

const DELTA = 0.035;

/** Native map (Apple Maps on iOS, Google Maps on Android) in the aurora look: pan, zoom and rotate freely. */
export const ProvidersMap = forwardRef<ProvidersMapHandle, ProvidersMapProps>(function ProvidersMap(
  { center, providers, selectedId, onSelect, onUserMove, edgePadding, showsUserLocation },
  ref,
) {
  const map = useRef<MapView>(null);
  // Camera moves we trigger ourselves shouldn't offer "Buscar en esta zona".
  const programmatic = useRef(true);

  useImperativeHandle(ref, () => ({
    focus: (point) => {
      programmatic.current = true;
      map.current?.animateToRegion(
        { latitude: point.lat, longitude: point.lng, latitudeDelta: DELTA, longitudeDelta: DELTA },
        450,
      );
    },
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        ref={map}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude: center.lat, longitude: center.lng, latitudeDelta: DELTA, longitudeDelta: DELTA }}
        mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
        customMapStyle={auroraMapStyle}
        userInterfaceStyle="light"
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        showsCompass={false}
        showsPointsOfInterests={false}
        showsBuildings={false}
        toolbarEnabled={false}
        mapPadding={{ top: edgePadding.top, bottom: edgePadding.bottom, left: 0, right: 0 }}
        onRegionChangeComplete={(region) => {
          if (programmatic.current) {
            programmatic.current = false;
            return;
          }
          onUserMove?.({ lat: region.latitude, lng: region.longitude });
        }}
        accessibilityLabel="Mapa de servicios cercanos">
        {providers.map((p) => {
          const selected = p.id === selectedId;
          return (
            <Marker
              key={`${p.id}-${selected ? 'on' : 'off'}`}
              identifier={p.id}
              coordinate={{ latitude: p.location.lat, longitude: p.location.lng }}
              onPress={() => onSelect(p.id)}
              tracksViewChanges={false}
              zIndex={selected ? 2 : 1}
              accessibilityLabel={`${p.name}, ${p.trade}`}>
              <ProviderMapPin provider={p} selected={selected} />
            </Marker>
          );
        })}
      </MapView>

      {/* Aurora atmosphere above the tiles (touches pass through). */}
      {Platform.OS === 'ios' && <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: mapVeil }]} />}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Aurora
          blobs={[
            { tint: 'violet', size: 420, left: -170, top: -120, intensity: 0.22 },
            { tint: 'mint', size: 380, right: -170, bottom: 120, intensity: 0.22 },
          ]}
        />
      </View>
    </View>
  );
});
