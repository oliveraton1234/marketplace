import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

import type { MapLayer } from '../domain/geo';

export function useMapSnapshot(layer: MapLayer) {
  const { geo } = useRepositories();
  return useQuery({ queryKey: queryKeys.geo(layer), queryFn: () => geo.getSnapshot(layer), placeholderData: keepPreviousData });
}
