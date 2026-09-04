import { getDatabase } from '@/core/database/db';
import { NiyyahItem, NiyyahTimeframe } from '../models/niyyah.model';

export class NiyyahRepository {
  async initNiyyahTable(): Promise<void> {
    const db = await getDatabase();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS niyyahs (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        timeframe TEXT NOT NULL,
        category TEXT NOT NULL,
        target_date TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL,
        completed_at INTEGER
      );
    `);
    try {
      await db.execAsync('ALTER TABLE niyyahs ADD COLUMN completed_at INTEGER');
    } catch { }
  }

  async getActiveNiyyah(): Promise<NiyyahItem | null> {
    await this.initNiyyahTable();
    const db = await getDatabase();
    const row = await db.getFirstAsync<{
      id: string;
      title: string;
      timeframe: string;
      category: string;
      target_date: string;
      is_completed: number;
      created_at: number;
      completed_at?: number | null;
    }>('SELECT * FROM niyyahs ORDER BY created_at DESC LIMIT 1');

    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      timeframe: row.timeframe as NiyyahTimeframe,
      category: row.category,
      targetDate: row.target_date,
      isCompleted: row.is_completed === 1,
      createdAt: row.created_at,
      completedAt: row.completed_at,
    };
  }

  async getAllNiyyahs(): Promise<NiyyahItem[]> {
    await this.initNiyyahTable();
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      id: string;
      title: string;
      timeframe: string;
      category: string;
      target_date: string;
      is_completed: number;
      created_at: number;
      completed_at?: number | null;
    }>('SELECT * FROM niyyahs ORDER BY created_at DESC');

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      timeframe: r.timeframe as NiyyahTimeframe,
      category: r.category,
      targetDate: r.target_date,
      isCompleted: r.is_completed === 1,
      createdAt: r.created_at,
      completedAt: r.completed_at,
    }));
  }

  async setNiyyah(title: string, timeframe: NiyyahTimeframe, category: string = 'General'): Promise<NiyyahItem> {
    await this.initNiyyahTable();
    const db = await getDatabase();

    // Check if there is an active in-progress niyyah
    const active = await db.getFirstAsync<{ id: string; created_at: number }>(
      'SELECT id, created_at FROM niyyahs WHERE is_completed = 0 ORDER BY created_at DESC LIMIT 1'
    );

    if (active) {
      // UPDATE the current in-progress Niyyah so it does not spam duplicates
      await db.runAsync(
        'UPDATE niyyahs SET title = ?, timeframe = ?, category = ? WHERE id = ?',
        [title, timeframe, category, active.id]
      );
      return {
        id: active.id,
        title,
        timeframe,
        category,
        targetDate: '',
        isCompleted: false,
        createdAt: active.created_at,
        completedAt: null,
      };
    }

    // Otherwise create new Niyyah entry
    const id = `niyyah_${Date.now()}`;
    const now = Date.now();

    await db.runAsync(
      'INSERT INTO niyyahs (id, title, timeframe, category, target_date, is_completed, created_at, completed_at) VALUES (?, ?, ?, ?, ?, 0, ?, NULL)',
      [id, title, timeframe, category, '', now]
    );

    return {
      id,
      title,
      timeframe,
      category,
      targetDate: '',
      isCompleted: false,
      createdAt: now,
      completedAt: null,
    };
  }


  async toggleNiyyahComplete(id: string, currentStatus: boolean): Promise<{ isCompleted: boolean; completedAt: number | null }> {
    const db = await getDatabase();
    const newStatus = currentStatus ? 0 : 1;
    const completedAt = newStatus === 1 ? Date.now() : null;

    await db.runAsync('UPDATE niyyahs SET is_completed = ?, completed_at = ? WHERE id = ?', [newStatus, completedAt, id]);
    return { isCompleted: newStatus === 1, completedAt };
  }
}

export const niyyahRepository = new NiyyahRepository();

