import { create } from 'zustand';
import { reflectionRepository } from '../repositories/reflection.repository';
import { getTodayDateString } from '../../../core/utils/date';

interface ReflectionState {
  dateKey: string;
  content: string;
  heartState: string;
  isSavedVisible: boolean;
  
  // Actions
  loadReflection: (date?: string) => Promise<void>;
  updateReflection: (text: string) => Promise<void>;
  setHeartState: (state: string) => Promise<void>;
}

let timeoutId: any = null;

export const useReflectionStore = create<ReflectionState>((set, get) => ({
  dateKey: getTodayDateString(),
  content: '',
  heartState: '',
  isSavedVisible: false,

  loadReflection: async (date?: string) => {
    const today = getTodayDateString();
    let targetDate = date || get().dateKey;
    if (targetDate > today) {
      targetDate = today;
    }
    try {
      const data = await reflectionRepository.getReflectionForDate(targetDate);
      set({ dateKey: targetDate, content: data.content, heartState: data.heartState });
    } catch (e) {
      console.error('Failed to load reflection from DB', e);
    }
  },

  updateReflection: async (text: string) => {
    const { dateKey, heartState } = get();
    const today = getTodayDateString();
    // Guard against modifying future dates
    if (dateKey > today) return;

    set({ content: text, isSavedVisible: true });

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      set({ isSavedVisible: false });
    }, 1500);

    try {
      await reflectionRepository.saveReflection(dateKey, text, heartState);
    } catch (e) {
      console.error('Failed to save reflection to DB', e);
    }
  },

  setHeartState: async (newState: string) => {
    const { dateKey, content } = get();
    const today = getTodayDateString();
    // Guard against modifying future dates
    if (dateKey > today) return;

    set({ heartState: newState, isSavedVisible: true });

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      set({ isSavedVisible: false });
    }, 1500);

    try {
      await reflectionRepository.saveReflection(dateKey, content, newState);
    } catch (e) {
      console.error('Failed to save heart state to DB', e);
    }
  },

}));

