import { simulateLatency } from '@/core/data/simulate';
import { AppError } from '@/core/errors/app-error';
import { mockProfile } from '@/features/users/data/users.mock';

import type { Listing, ListingFilter, ListingsRepository, NewListingInput } from '../domain/listing';
import { mockListings } from './listings.mock';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export class MockListingsRepository implements ListingsRepository {
  private store: Listing[] = [...mockListings];

  listNearby(filter: ListingFilter = {}) {
    const { category, query } = filter;
    const results = this.store.filter((listing) => {
      const inCategory = !category || category === 'for_you' || listing.category === category;
      const matchesQuery = !query || normalize(`${listing.title} ${listing.description}`).includes(normalize(query));
      return inCategory && matchesQuery;
    });
    return simulateLatency(
      results.sort((a, b) => b.matchScore - a.matchScore),
      650,
    );
  }

  async getById(id: string) {
    const listing = this.store.find((item) => item.id === id);
    if (!listing) throw new AppError('not_found', `Listing ${id} not found`, 404);
    return simulateLatency(listing, 250);
  }

  create(input: NewListingInput) {
    const listing: Listing = {
      id: `l-${Date.now()}`,
      title: input.title,
      description: '',
      kind: input.kind,
      category: 'sports',
      condition: input.condition,
      intents: input.intents,
      price: input.price,
      fairRange: { min: 2800, max: 3300 },
      distanceKm: 0,
      matchScore: 100,
      owner: mockProfile,
      wants: input.wants,
      interestNote: '',
      photos: Math.max(1, input.media.length),
      media: input.media,
    };
    this.store = [listing, ...this.store];
    return simulateLatency(listing, 700);
  }
}
