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

export interface AnalyticsSummary {
  heatmapDays: HeatmapDay[];
  heartDistribution: HeartStateCount[];
  totalDeedsCompleted: number;
  averageCompletionRate: number;
  activeDaysCount: number;
  monthTitle: string;
  isCurrentMonth: boolean;
}

