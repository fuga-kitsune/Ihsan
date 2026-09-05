export type HabitCategory = 'all' | 'prayers' | 'quran' | 'dhikr' | 'deeds';

export interface HabitEntity {
  id: string;
  name: string;
  category: string;
  benefit: string;
  tag: string;
  sort_order: number;
}

export interface HabitItemUIModel {
  id: string;
  name: string;
  category: HabitCategory;
  benefit: string;
  tag: string;
  isCompleted: boolean;
  sortOrder?: number;
}

export interface TrackerStatsUIModel {
  completedCount: number;
  totalCount: number;
  percentage: number;
  streak: number;
}
