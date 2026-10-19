import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

import type { OfferDraft } from '../domain/trade';

export function useInventory() {
  const { trades } = useRepositories();
  return useQuery({ queryKey: queryKeys.trades.inventory, queryFn: () => trades.getInventory() });
}

export function useTradesOverview() {
  const { trades } = useRepositories();
  return useQuery({ queryKey: queryKeys.trades.overview, queryFn: () => trades.getOverview() });
}

export function useSendOffer() {
  const { trades } = useRepositories();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (draft: OfferDraft) => trades.sendOffer(draft),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.trades.overview }),
  });
}

export function useRateTrade() {
  const { trades } = useRepositories();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { ratingId: string; stars: number; tags: string[]; comment: string }) => trades.rate(input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.trades.overview });
      client.invalidateQueries({ queryKey: queryKeys.wallet });
    },
  });
}
