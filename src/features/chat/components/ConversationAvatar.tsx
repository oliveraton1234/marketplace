import { StyleSheet, View } from 'react-native';

import { Avatar, colors, LogoMark } from '@/design-system';
import type { UserSummary } from '@/features/users/domain/user';

const SUPPORT_ID = 'u-support';

/** Person avatar, or the SwapIt mark for the support inbox. */
export function ConversationAvatar({ user, size = 52, ring }: { user: UserSummary | 'support'; size?: number; ring?: boolean }) {
  if (user === 'support' || user.id === SUPPORT_ID) {
    return (
      <View style={[styles.support, { width: size, height: size, borderRadius: size / 2 }]} accessibilityLabel="Soporte SwapIt">
        <LogoMark size={size * 0.58} withTails={false} />
      </View>
    );
  }
  return (
    <Avatar
      initials={user.initials}
      size={size}
      color={user.avatarColor}
      ring={ring ? 'brand' : false}
      gap={ring ? 2 : 0}
      accessibilityLabel={user.name}
    />
  );
}

const styles = StyleSheet.create({
  support: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
