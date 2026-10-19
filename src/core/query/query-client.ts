import { QueryClient } from '@tanstack/react-query';

import { AppError } from '../errors/app-error';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => (error instanceof AppError ? error.isRetryable && failureCount < 2 : failureCount < 2),
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
});
