export type DuaCategory = 'all' | 'anxiety' | 'adhkar' | 'forgiveness' | 'protection' | 'gratitude';

export interface DuaItem {
  id: string;
  title: string;
  category: DuaCategory;
  arabic: string;
  transliteration: string;
  meaning: string;
  source: string;
  benefit: string;
  isBookmarked: boolean;
}
