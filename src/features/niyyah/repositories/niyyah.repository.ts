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

  // Helper to get current week key (e.g., 2026-W36)
  getWeekKey(d: Date = new Date()): string {
    const dCopy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = dCopy.getUTCDay() || 7;
    dCopy.setUTCDate(dCopy.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(dCopy.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((dCopy.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return `${dCopy.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  }

  async getActiveNiyyahs(timeframe?: NiyyahTimeframe): Promise<NiyyahItem[]> {
    await this.initNiyyahTable();
    const db = await getDatabase();
    const currentWeekKey = this.getWeekKey();

    // Query weekly goals set for this week (target_date stores week key)
    const query = `
      SELECT * FROM niyyahs 
      WHERE timeframe = 'weekly' AND (target_date = ? OR (target_date = '' AND is_completed = 0))
      ORDER BY created_at ASC LIMIT 3
    `;

    const rows = await db.getAllAsync<{
      id: string;
      title: string;
      timeframe: string;
      category: string;
      target_date: string;
      is_completed: number;
      created_at: number;
      completed_at?: number | null;
    }>(query, [currentWeekKey]);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      timeframe: row.timeframe as NiyyahTimeframe,
      category: row.category,
      targetDate: row.target_date,
      isCompleted: row.is_completed === 1,
      createdAt: row.created_at,
      completedAt: row.completed_at,
    }));
  }

  async getActiveNiyyah(timeframe?: NiyyahTimeframe): Promise<NiyyahItem | null> {
    const activeList = await this.getActiveNiyyahs(timeframe);
    return activeList.length > 0 ? activeList[0] : null;
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

  async setNiyyah(title: string, timeframe: NiyyahTimeframe, category: string = 'General'): Promise<NiyyahItem | null> {
    await this.initNiyyahTable();
    const db = await getDatabase();
    const weekKey = this.getWeekKey();

    // Prevent selecting the exact same goal more than once in the same week
    const existing = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM niyyahs WHERE timeframe = ? AND (target_date = ? OR target_date = "") AND LOWER(title) = LOWER(?)',
      [timeframe, weekKey, title.trim()]
    );

    if (existing) {
      return null;
    }

    // Check count of weekly goals committed for this week
    const countRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM niyyahs WHERE timeframe = ? AND (target_date = ? OR target_date = "")',
      [timeframe, weekKey]
    );

    if (countRow && countRow.count >= 3) {
      // Cannot add more than 3 active goals for this week
      return null;
    }

    // Create new Niyyah entry locked to this week
    const id = `niyyah_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const now = Date.now();

    await db.runAsync(
      'INSERT INTO niyyahs (id, title, timeframe, category, target_date, is_completed, created_at, completed_at) VALUES (?, ?, ?, ?, ?, 0, ?, NULL)',
      [id, title, timeframe, category, weekKey, now]
    );

    return {
      id,
      title,
      timeframe,
      category,
      targetDate: weekKey,
      isCompleted: false,
      createdAt: now,
      completedAt: null,
    };
  }

  async deleteNiyyah(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM niyyahs WHERE id = ?', [id]);
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

