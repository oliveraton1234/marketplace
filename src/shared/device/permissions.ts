import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { create } from 'zustand';

import type { IconName } from '@/design-system';

export type PermissionKind = 'location' | 'camera' | 'photos';

type PermissionCopy = { icon: IconName; title: string; uses: string[]; privacy: string };

/** What each permission is used for. Shown before the system prompt (transparency / informed consent). */
export const permissionCopy: Record<PermissionKind, PermissionCopy> = {
  location: {
    icon: 'pin',
    title: 'Usar tu ubicación',
    uses: [
      'Mostrarte objetos y servicios cerca de ti',
      'Calcular distancias y ubicarte en el mapa de servicios',
      'Sugerir puntos de encuentro seguros cuando aceptas un cambio',
    ],
    privacy: 'Solo mientras usas la app. Nunca mostramos tu calle exacta ni la compartimos con otras personas.',
  },
  camera: {
    icon: 'camera',
    title: 'Usar tu cámara',
    uses: ['Tomar fotos y videos de lo que publicas', 'Verificar tu identidad con una selfie', 'Enviar fotos en el chat'],
    privacy: 'Solo se activa cuando tú la abres. No grabamos nada en segundo plano.',
  },
  photos: {
    icon: 'share',
    title: 'Acceder a tus fotos y videos',
    uses: ['Elegir fotos y videos para tus publicaciones', 'Enviar fotos y videos en el chat'],
    privacy: 'Solo vemos lo que tú eliges. No revisamos el resto de tu galería.',
  },
};

type PrimerRequest = { kind: PermissionKind; mode: 'ask' | 'denied'; resolve: (accepted: boolean) => void };

/** Single source of truth for the primer modal (rendered once by <PermissionPrimerHost />). */
export const usePrimerStore = create<{ request: PrimerRequest | null; set: (r: PrimerRequest | null) => void }>((set) => ({
  request: null,
  set: (request) => set({ request }),
}));

const showPrimer = (kind: PermissionKind, mode: PrimerRequest['mode']) =>
  new Promise<boolean>((resolve) => usePrimerStore.getState().set({ kind, mode, resolve }));

const adapters = {
  location: { get: Location.getForegroundPermissionsAsync, request: Location.requestForegroundPermissionsAsync },
  camera: { get: ImagePicker.getCameraPermissionsAsync, request: ImagePicker.requestCameraPermissionsAsync },
  photos: { get: ImagePicker.getMediaLibraryPermissionsAsync, request: () => ImagePicker.requestMediaLibraryPermissionsAsync() },
} satisfies Record<
  PermissionKind,
  { get: () => Promise<{ granted: boolean; canAskAgain: boolean }>; request: () => Promise<{ granted: boolean }> }
>;

/**
 * Ensures a permission is granted:
 * 1. Already granted → true, no UI.
 * 2. Can still ask → our explainer first, then the system prompt.
 * 3. Permanently denied → explainer with "Abrir Ajustes".
 */
export async function ensurePermission(kind: PermissionKind, { skipPrimer = false } = {}) {
  const adapter = adapters[kind];
  const current = await adapter.get();
  if (current.granted) return true;

  if (!current.canAskAgain) {
    if (await showPrimer(kind, 'denied')) Linking.openSettings();
    return false;
  }

  if (!skipPrimer && !(await showPrimer(kind, 'ask'))) return false;
  return (await adapter.request()).granted;
}
