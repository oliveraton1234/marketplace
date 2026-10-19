import { router, type Href } from 'expo-router';

/** Go back when there is history; otherwise land on a sensible screen (deep links, notifications). */
export function goBack(fallback: Href = '/home') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
