import { useQuery } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

export function useWallet() {
  const { payments } = useRepositories();
  return useQuery({ queryKey: queryKeys.wallet, queryFn: () => payments.getWallet() });
}
