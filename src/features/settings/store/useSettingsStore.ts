import { create } from 'zustand';
import { AppSettings, DEFAULT_SETTINGS } from '../models/settings.model';
import { settingsRepository } from '../repositories/settings.repository';

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;

  // Actions
  loadSettings: () => Promise<void>;
  setHijriOffset: (offset: number) => Promise<void>;
  toggleEveningReminder: (enabled: boolean) => Promise<void>;
  toggleMorningReminder: (enabled: boolean) => Promise<void>;
  toggleFridayReminder: (enabled: boolean) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  wipeAllData: () => Promise<void>;
}


export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,

  loadSettings: async () => {
    set({ isLoading: true });
    try {
      const data = await settingsRepository.getSettings();
      set({ settings: data, isLoading: false });
    } catch (e) {
      console.error('Failed to load settings', e);
      set({ isLoading: false });
    }
  },

  setHijriOffset: async (offset: number) => {
    const updated = { ...get().settings, hijriOffsetDays: offset };
    set({ settings: updated });
    await settingsRepository.saveSetting('hijriOffsetDays', offset);
  },

  toggleEveningReminder: async (enabled: boolean) => {
    const updated = { ...get().settings, eveningReminderEnabled: enabled };
    set({ settings: updated });
    await settingsRepository.saveSetting('eveningReminderEnabled', enabled);
  },

  toggleMorningReminder: async (enabled: boolean) => {
    const updated = { ...get().settings, morningReminderEnabled: enabled };
    set({ settings: updated });
    await settingsRepository.saveSetting('morningReminderEnabled', enabled);
  },

  toggleFridayReminder: async (enabled: boolean) => {
    const updated = { ...get().settings, fridayReminderEnabled: enabled };
    set({ settings: updated });
    await settingsRepository.saveSetting('fridayReminderEnabled', enabled);
  },

  completeOnboarding: async () => {
    const updated = { ...get().settings, hasCompletedOnboarding: true };
    set({ settings: updated });
    await settingsRepository.saveSetting('hasCompletedOnboarding', true);
  },

  wipeAllData: async () => {
    await settingsRepository.wipeAllData();
    await get().loadSettings();
  },
}));


