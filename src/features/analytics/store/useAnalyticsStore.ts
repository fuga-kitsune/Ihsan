import { create } from 'zustand';
import { AnalyticsSummary } from '../models/analytics.model';
import { analyticsRepository } from '../repositories/analytics.repository';

interface AnalyticsState {
  data: AnalyticsSummary | null;
  monthOffset: number;
  isLoading: boolean;
  loadAnalytics: (offset?: number) => Promise<void>;
  setMonthOffset: (offset: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  data: null,
  monthOffset: 0,
  isLoading: false,

  loadAnalytics: async (offset?: number) => {
    const targetOffset = offset !== undefined ? offset : get().monthOffset;
    set({ isLoading: true, monthOffset: targetOffset });
    try {
      const summary = await analyticsRepository.getAnalyticsSummary(targetOffset);
      set({ data: summary, isLoading: false });
    } catch (e) {
      console.error('Failed to load analytics', e);
      set({ isLoading: false });
    }
  },

  setMonthOffset: async (offset: number) => {
    await get().loadAnalytics(offset);
  },
}));
