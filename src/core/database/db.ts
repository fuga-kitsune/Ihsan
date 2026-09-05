import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('muhasabah_app.db');
    await dbInstance.execAsync(CREATE_TABLES_SQL);
    await seedInitialData(dbInstance);
  }
  return dbInstance;
}

async function seedInitialData(db: SQLite.SQLiteDatabase) {
  try {
    await db.execAsync('ALTER TABLE habits ADD COLUMN required_streak INTEGER DEFAULT 0');
  } catch {}

  const defaultHabits = [
    // Level 1: Essentials (0-day streak, immediately available)
    { id: 'fajr', name: 'Fajr Prayer', category: 'prayers', benefit: 'Divine light & protection for the day', tag: 'Fard', order: 1, requiredStreak: 0 },
    { id: 'dhuhr', name: 'Dhuhr Prayer', category: 'prayers', benefit: 'Midday spiritual remembrance', tag: 'Fard', order: 2, requiredStreak: 0 },
    { id: 'asr', name: 'Asr Prayer', category: 'prayers', benefit: 'Guardian of continuous good deeds', tag: 'Fard', order: 3, requiredStreak: 0 },
    { id: 'maghrib', name: 'Maghrib Prayer', category: 'prayers', benefit: 'Evening reflection & gratitude', tag: 'Fard', order: 4, requiredStreak: 0 },
    { id: 'isha', name: 'Isha Prayer', category: 'prayers', benefit: 'Night tranquility & protection', tag: 'Fard', order: 5, requiredStreak: 0 },
    { id: 'quran', name: 'Daily Quran (even 1 page)', category: 'quran', benefit: 'Peace of the heart & spiritual guidance', tag: 'Deed', order: 6, requiredStreak: 0 },

    // Level 2: Sunnah Foundations (Unlocked at 2-Day Streak)
    { id: 'adhkar', name: 'Morning & Evening Adhkar', category: 'dhikr', benefit: 'Spiritual shield and serenity', tag: 'Sunnah', order: 7, requiredStreak: 2 },
    { id: 'istighfar', name: 'Istighfar (100x)', category: 'dhikr', benefit: 'Opens doors of relief & barakah', tag: 'Dhikr', order: 8, requiredStreak: 2 },

    // Level 3: Character & Ihsan (Unlocked at 4-Day Streak)
    { id: 'tawakkul_dua', name: 'Morning Tawakkul Affirmation', category: 'deeds', benefit: 'Placing full trust in Allah’s plan', tag: 'Tawakkul', order: 9, requiredStreak: 4 },
    { id: 'sadaqah', name: 'Daily Act of Sadaqah / Kindness', category: 'deeds', benefit: 'Purification of soul & continuous reward', tag: 'Charity', order: 10, requiredStreak: 4 },

    // Level 4: Spiritual Mastery (Unlocked at 7-Day Streak)
    { id: 'salatul_dhuha', name: 'Salatul Dhuha (Forenoon)', category: 'prayers', benefit: 'Charity for every joint in your body', tag: 'Sunnah', order: 11, requiredStreak: 7 },
    { id: 'tahajjud_night', name: 'Qiyam / Night Tahajjud', category: 'prayers', benefit: 'Closeness to Allah in the last third of the night', tag: 'Sunnah', order: 12, requiredStreak: 7 },
  ];

  for (const h of defaultHabits) {
    const exists = await db.getFirstAsync<{ id: string }>('SELECT id FROM habits WHERE id = ?', [h.id]);
    if (!exists) {
      await db.runAsync(
        'INSERT INTO habits (id, name, category, benefit, tag, sort_order, required_streak) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [h.id, h.name, h.category, h.benefit, h.tag, h.order, h.requiredStreak]
      );
    } else {
      await db.runAsync(
        'UPDATE habits SET required_streak = ?, sort_order = ? WHERE id = ?',
        [h.requiredStreak, h.order, h.id]
      );
    }
  }

    const defaultWisdoms = [
      {
        id: 'w1',
        title: 'Tawakkul (Reliance on Allah)',
        arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
        meaning: 'And whoever relies upon Allah – then He is sufficient for him.',
        source: 'Surah At-Talaq (65:3)'
      },
      {
        id: 'w2',
        title: 'Constancy in Good Deeds',
        arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
        meaning: 'The most beloved of deeds to Allah are those that are most consistent, even if they are small.',
        source: 'Sahih al-Bukhari 6464'
      },
      {
        id: 'w3',
        title: 'Relief with Patience (Sabr)',
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        meaning: 'For indeed, with hardship [will be] ease.',
        source: 'Surah Ash-Sharh (94:5)'
      },
      {
        id: 'w4',
        title: 'Gratitude & Growth (Shukr)',
        arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
        meaning: 'If you are grateful, I will surely increase you [in favor].',
        source: 'Surah Ibrahim (14:7)'
      }
    ];

    for (const w of defaultWisdoms) {
      await db.runAsync(
        'INSERT OR IGNORE INTO wisdoms (id, title, arabic, meaning, source) VALUES (?, ?, ?, ?, ?)',
        [w.id, w.title, w.arabic, w.meaning, w.source]
      );
    }
}

