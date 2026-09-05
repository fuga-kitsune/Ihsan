export interface HeatmapDay {
  dateKey: string;
  dayNumber: number;
  dayOfWeek: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export interface HeartStateCount {
  id: string;
  label: string;
  arabicTitle: string;
  count: number;
  percentage: number;
  color: string;
}

export interface CategoryBreakdown {
  category: string;
  label: string;
  completedCount: number;
  percentage: number;
}

export interface HasanatSummary {
  totalEstimatedHasanat: number;
  monthHasanat: number;
  multiplierRank: string; // e.g. "10x Minimum (Quran & Good Deeds multiplied)"
  hadithWisdom: string;
}

export interface AnalyticsSummary {
  heatmapDays: HeatmapDay[];
  heartDistribution: HeartStateCount[];
  categoryBreakdown: CategoryBreakdown[];
  hasanatSummary: HasanatSummary;
  totalDeedsCompleted: number;
  averageCompletionRate: number;
  activeDaysCount: number;
  currentStreak: number;
  bestStreak: number;
  monthTitle: string;
  isCurrentMonth: boolean;
}

