import { create } from 'zustand';
import { NiyyahItem, NiyyahTimeframe } from '../models/niyyah.model';
import { SpiritualQuest } from '../models/quest.model';
import { niyyahRepository } from '../repositories/niyyah.repository';
import { questRepository } from '../repositories/quest.repository';

interface NiyyahState {
  weeklyNiyyah: NiyyahItem | null;
  activeWeeklyNiyyahs: NiyyahItem[];
  monthlyNiyyah: NiyyahItem | null;
  allNiyyahs: NiyyahItem[];
  quests: SpiritualQuest[];
  activeQuestTab: 'all' | 'weekly' | 'monthly' | 'sunnah';
  isLoading: boolean;

  // Actions
  loadNiyyahAndQuests: () => Promise<void>;
  setNiyyah: (title: string, timeframe: NiyyahTimeframe, category?: string) => Promise<boolean>;
  deleteNiyyah: (id: string) => Promise<void>;
  toggleNiyyahComplete: (id: string, currentStatus: boolean) => Promise<void>;
  incrementQuest: (id: string, amount?: number) => Promise<void>;
  resetQuest: (id: string) => Promise<void>;
  setActiveQuestTab: (tab: 'all' | 'weekly' | 'monthly' | 'sunnah') => void;
  addCustomQuest: (quest: Omit<SpiritualQuest, 'id' | 'currentCount' | 'isCompleted'>) => Promise<void>;
}

export const useNiyyahStore = create<NiyyahState>((set, get) => ({
  weeklyNiyyah: null,
  activeWeeklyNiyyahs: [],
  monthlyNiyyah: null,
  allNiyyahs: [],
  quests: [],
  activeQuestTab: 'all',
  isLoading: false,

  loadNiyyahAndQuests: async () => {
    set({ isLoading: true });
    try {
      const activeWeekly = await niyyahRepository.getActiveNiyyahs('weekly');
      const monthly = await niyyahRepository.getActiveNiyyah('monthly');
      const allNiyyahs = await niyyahRepository.getAllNiyyahs();
      const quests = await questRepository.getAllQuests();

      set({
        weeklyNiyyah: activeWeekly[0] || null,
        activeWeeklyNiyyahs: activeWeekly,
        monthlyNiyyah: monthly,
        allNiyyahs,
        quests,
        isLoading: false,
      });
    } catch (e) {
      console.error('Failed to load intentions & quests', e);
      set({ isLoading: false });
    }
  },

  setNiyyah: async (title: string, timeframe: NiyyahTimeframe, category?: string) => {
    try {
      const created = await niyyahRepository.setNiyyah(title, timeframe, category);
      if (!created) {
        return false;
      }
      await get().loadNiyyahAndQuests();
      return true;
    } catch (e) {
      console.error('Failed to set intention', e);
      return false;
    }
  },

  deleteNiyyah: async (id: string) => {
    try {
      await niyyahRepository.deleteNiyyah(id);
      await get().loadNiyyahAndQuests();
    } catch (e) {
      console.error('Failed to delete intention', e);
    }
  },

  toggleNiyyahComplete: async (id: string, currentStatus: boolean) => {
    try {
      await niyyahRepository.toggleNiyyahComplete(id, currentStatus);
      await get().loadNiyyahAndQuests();
    } catch (e) {
      console.error('Failed to toggle intention completion', e);
    }
  },

  incrementQuest: async (id: string, amount: number = 1) => {
    try {
      await questRepository.incrementQuest(id, amount);
      const quests = await questRepository.getAllQuests();
      set({ quests });
    } catch (e) {
      console.error('Failed to update quest', e);
    }
  },

  resetQuest: async (id: string) => {
    try {
      await questRepository.resetQuest(id);
      const quests = await questRepository.getAllQuests();
      set({ quests });
    } catch (e) {
      console.error('Failed to reset quest', e);
    }
  },

  setActiveQuestTab: (tab) => {
    set({ activeQuestTab: tab });
  },

  addCustomQuest: async (quest) => {
    try {
      await questRepository.addCustomQuest(quest);
      const quests = await questRepository.getAllQuests();
      set({ quests });
    } catch (e) {
      console.error('Failed to add custom quest', e);
    }
  },
}));


