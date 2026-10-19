import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

import type { ListingFilter, NewListingInput } from '../domain/listing';

export function useNearbyListings(filter: ListingFilter) {
  const { listings } = useRepositories();
  return useQuery({ queryKey: queryKeys.listings.nearby(filter), queryFn: () => listings.listNearby(filter) });
}

export function useListing(id: string) {
  const { listings } = useRepositories();
  return useQuery({ queryKey: queryKeys.listings.detail(id), queryFn: () => listings.getById(id), enabled: Boolean(id) });
}

export function useCreateListing() {
  const { listings } = useRepositories();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: NewListingInput) => listings.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.listings.all }),
  });
}
