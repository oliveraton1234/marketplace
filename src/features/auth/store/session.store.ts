import { create } from 'zustand';

import type { Session } from '../domain/auth';

type SessionState = {
  session: Session | null;
  /** Phone captured during sign-up, shown on the code screen. */
  pendingPhone: string;
  pendingRequestId: string | null;
  identityVerified: boolean;
  startVerification: (phone: string, requestId: string) => void;
  signIn: (session: Session) => void;
  markIdentityVerified: () => void;
  signOut: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  pendingPhone: '',
  pendingRequestId: null,
  identityVerified: false,
  startVerification: (pendingPhone, pendingRequestId) => set({ pendingPhone, pendingRequestId }),
  signIn: (session) => set({ session, pendingRequestId: null }),
  markIdentityVerified: () => set({ identityVerified: true }),
  signOut: () => set({ session: null, pendingPhone: '', pendingRequestId: null }),
}));
