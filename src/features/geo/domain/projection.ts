/** City center used to frame the stylized map (Centro, Oaxaca). */
export const MAP_CENTER = { lat: 17.0617, lng: -96.7253 } as const;

/** Points per degree in the stylized map: ~0.035° (≈3.8 km) spans the screen width. */
const SCALE = 11000;

/** Equirectangular projection into the 390×844 map space used by MapCanvas. */
export function projectToMap(point: { lat: number; lng: number }, center: { lat: number; lng: number } = MAP_CENTER) {
  return {
    x: 195 + (point.lng - center.lng) * SCALE,
    y: 422 - (point.lat - center.lat) * SCALE,
  };
}
