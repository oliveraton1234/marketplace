import { create } from 'zustand';

export type Appearance = 'light' | 'dark' | 'auto';

type PreferencesState = {
  appearance: Appearance;
  notifications: boolean;
  approximateLocation: boolean;
  whatsappOffers: boolean;
  set: <K extends keyof Omit<PreferencesState, 'set'>>(key: K, value: PreferencesState[K]) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  appearance: 'light',
  notifications: true,
  approximateLocation: true,
  whatsappOffers: true,
  set: (key, value) => set({ [key]: value } as Partial<PreferencesState>),
}));
