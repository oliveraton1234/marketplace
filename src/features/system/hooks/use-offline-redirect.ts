import { onlineManager } from '@tanstack/react-query';
import { useNetworkState } from 'expo-network';
import { router, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { goBack } from '@/shared/lib/navigation';

/**
 * Watches connectivity: pauses queries while offline and shows the
 * "Sin conexión" screen, returning automatically once internet is back.
 */
export function useOfflineRedirect() {
  const { isConnected, isInternetReachable } = useNetworkState();
  const pathname = usePathname();
  const showing = useRef(false);
  const offline = isConnected === false || isInternetReachable === false;

  useEffect(() => {
    onlineManager.setOnline(!offline);
    if (offline && !showing.current && pathname !== '/offline') {
      showing.current = true;
      router.push('/offline');
    } else if (!offline && showing.current) {
      showing.current = false;
      if (pathname === '/offline') goBack();
    }
  }, [offline, pathname]);
}
