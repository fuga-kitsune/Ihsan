import { getDatabase } from '../../../database/db';
import { DuaItem, DuaCategory } from '../models/dua.model';

export class DuaRepository {
  async initDuaTable(): Promise<void> {
    const db = await getDatabase();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS duas (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        arabic TEXT NOT NULL,
        transliteration TEXT NOT NULL,
        meaning TEXT NOT NULL,
        source TEXT NOT NULL,
        benefit TEXT NOT NULL,
        is_bookmarked INTEGER DEFAULT 0
      );
    `);

    const countRow = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM duas');
    if (!countRow || countRow.count === 0) {
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
          arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
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
  }

  async getDuas(category: DuaCategory = 'all', searchQuery: string = ''): Promise<DuaItem[]> {
    await this.initDuaTable();
    const db = await getDatabase();

    let query = 'SELECT * FROM duas WHERE 1=1';
    const params: any[] = [];

    if (category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (searchQuery.trim().length > 0) {
      query += ' AND (title LIKE ? OR meaning LIKE ? OR transliteration LIKE ?)';
      const term = `%${searchQuery.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY id ASC';

    const rows = await db.getAllAsync<{
      id: string;
      title: string;
      category: string;
      arabic: string;
      transliteration: string;
      meaning: string;
      source: string;
      benefit: string;
      is_bookmarked: number;
    }>(query, params);

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      category: r.category as DuaCategory,
      arabic: r.arabic,
      transliteration: r.transliteration,
      meaning: r.meaning,
      source: r.source,
      benefit: r.benefit,
      isBookmarked: r.is_bookmarked === 1,
    }));
  }

  async toggleBookmark(duaId: string, currentStatus: boolean): Promise<boolean> {
    const db = await getDatabase();
    const newStatus = currentStatus ? 0 : 1;
    await db.runAsync('UPDATE duas SET is_bookmarked = ? WHERE id = ?', [newStatus, duaId]);
    return !currentStatus;
  }
}

export const duaRepository = new DuaRepository();
