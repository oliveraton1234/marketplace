import type { UserSummary } from '@/features/users/domain/user';

export type ListingCategory = 'tech' | 'services' | 'home' | 'music' | 'sports';
export type ListingKind = 'camera' | 'headphones' | 'guitar' | 'bike' | 'service';
export type ListingCondition = 'new' | 'like_new' | 'used' | 'for_repair';
export type ListingIntent = 'sell' | 'trade' | 'gift';

export type Listing = {
  id: string;
  title: string;
  description: string;
  kind: ListingKind;
  category: ListingCategory;
  condition: ListingCondition;
  intents: ListingIntent[];
  /** `null` when the owner only accepts trades. */
  price: number | null;
  fairRange: { min: number; max: number };
  distanceKm: number;
  matchScore: number;
  owner: UserSummary;
  wants: string[];
  /** Short line shown on match cards ("Le interesa tu bici"). */
  interestNote: string;
  photos: number;
  /** Uploaded media; empty while the listing uses its illustrated placeholder. */
  media?: { uri: string; type: 'image' | 'video' }[];
};

export type ListingFilter = { category?: ListingCategory | 'for_you'; query?: string };

export type NewListingInput = {
  title: string;
  kind: ListingKind;
  condition: ListingCondition;
  intents: ListingIntent[];
  price: number | null;
  wants: string[];
  featured: boolean;
  media: { uri: string; type: 'image' | 'video' }[];
};

export interface ListingsRepository {
  listNearby(filter?: ListingFilter): Promise<Listing[]>;
  getById(id: string): Promise<Listing>;
  create(input: NewListingInput): Promise<Listing>;
}

export const conditionLabels: Record<ListingCondition, string> = {
  new: 'Nuevo',
  like_new: 'Como nuevo',
  used: 'Usado',
  for_repair: 'Para reparar',
};

export const categoryLabels: Record<Exclude<ListingFilter['category'], undefined>, string> = {
  for_you: 'Para ti',
  tech: 'Tecnología',
  services: 'Servicios',
  home: 'Hogar',
  music: 'Música',
  sports: 'Deportes',
};
