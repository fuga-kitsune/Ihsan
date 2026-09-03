import { getDatabase } from '../../../database/db';
import { ReflectionUIModel } from '../models/reflection.model';
import { getTodayDateString } from '../../../core/utils/date';


export interface DailyHistoryRecord {
  dateKey: string;
  heartState: string;
  reflectionContent: string;
  completedTasksCount: number;
  totalTasksCount: number;
}

export class ReflectionRepository {
  async getReflectionForDate(dateKey: string): Promise<ReflectionUIModel> {
    const db = await getDatabase();
    const safeDate = String(dateKey || getTodayDateString());
    try {
      await db.execAsync('ALTER TABLE reflections ADD COLUMN heart_state TEXT DEFAULT ""');
    } catch {}

    const row = await db.getFirstAsync<{ date_key: string; content: string; heart_state?: string; updated_at: number }>(
      'SELECT date_key, content, heart_state, updated_at FROM reflections WHERE date_key = ?',
      [safeDate]
    );

    if (!row) {
      return {
        dateKey: safeDate,
        content: '',
        heartState: '',
        updatedAt: Date.now(),
      };
    }

    return {
      dateKey: row.date_key,
      content: row.content,
      heartState: row.heart_state || '',
      updatedAt: row.updated_at,
    };
  }


  async saveReflection(dateKey: string, content: string, heartState: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO reflections (date_key, content, heart_state, updated_at) VALUES (?, ?, ?, ?)',
      [dateKey, content, heartState, Date.now()]
    );
  }

  async getHistoryArchive(): Promise<DailyHistoryRecord[]> {
    const db = await getDatabase();
    
    // Total habits count
    const habitsCountRow = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM habits');
    const totalCount = habitsCountRow?.count || 10;

    // Get all completed counts by date
    const logRows = await db.getAllAsync<{ date_key: string; count: number }>(
      'SELECT date_key, COUNT(*) as count FROM habit_logs WHERE completed = 1 GROUP BY date_key'
    );
    const logsMap = new Map<string, number>();
    logRows.forEach((r) => logsMap.set(r.date_key, r.count));

    // Get all reflections
    const reflectionRows = await db.getAllAsync<{ date_key: string; content: string; heart_state?: string }>(
      'SELECT date_key, content, heart_state FROM reflections ORDER BY date_key DESC'
    );

    const allDates = new Set<string>();
    logRows.forEach((r) => allDates.add(r.date_key));
    reflectionRows.forEach((r) => allDates.add(r.date_key));

    const reflectionsMap = new Map<string, { content: string; heart_state: string }>();
    reflectionRows.forEach((r) => reflectionsMap.set(r.date_key, { content: r.content, heart_state: r.heart_state || '' }));

    const sortedDates = Array.from(allDates).sort((a, b) => b.localeCompare(a));

    return sortedDates.map((dKey) => {
      const ref = reflectionsMap.get(dKey);
      return {
        dateKey: dKey,
        heartState: ref?.heart_state || '',
        reflectionContent: ref?.content || '',
        completedTasksCount: logsMap.get(dKey) || 0,
        totalTasksCount: totalCount,
      };
    });
  }
}

export const reflectionRepository = new ReflectionRepository();

