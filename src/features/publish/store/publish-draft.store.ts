import { create } from 'zustand';

import type { ListingCondition, ListingIntent, ListingKind } from '@/features/catalog/domain/listing';
import type { MediaAsset } from '@/shared/device/media';

export type PublishType = 'item' | 'service';

type DraftState = {
  type: PublishType;
  kind: ListingKind;
  media: MediaAsset[];
  title: string;
  condition: ListingCondition;
  intents: ListingIntent[];
  price: string;
  wants: string[];
  featured: boolean;
  update: (
    patch: Partial<Omit<DraftState, 'update' | 'toggleIntent' | 'removeWant' | 'addWant' | 'addMedia' | 'removeMedia' | 'reset'>>,
  ) => void;
  addMedia: (assets: MediaAsset[]) => void;
  removeMedia: (uri: string) => void;
  toggleIntent: (intent: ListingIntent) => void;
  addWant: (want: string) => void;
  removeWant: (want: string) => void;
  reset: () => void;
};

const initial = {
  type: 'item' as PublishType,
  kind: 'bike' as ListingKind,
  media: [] as MediaAsset[],
  title: 'Bici urbana rodada 26',
  condition: 'like_new' as ListingCondition,
  intents: ['sell', 'trade'] as ListingIntent[],
  price: '3000',
  wants: ['Cámaras', 'Audífonos'],
  featured: false,
};

export const MAX_PHOTOS = 8;

/** Multi-step publish flow state, shared across the three publish screens. */
export const usePublishDraft = create<DraftState>((set) => ({
  ...initial,
  update: (patch) => set(patch),
  toggleIntent: (intent) =>
    set((s) => ({ intents: s.intents.includes(intent) ? s.intents.filter((i) => i !== intent) : [...s.intents, intent] })),
  addMedia: (assets) => set((s) => ({ media: [...s.media, ...assets].slice(0, MAX_PHOTOS) })),
  removeMedia: (uri) => set((s) => ({ media: s.media.filter((m) => m.uri !== uri) })),
  addWant: (want) => set((s) => (s.wants.includes(want) ? s : { wants: [...s.wants, want] })),
  removeWant: (want) => set((s) => ({ wants: s.wants.filter((w) => w !== want) })),
  reset: () => set(initial),
}));
