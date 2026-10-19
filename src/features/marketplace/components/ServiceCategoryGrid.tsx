import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';

import { colors, durations, Icon, palette, PressableScale, radii, Text, type IconName } from '@/design-system';

import { serviceCategories, type ServiceCategory } from '../domain/provider';

const PRIMARY_COUNT = 7;

type Props = { selected?: ServiceCategory; onSelect: (category: ServiceCategory | undefined) => void };

function Tile({ label, icon, selected, onPress }: { label: string; icon: IconName; selected?: boolean; onPress: () => void }) {
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.tile, selected && styles.tileSelected]}>
      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <Icon name={icon} size={22} color={selected ? palette.white : colors.text} />
      </View>
      <Text variant="captionBold" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
        {label}
      </Text>
    </PressableScale>
  );
}

/** 4-column grid of trades; "Más" reveals the long tail. Tapping the active trade clears it. */
export function ServiceCategoryGrid({ selected, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? serviceCategories : serviceCategories.slice(0, PRIMARY_COUNT);

  return (
    <Animated.View layout={LinearTransition.duration(durations.base)} style={styles.grid}>
      {visible.map((c, i) => (
        <Animated.View key={c.id} entering={i >= PRIMARY_COUNT ? FadeIn.duration(durations.base) : undefined} style={styles.cell}>
          <Tile
            label={c.label}
            icon={c.icon}
            selected={selected === c.id}
            onPress={() => onSelect(selected === c.id ? undefined : c.id)}
          />
        </Animated.View>
      ))}
      <View style={styles.cell}>
        <Tile label={expanded ? 'Menos' : 'Más'} icon="dotsHorizontal" onPress={() => setExpanded((e) => !e)} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  cell: { width: '25%', padding: 5 },
  tile: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 2,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceSolid,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileSelected: { borderColor: palette.violetSoft, backgroundColor: colors.primaryTintMd },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: { backgroundColor: colors.primary },
});
