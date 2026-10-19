import type { ListingKind } from '@/features/catalog/domain/listing';
import type { UserSummary } from '@/features/users/domain/user';

/** Something the signed-in user owns and can put into an offer. */
export type InventoryItem = { id: string; name: string; short: string; value: number; tile: string };

export type TradeStage = 'offer' | 'accepted' | 'meeting' | 'done';

export type Trade = {
  id: string;
  title: string;
  counterpart: UserSummary;
  kind: ListingKind;
  place: string;
  when: string;
  stage: TradeStage;
};

export type ServiceJobSummary = { id: string; title: string; eta: string; status: string };
export type PublishedSummary = { id: string; title: string; meta: string; offers: number };
export type PendingRating = { id: string; counterpart: UserSummary; item: string; reward: number; when: string };

export type TradesOverview = {
  active: Trade[];
  services: ServiceJobSummary[];
  published: PublishedSummary[];
  pendingRatings: PendingRating[];
};

export type OfferDraft = { listingId: string; itemIds: string[]; cash: number };

export interface TradesRepository {
  getInventory(): Promise<InventoryItem[]>;
  getOverview(): Promise<TradesOverview>;
  sendOffer(draft: OfferDraft): Promise<{ conversationId: string }>;
  rate(input: { ratingId: string; stars: number; tags: string[]; comment: string }): Promise<{ creditsEarned: number }>;
}
