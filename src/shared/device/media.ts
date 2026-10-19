import * as ImagePicker from 'expo-image-picker';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

import { ensurePermission } from './permissions';

export type MediaAsset = {
  uri: string;
  type: 'image' | 'video';
  width: number;
  height: number;
  durationMs?: number;
};

export type MediaKind = 'images' | 'videos' | 'both';

const toMediaTypes = (kind: MediaKind): ImagePicker.MediaType[] => (kind === 'both' ? ['images', 'videos'] : [kind]);

const toAssets = (result: ImagePicker.ImagePickerResult): MediaAsset[] =>
  result.canceled
    ? []
    : result.assets.map((a) => ({
        uri: a.uri,
        type: a.type === 'video' ? 'video' : 'image',
        width: a.width,
        height: a.height,
        durationMs: a.duration ?? undefined,
      }));

/** Opens the photo library. Returns an empty list if the person cancels or denies access. */
export async function pickFromLibrary({ kind = 'both', limit = 1 }: { kind?: MediaKind; limit?: number } = {}) {
  if (!(await ensurePermission('photos'))) return [];
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: toMediaTypes(kind),
    allowsMultipleSelection: limit > 1,
    selectionLimit: limit,
    quality: 0.8,
    videoMaxDuration: 60,
  });
  return toAssets(result);
}

/** Opens the camera for a photo or a short video. */
export async function captureWithCamera({ kind = 'images', front = false }: { kind?: MediaKind; front?: boolean } = {}) {
  if (!(await ensurePermission('camera'))) return [];
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: toMediaTypes(kind),
    cameraType: front ? ImagePicker.CameraType.front : ImagePicker.CameraType.back,
    quality: 0.8,
    videoMaxDuration: 60,
  });
  return toAssets(result);
}

/** Native "Tomar foto o video / Elegir de la galería" sheet. */
export function chooseMedia({ limit = 1, kind = 'both' }: { limit?: number; kind?: MediaKind } = {}): Promise<MediaAsset[]> {
  return new Promise((resolve) => {
    const camera = () => captureWithCamera({ kind }).then(resolve);
    const library = () => pickFromLibrary({ kind, limit }).then(resolve);
    const cameraLabel = kind === 'images' ? 'Tomar foto' : 'Tomar foto o video';

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [cameraLabel, 'Elegir de la galería', 'Cancelar'], cancelButtonIndex: 2 },
        (index) => (index === 0 ? camera() : index === 1 ? library() : resolve([])),
      );
    } else if (Platform.OS === 'web') {
      library();
    } else {
      Alert.alert('Agregar', undefined, [
        { text: cameraLabel, onPress: camera },
        { text: 'Elegir de la galería', onPress: library },
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve([]) },
      ]);
    }
  });
}
