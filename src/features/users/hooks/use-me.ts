import { useQuery } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

export function useMe() {
  const { users } = useRepositories();
  return useQuery({ queryKey: queryKeys.me, queryFn: () => users.getMe() });
}
