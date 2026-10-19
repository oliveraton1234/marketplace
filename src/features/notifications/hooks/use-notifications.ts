import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

import type { NotificationFilter } from '../domain/notification';

export function useNotifications(filter: NotificationFilter) {
  const { notifications } = useRepositories();
  return useQuery({ queryKey: queryKeys.notifications(filter), queryFn: () => notifications.list(filter) });
}

export function useMarkAllRead() {
  const { notifications } = useRepositories();
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => notifications.markAllRead(),
    onSuccess: () => client.invalidateQueries({ queryKey: ['notifications'] }),
  });
}
