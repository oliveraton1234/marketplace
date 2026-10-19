import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, IconButton, palette, Text } from '@/design-system';
import type { MediaAsset } from '@/shared/device/media';

const formatDuration = (ms?: number) => {
  if (!ms) return '';
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

type MediaThumbProps = {
  asset: MediaAsset;
  radius?: number;
  onRemove?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Photo or video thumbnail with an optional remove button and a duration badge for videos. */
export function MediaThumb({ asset, radius = 22, onRemove, children, style }: MediaThumbProps) {
  return (
    <View style={[styles.frame, { borderRadius: radius }, style]}>
      <Image
        source={{ uri: asset.uri }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
        accessibilityLabel={asset.type === 'video' ? 'Video' : 'Foto'}
      />
      {asset.type === 'video' && (
        <View style={styles.video}>
          <Icon name="play" size={12} color={palette.white} />
          <Text variant="captionBold" color={palette.white}>
            {formatDuration(asset.durationMs)}
          </Text>
        </View>
      )}
      {children}
      {onRemove && (
        <IconButton
          icon="close"
          label="Quitar"
          size={28}
          iconSize={14}
          variant="solid"
          onPress={onRemove}
          style={styles.remove}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', backgroundColor: palette.violetHaze },
  video: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(13,11,20,0.6)',
  },
  remove: { position: 'absolute', top: 8, right: 8 },
});
