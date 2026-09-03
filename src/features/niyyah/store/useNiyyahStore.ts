import { create } from 'zustand';
import { NiyyahItem, NiyyahTimeframe } from '../models/niyyah.model';
import { niyyahRepository } from '../repositories/niyyah.repository';

interface NiyyahState {
  activeNiyyah: NiyyahItem | null;
  allNiyyahs: NiyyahItem[];
  isLoading: boolean;

  // Actions
  loadActiveNiyyah: () => Promise<void>;
  loadAllNiyyahs: () => Promise<void>;
  setNiyyah: (title: string, timeframe: NiyyahTimeframe, category?: string) => Promise<void>;
  toggleComplete: () => Promise<void>;
}

export const useNiyyahStore = create<NiyyahState>((set, get) => ({
  activeNiyyah: null,
  allNiyyahs: [],
  isLoading: false,

  loadActiveNiyyah: async () => {
    set({ isLoading: true });
    try {
      const item = await niyyahRepository.getActiveNiyyah();
      const all = await niyyahRepository.getAllNiyyahs();
      set({ activeNiyyah: item, allNiyyahs: all, isLoading: false });
    } catch (e) {
      console.error('Failed to load active niyyah', e);
      set({ isLoading: false });
    }
  },

  loadAllNiyyahs: async () => {
    try {
      const all = await niyyahRepository.getAllNiyyahs();
      set({ allNiyyahs: all });
    } catch (e) {
      console.error('Failed to load all niyyahs', e);
    }
  },

  setNiyyah: async (title: string, timeframe: NiyyahTimeframe, category?: string) => {
    try {
      const item = await niyyahRepository.setNiyyah(title, timeframe, category);
      await get().loadActiveNiyyah();
    } catch (e) {
      console.error('Failed to set niyyah', e);
    }
  },

  toggleComplete: async () => {
    const { activeNiyyah } = get();
    if (!activeNiyyah) return;

    try {
      const result = await niyyahRepository.toggleNiyyahComplete(activeNiyyah.id, activeNiyyah.isCompleted);
      set({
        activeNiyyah: {
          ...activeNiyyah,
          isCompleted: result.isCompleted,
          completedAt: result.completedAt,
        },
      });
      await get().loadAllNiyyahs();
    } catch (e) {
      console.error('Failed to toggle niyyah completion', e);
    }
  },
}));

