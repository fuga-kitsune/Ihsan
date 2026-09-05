import { getDatabase } from '../../../core/database/db';
import { DuaCategory, DuaItem } from '../models/dua.model';

export class DuaRepository {
  async initDuaTable(): Promise<void> {
    // Schema creation and seeding is handled centrally in core/database/db.ts
  }

  async getDuas(category: DuaCategory = 'all', searchQuery: string = ''): Promise<DuaItem[]> {
    const db = await getDatabase();

    let query = 'SELECT * FROM duas WHERE 1=1';
    const params = [];

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
