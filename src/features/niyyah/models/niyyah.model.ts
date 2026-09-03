export type NiyyahTimeframe = 'weekly' | 'monthly';

export interface NiyyahItem {
  id: string;
  title: string;
  timeframe: NiyyahTimeframe;
  category: string;
  targetDate: string;
  isCompleted: boolean;
  createdAt: number;
  completedAt?: number | null;
}

