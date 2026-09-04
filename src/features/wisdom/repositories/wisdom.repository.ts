import { getDatabase } from '@/core/database/db';
import { WisdomUIModel } from '../models/wisdom.model';

export class WisdomRepository {
  async getTodayWisdom(): Promise<WisdomUIModel> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ id: string; title: string; arabic: string; meaning: string; source: string }>(
      'SELECT id, title, arabic, meaning, source FROM wisdoms'
    );

    if (!rows || rows.length === 0) {
      return {
        id: 'fallback',
        title: 'Tawakkul',
        arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
        meaning: 'And whoever relies upon Allah – then He is sufficient for him.',
        source: 'Surah At-Talaq (65:3)',
      };
    }

    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = Math.abs(dayOfYear) % rows.length;
    return rows[index];
  }
}

export const wisdomRepository = new WisdomRepository();
