import { create } from 'zustand';
import { HabitItemUIModel, HabitCategory, TrackerStatsUIModel } from '../models/habit.model';
import { habitRepository } from '../repositories/habit.repository';
import { getTodayDateString } from '../../../core/utils/date';

interface TrackerState {
  habits: HabitItemUIModel[];
  activeCategory: HabitCategory;
  selectedDate: string;
  stats: TrackerStatsUIModel;
  weeklyCompletion: Record<string, number>;
  isLoading: boolean;
  
  // Actions
  loadHabits: (date?: string) => Promise<void>;
  setSelectedDate: (date: string) => Promise<void>;
  setActiveCategory: (category: HabitCategory) => void;
  toggleHabit: (habitId: string) => Promise<void>;
  addHabit: (data: { name: string; category: string; benefit: string }) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
}

export const useTrackerStore = create<TrackerState>((set, get) => ({
  habits: [],
  activeCategory: 'all',
  selectedDate: getTodayDateString(),
  stats: {
    completedCount: 0,
    totalCount: 0,
    percentage: 0,
    streak: 0,
  },
  weeklyCompletion: {},
  isLoading: false,

  setSelectedDate: async (newDate: string) => {
    const today = getTodayDateString();
    // Strict guard: cannot navigate to any future date
    if (newDate > today) {
      return;
    }
    set({ selectedDate: newDate });
    await get().loadHabits(newDate);
  },

  loadHabits: async (date?: string) => {
    const targetDate = date || get().selectedDate;
    set({ isLoading: true });

    try {
      const items = await habitRepository.getHabitsForDate(targetDate);
      const streak = await habitRepository.calculateStreak();
      const weeklyCompletion = await habitRepository.getWeeklyCompletionStatus();
      const completedCount = items.filter((h) => h.isCompleted).length;
      const totalCount = items.length;
      const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      set({
        habits: items,
        selectedDate: targetDate,
        weeklyCompletion,
        stats: {
          completedCount,
          totalCount,
          percentage,
          streak: Math.max(streak, completedCount >= 5 ? 1 : 0),
        },
        isLoading: false,
      });
    } catch (e) {
      console.error('Failed to load habits from DB', e);
      set({ isLoading: false });
    }
  },

  setActiveCategory: (category: HabitCategory) => {
    set({ activeCategory: category });
  },

  toggleHabit: async (habitId: string) => {
    const { habits, selectedDate, weeklyCompletion } = get();
    const today = getTodayDateString();
    
    // Strict guard: cannot complete tasks for future dates
    if (selectedDate > today) return;

    const target = habits.find((h) => h.id === habitId);
    if (!target) return;

    const newStatus = !target.isCompleted;

    // Optimistic UI Update for instant feedback
    const updated = habits.map((h) => (h.id === habitId ? { ...h, isCompleted: newStatus } : h));
    const completedCount = updated.filter((h) => h.isCompleted).length;
    const totalCount = updated.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const updatedWeekly = {
      ...weeklyCompletion,
      [selectedDate]: completedCount,
    };

    set((state) => ({
      habits: updated,
      weeklyCompletion: updatedWeekly,
      stats: {
        ...state.stats,
        completedCount,
        percentage,
        streak: Math.max(state.stats.streak, completedCount >= 5 ? 1 : 0),
      },
    }));

    try {
      await habitRepository.toggleHabitStatus(habitId, selectedDate, target.isCompleted);
      const latestWeekly = await habitRepository.getWeeklyCompletionStatus();
      const streak = await habitRepository.calculateStreak();
      set((state) => ({
        weeklyCompletion: latestWeekly,
        stats: {
          ...state.stats,
          streak,
        },
      }));
    } catch (e) {
      console.error('Failed to persist habit toggle to DB', e);
      get().loadHabits();
    }
  },

  addHabit: async (data: { name: string; category: string; benefit: string }) => {
    try {
      await habitRepository.addHabit({
        name: data.name,
        category: data.category,
        benefit: data.benefit,
        tag: 'Custom',
      });
      await get().loadHabits();
    } catch (e) {
      console.error('Failed to add habit to DB', e);
    }
  },

  deleteHabit: async (habitId: string) => {
    try {
      await habitRepository.deleteHabit(habitId);
      await get().loadHabits();
    } catch (e) {
      console.error('Failed to delete habit from DB', e);
    }
  },
}));

