import { simulateLatency } from '@/core/data/simulate';

import type { GeoRepository, MapLayer, MapPin, MapSnapshot } from '../domain/geo';

// Coordinates are in the 390×844 stylized map space (see MapCanvas).
const pins: MapPin[] = [
  { id: 'p1', type: 'listing', label: '$3,200', listingId: 'l-canon-ae1', at: { x: 36, y: 196 }, emphasis: 'ink' },
  { id: 'p2', type: 'listing', label: 'Cambio', listingId: 'l-sony-headphones', at: { x: 236, y: 170 }, emphasis: 'glass' },
  { id: 'p3', type: 'provider', label: 'Plomero · libre', providerId: 'u-joseluis', at: { x: 252, y: 440 } },
  { id: 'p4', type: 'safe_spot', at: { x: 226, y: 306 } },
  { id: 'p5', type: 'me', at: { x: 94, y: 446 } },
];

export class MockGeoRepository implements GeoRepository {
  getSnapshot(layer: MapLayer) {
    const visible = pins.filter((pin) => {
      if (pin.type === 'me') return true;
      if (layer === 'services_now') return pin.type === 'provider';
      if (layer === 'safe_spots') return pin.type === 'safe_spot';
      return true;
    });
    const snapshot: MapSnapshot = {
      pins: visible,
      meeting: {
        place: 'Zócalo · zona vigilada',
        note: 'A la mitad para ti y Mariana',
        myEtaMinutes: 8,
        theirEtaMinutes: 6,
        counterpartName: 'Mariana',
        time: '17:30',
      },
    };
    return simulateLatency(snapshot, 300);
  }
}
