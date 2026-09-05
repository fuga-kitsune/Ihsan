import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL } from './schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }
  if (!initPromise) {
    initPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('muhasabah_app.db');
      await db.execAsync('PRAGMA journal_mode = WAL;');
      await db.execAsync(CREATE_TABLES_SQL);

      // Safe column migration for existing app databases
      try {
        await db.execAsync('ALTER TABLE spiritual_quests ADD COLUMN last_updated_date TEXT DEFAULT \'\';');
      } catch {
        // Column already exists
      }

      await seedInitialData(db);
      dbInstance = db;
      return db;
    })();
  }
  return initPromise;
}

async function seedInitialData(db: SQLite.SQLiteDatabase) {
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
    await db.runAsync(
      'INSERT OR IGNORE INTO habits (id, name, category, benefit, tag, sort_order, required_streak) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [h.id, h.name, h.category, h.benefit, h.tag, h.order, h.requiredStreak]
    );
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

  // Seed Spiritual Quests
  const { INITIAL_QUESTS } = await import('../../features/niyyah/models/quest.model');
  await db.runAsync('DELETE FROM spiritual_quests WHERE id = ?', ['quest_parents']);

  for (const q of INITIAL_QUESTS) {
    await db.runAsync(
      `INSERT OR REPLACE INTO spiritual_quests (id, title, category, period, description, benefit, target_count, current_count, is_completed, unit, icon_name, required_streak)
       VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT COALESCE(current_count, 0) FROM spiritual_quests WHERE id = ?), (SELECT COALESCE(is_completed, 0) FROM spiritual_quests WHERE id = ?), ?, ?, ?)`,
      [q.id, q.title, q.category, q.period, q.description, q.benefit, q.targetCount, q.id, q.id, q.unit, q.iconName, q.requiredStreak ?? 0]
    );
  }

  // Seed Duas
  const defaultDuas = [
    {
      id: 'dua_anxiety_1',
      title: 'Du\'a of Prophet Yunus (In Distress)',
      category: 'anxiety',
      arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
      transliteration: 'La ilaha illa Anta, Subhanaka, inni kuntu min adh-dhalimin.',
      meaning: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
      source: 'Surah Al-Anbiya (21:87)',
      benefit: 'No Muslim supplicates with this during distress except that Allah removes it.',
    },
    {
      id: 'dua_anxiety_2',
      title: 'Relief from Anxiety & Overwhelm',
      category: 'anxiety',
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
      transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wal-\'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala\'id-dayni wa ghalabatir-rijal.',
      meaning: 'O Allah, I seek refuge in You from grief and sadness, helplessness and laziness, cowardice and stinginess, and being overpowered by debt and men.',
      source: 'Sahih al-Bukhari 6369',
      benefit: 'Comprehensive protection from mental anguish and life burdens.',
    },
    {
      id: 'dua_forgiveness_1',
      title: 'Sayyid al-Istighfar (Chief of Forgiveness)',
      category: 'forgiveness',
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      transliteration: 'Allahumma Anta Rabbi la ilaha illa Ant, khalaqtani wa ana \'abduk, wa ana \'ala \'ahdika wa wa\'dika mastata\'t, a\'udhu bika min sharri ma sana\'t, abu\'u laka bi ni\'matika \'alay, wa abu\'u bi dhanbi faghfir li, fa innahu la yaghfirudh-dhunuba illa Ant.',
      meaning: 'O Allah, You are my Lord, none has the right to be worshiped but You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.',
      source: 'Sahih al-Bukhari 6306',
      benefit: 'Whoever recites it with certainty and dies that day/night enters Paradise.',
    },
    {
      id: 'dua_protection_1',
      title: 'Protection from Harm (Morning & Evening)',
      category: 'protection',
      arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
      transliteration: 'Bismillahil-ladhi la yadurru ma\'as-mihi shay\'un fil-ardi wa la fis-sama\'i wa Huwas-Sami\'ul-\'Alim.',
      meaning: 'In the Name of Allah with Whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
      source: 'Sunan Abi Dawud 5088',
      benefit: 'Recite 3 times in the morning and evening for complete divine protection.',
    },
    {
      id: 'dua_adhkar_1',
      title: 'Tawakkul when Leaving Home',
      category: 'adhkar',
      arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
      transliteration: 'Bismillahi, tawakkaltu \'alallah, la hawla wa la quwwata illa billah.',
      meaning: 'In the name of Allah, I place my trust in Allah; there is no power nor strength except with Allah.',
      source: 'Sunan Abi Dawud 5095',
      benefit: 'You are guided, defended, and protected, and Shaytan turns away from you.',
    },
    {
      id: 'dua_gratitude_1',
      title: 'Du\'a for Steadfastness in Devotion',
      category: 'gratitude',
      arabic: 'اللَّهُمَّ أَعِّنِي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
      transliteration: 'Allahumma a\'inni \'ala dhikrika wa shukrika wa husni \'ibadatik.',
      meaning: 'O Allah, help me to remember You, give thanks to You, and worship You in the best manner.',
      source: 'Sunan Abi Dawud 1522',
      benefit: 'Recommended by the Prophet ﷺ to be recited after every single prayer.',
    },
    {
      id: 'dua_gratitude_2',
      title: 'Heart Transformation & Guidance',
      category: 'gratitude',
      arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
      transliteration: 'Ya Muqallibal-qulub, thabbit qalbi \'ala dinik.',
      meaning: 'O Turner of the hearts, keep my heart firm upon Your religion.',
      source: 'Jami` at-Tirmidhi 2140',
      benefit: 'The most frequent supplication of Prophet Muhammad ﷺ.',
    },
  ];

  for (const d of defaultDuas) {
    await db.runAsync(
      `INSERT OR IGNORE INTO duas (id, title, category, arabic, transliteration, meaning, source, benefit, is_bookmarked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [d.id, d.title, d.category, d.arabic, d.transliteration, d.meaning, d.source, d.benefit]
    );
  }
}
