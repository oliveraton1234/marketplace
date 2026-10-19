import type { MapStyleElement } from 'react-native-maps';

import { palette } from '@/design-system/tokens';

/**
 * Aurora light map style (Google Maps / Android). Apple Maps can't be restyled,
 * so iOS uses `mutedStandard` plus a lavender veil drawn above the map.
 */
export const auroraMapStyle: MapStyleElement[] = [
  { elementType: 'geometry', stylers: [{ color: palette.mapGround }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: palette.textTertiary }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: palette.paper }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }, { color: '#DDF6EA' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: palette.mapRoad }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: palette.mapAvenue }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#CBB8F5' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: palette.textSecondary }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#D3F5E6' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: palette.violetMist }] },
];

/** Lavender wash used over Apple Maps to match the aurora palette. */
export const mapVeil = 'rgba(123,63,242,0.07)';
