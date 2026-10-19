import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

import type { ProviderFilter } from '../domain/provider';

export function useProviders(filter: ProviderFilter) {
  const { marketplace } = useRepositories();
  return useQuery({
    queryKey: queryKeys.marketplace.providers(filter),
    queryFn: () => marketplace.listProviders(filter),
    placeholderData: keepPreviousData,
  });
}

export function useProvider(id: string) {
  const { marketplace } = useRepositories();
  return useQuery({ queryKey: queryKeys.marketplace.provider(id), queryFn: () => marketplace.getProvider(id) });
}

export function useJobTracking(jobId: string) {
  const { marketplace } = useRepositories();
  return useQuery({
    queryKey: queryKeys.marketplace.tracking(jobId),
    queryFn: () => marketplace.getTracking(jobId),
    refetchInterval: 15_000,
  });
}

export function useProviderDashboard() {
  const { marketplace } = useRepositories();
  return useQuery({ queryKey: queryKeys.marketplace.dashboard, queryFn: () => marketplace.getDashboard() });
}

export function useHireProvider() {
  const { marketplace } = useRepositories();
  return useMutation({
    mutationFn: (input: { providerId: string; serviceId: string }) => marketplace.hire(input.providerId, input.serviceId),
  });
}
