import { useMutation, useQuery } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';
import { queryKeys } from '@/core/query/keys';

import type { ReportInput } from '../domain/safety';

export function useActiveMeeting() {
  const { safety } = useRepositories();
  return useQuery({ queryKey: queryKeys.safety.meeting, queryFn: () => safety.getActiveMeeting() });
}

export function useReportUser() {
  const { safety } = useRepositories();
  return useMutation({ mutationFn: (input: ReportInput) => safety.report(input) });
}

export function useSos() {
  const { safety } = useRepositories();
  return useMutation({ mutationFn: () => safety.triggerSos() });
}
