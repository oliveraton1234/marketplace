import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { PressableScale } from '@/design-system';
import { MapCanvas, MAP_SPACE } from '@/features/geo/components/MapCanvas';
import { projectToMap } from '@/features/geo/domain/projection';

import { ProviderMapPin } from './ProviderMapPin';
import type { ProvidersMapHandle, ProvidersMapProps } from './ProvidersMap';

/** Web fallback: react-native-maps is native-only, so the browser shows the illustrated map. */
export const ProvidersMap = forwardRef<ProvidersMapHandle, ProvidersMapProps>(function ProvidersMap(
  { center, providers, selectedId, onSelect },
  ref,
) {
  const { width, height } = useWindowDimensions();
  useImperativeHandle(ref, () => ({ focus: () => {} }));
  const sx = width / MAP_SPACE.width;
  const sy = height / MAP_SPACE.height;

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapCanvas route={false} />
      {providers.map((p) => {
        const point = projectToMap(p.location, center);
        return (
          <PressableScale
            key={p.id}
            accessibilityLabel={`${p.name}, ${p.trade}`}
            onPress={() => onSelect(p.id)}
            style={[styles.pin, { left: Math.min(Math.max(point.x * sx - 60, 8), width - 150), top: point.y * sy }]}>
            <ProviderMapPin provider={p} selected={p.id === selectedId} />
          </PressableScale>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({ pin: { position: 'absolute' } });
