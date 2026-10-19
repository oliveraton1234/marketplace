import { Redirect } from 'expo-router';

import { useSessionStore } from '@/features/auth/store/session.store';

/** Entry point: signed-in people land on Inicio, everyone else on Bienvenida. */
export default function Index() {
  const signedIn = useSessionStore((s) => Boolean(s.session));
  return <Redirect href={signedIn ? '/home' : '/welcome'} />;
}
