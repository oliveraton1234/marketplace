import type { HttpClient } from '@/core/http/http-client';

import type { Listing, ListingFilter, ListingsRepository, NewListingInput } from '../domain/listing';

/**
 * Reference adapter for `catalog-service`. Mirrors the contract in
 * `/services/catalog-service/README.md`; other features follow the same shape.
 */
export class HttpListingsRepository implements ListingsRepository {
  constructor(private readonly http: HttpClient) {}

  listNearby(filter: ListingFilter = {}) {
    return this.http.request<Listing[]>('GET', '/v1/listings/nearby', {
      query: { category: filter.category, q: filter.query },
    });
  }

  getById(id: string) {
    return this.http.request<Listing>('GET', `/v1/listings/${encodeURIComponent(id)}`);
  }

  create(input: NewListingInput) {
    return this.http.request<Listing>('POST', '/v1/listings', { body: input });
  }
}
