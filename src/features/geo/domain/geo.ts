export type Point = { x: number; y: number };

export type MapPin =
  | { id: string; type: 'listing'; label: string; listingId: string; at: Point; emphasis: 'ink' | 'glass' }
  | { id: string; type: 'provider'; label: string; providerId: string; at: Point }
  | { id: string; type: 'safe_spot'; at: Point }
  | { id: string; type: 'me'; at: Point };

export type MapLayer = 'all' | 'services_now' | 'safe_spots';

export type MeetingSuggestion = {
  place: string;
  note: string;
  myEtaMinutes: number;
  theirEtaMinutes: number;
  counterpartName: string;
  time: string;
};

export type MapSnapshot = { pins: MapPin[]; meeting: MeetingSuggestion };

export interface GeoRepository {
  getSnapshot(layer: MapLayer): Promise<MapSnapshot>;
}
