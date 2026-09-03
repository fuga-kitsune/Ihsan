import { create } from 'zustand';
import { DuaItem, DuaCategory } from '../models/dua.model';
import { duaRepository } from '../repositories/dua.repository';
import { habitRepository } from '../../tracker/repositories/habit.repository';

interface DuaState {
  duas: DuaItem[];
  activeCategory: DuaCategory;
  searchQuery: string;
  isLoading: boolean;

  // Actions
  loadDuas: () => Promise<void>;
  setActiveCategory: (cat: DuaCategory) => void;
  setSearchQuery: (query: string) => void;
  toggleBookmark: (duaId: string) => Promise<void>;
  addDuaToHabits: (dua: DuaItem) => Promise<void>;
}

export const useDuaStore = create<DuaState>((set, get) => ({
  duas: [],
  activeCategory: 'all',
  searchQuery: '',
  isLoading: false,

  loadDuas: async () => {
    const { activeCategory, searchQuery } = get();
    set({ isLoading: true });
    try {
      const items = await duaRepository.getDuas(activeCategory, searchQuery);
      set({ duas: items, isLoading: false });
    } catch (e) {
      console.error('Failed to load duas', e);
      set({ isLoading: false });
    }
  },

  setActiveCategory: (cat: DuaCategory) => {
    set({ activeCategory: cat });
    get().loadDuas();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().loadDuas();
  },

  toggleBookmark: async (duaId: string) => {
    const { duas } = get();
    const target = duas.find((d) => d.id === duaId);
    if (!target) return;

    const newStatus = !target.isBookmarked;
    set({
      duas: duas.map((d) => (d.id === duaId ? { ...d, isBookmarked: newStatus } : d)),
    });

    try {
      await duaRepository.toggleBookmark(duaId, target.isBookmarked);
    } catch (e) {
      console.error('Failed to toggle bookmark', e);
    }
  },

  addDuaToHabits: async (dua: DuaItem) => {
    try {
      await habitRepository.addHabit({
        name: `Du'a: ${dua.title}`,
        category: 'dhikr',
        benefit: dua.benefit || dua.meaning,
        tag: 'Dua',
      });
    } catch (e) {
      console.error('Failed to add dua to daily habits', e);
    }
  },
}));
