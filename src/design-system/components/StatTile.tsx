import { StyleSheet } from 'react-native';

import { colors, radii } from '../tokens';
import { Surface } from './Surface';
import { Text } from './Text';

type StatTileProps = {
  value: string;
  label: string;
  tone?: 'glass' | 'mint';
  size?: 'md' | 'lg';
};

/** Compact metric tile ("14 Cambios", "4.9 · 38 reseñas"). */
export function StatTile({ value, label, tone = 'glass', size = 'md' }: StatTileProps) {
  const mint = tone === 'mint';
  return (
    <Surface tone={mint ? 'mint' : 'glass'} radius={radii.lg + 2} padding={0} style={styles.tile}>
      <Text variant="stat" color={mint ? colors.success : colors.text} style={size === 'lg' && styles.lg}>
        {value}
      </Text>
      <Text variant="caption" color={mint ? '#0F6B4B' : colors.textSecondary}>
        {label}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, paddingVertical: 14, paddingHorizontal: 12, gap: 4 },
  lg: { fontSize: 24, lineHeight: 28 },
});
