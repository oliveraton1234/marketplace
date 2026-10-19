import { Stack } from 'expo-router';

import { colors } from '@/design-system';

/** Publish flow: its own stack, presented as a full-screen modal by the root layout. */
export default function PublishLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
