import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';

import { ensurePermission } from './permissions';

export type Place = { neighborhood?: string; city?: string; latitude: number; longitude: number };

/**
 * Asks for "while in use" location access, explaining the purpose first.
 * `skipPrimer` is for screens that already are the explanation (onboarding).
 */
export function requestLocationAccess(options?: { skipPrimer?: boolean }) {
  return ensurePermission('location', options);
}

/**
 * Current approximate place (colonia + ciudad). Only reads location when access
 * was already granted, so screens never trigger a surprise permission prompt.
 */
export function useCurrentPlace() {
  return useQuery({
    queryKey: ['device', 'place'],
    staleTime: 5 * 60_000,
    retry: false,
    queryFn: async (): Promise<Place | null> => {
      const { granted } = await Location.getForegroundPermissionsAsync();
      if (!granted) return null;
      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = position.coords;
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude }).catch(() => []);
      return {
        latitude,
        longitude,
        neighborhood: address?.district ?? address?.subregion ?? undefined,
        city: address?.city ?? address?.region ?? undefined,
      };
    },
  });
}

export function useLocationPermission() {
  return useQuery({
    queryKey: ['device', 'location-permission'],
    queryFn: async () => (await Location.getForegroundPermissionsAsync()).status,
  });
}
