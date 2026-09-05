export type QuestCategory = 'all' | 'weekly' | 'monthly' | 'sunnah';

export interface SpiritualQuest {
  id: string;
  title: string;
  category: QuestCategory;
  period: 'Daily' | 'Weekly' | 'Monthly' | 'Special';
  description: string;
  benefit: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  unit: string;
  iconName: string;
  requiredStreak?: number;
  isLocked?: boolean;
  lastUpdatedDate?: string;
}

export const INITIAL_QUESTS: SpiritualQuest[] = [
  {
    id: 'quest_kahf',
    title: 'Surah Al-Kahf',
    category: 'weekly',
    period: 'Weekly',
    description: 'Light between two Fridays',
    benefit: '',
    targetCount: 1,
    currentCount: 0,
    isCompleted: false,
    unit: 'time',
    iconName: 'book',
    requiredStreak: 0,
  },
  // Starter Tier (0-day streak)
  {
    id: 'quest_istighfar',
    title: '100x Daily Istighfar',
    category: 'weekly',
    period: 'Daily',
    description: 'Seeking Allah’s forgiveness daily',
    benefit: '',
    targetCount: 100,
    currentCount: 0,
    isCompleted: false,
    unit: 'times',
    iconName: 'heart',
    requiredStreak: 0,
  },
  {
    id: 'quest_fasting',
    title: 'Fast Mon & Thu',
    category: 'weekly',
    period: 'Weekly',
    description: 'Sunnah fasting days',
    benefit: '',
    targetCount: 2,
    currentCount: 0,
    isCompleted: false,
    unit: 'days',
    iconName: 'sparkles',
    requiredStreak: 0,
  },

  // Sunnah Consistency Tier (2-day streak)
  {
    id: 'quest_rawatib',
    title: '12 Sunnah Rawatib',
    category: 'weekly',
    period: 'Weekly',
    description: 'Daily established sunnah prayers',
    benefit: '',
    targetCount: 12,
    currentCount: 0,
    isCompleted: false,
    unit: 'prayers',
    iconName: 'sparkles',
    requiredStreak: 2,
  },
  {
    id: 'quest_dhuha',
    title: 'Salatul Dhuha',
    category: 'weekly',
    period: 'Weekly',
    description: 'Morning charity for every joint',
    benefit: '',
    targetCount: 4,
    currentCount: 0,
    isCompleted: false,
    unit: 'days',
    iconName: 'sun',
    requiredStreak: 2,
  },

  // Spiritual Mastery Tier (7-day streak)
  {
    id: 'quest_tahajjud',
    title: 'Night Prayer (Tahajjud)',
    category: 'weekly',
    period: 'Weekly',
    description: 'Two nights of Qiyam al-Layl',
    benefit: '',
    targetCount: 2,
    currentCount: 0,
    isCompleted: false,
    unit: 'nights',
    iconName: 'moon',
    requiredStreak: 7,
  },
  {
    id: 'quest_salawat',
    title: '1,000 Salawat',
    category: 'weekly',
    period: 'Weekly',
    description: 'Send blessings upon the Prophet ﷺ',
    benefit: '',
    targetCount: 1000,
    currentCount: 0,
    isCompleted: false,
    unit: 'times',
    iconName: 'star',
    requiredStreak: 7,
  },
  {
    id: 'quest_tongue',
    title: 'Guard the Tongue',
    category: 'weekly',
    period: 'Weekly',
    description: 'No backbiting or harsh speech',
    benefit: '',
    targetCount: 3,
    currentCount: 0,
    isCompleted: false,
    unit: 'days',
    iconName: 'shield',
    requiredStreak: 7,
  },
];
