import { StyleSheet, View } from 'react-native';

import { colors, palette, Text } from '@/design-system';

import type { Provider } from '../domain/provider';

/** Pill-shaped map marker: avatar + trade. Purple when selected. */
export function ProviderMapPin({ provider, selected }: { provider: Provider; selected: boolean }) {
  return (
    <View style={[styles.pin, selected ? styles.on : styles.off]}>
      <View style={[styles.avatar, { backgroundColor: provider.avatarColor }]}>
        <Text variant="captionBold" color={palette.white}>
          {provider.initials}
        </Text>
      </View>
      <Text variant="footnoteBold" color={selected ? palette.white : colors.text}>
        {provider.trade}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pin: {
    height: 38,
    paddingLeft: 4,
    paddingRight: 12,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: palette.violetNight,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  on: { backgroundColor: palette.violet },
  off: { backgroundColor: palette.white, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
