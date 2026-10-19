import { useMutation } from '@tanstack/react-query';

import { useRepositories } from '@/core/di/RepositoriesProvider';

import { useSessionStore } from '../store/session.store';

export function useRequestCode() {
  const { auth } = useRepositories();
  const startVerification = useSessionStore((s) => s.startVerification);
  return useMutation({
    mutationFn: (input: { phone: string; channel: 'sms' | 'email' }) => auth.requestCode(input.phone, input.channel),
    onSuccess: ({ requestId }, { phone }) => startVerification(phone, requestId),
  });
}

export function useVerifyCode() {
  const { auth } = useRepositories();
  const requestId = useSessionStore((s) => s.pendingRequestId);
  const signIn = useSessionStore((s) => s.signIn);
  return useMutation({
    mutationFn: (code: string) => auth.verifyCode(requestId ?? '', code),
    onSuccess: signIn,
  });
}
