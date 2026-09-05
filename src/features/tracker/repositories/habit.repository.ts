import { getDatabase } from '@/core/database/db';
import { getTodayDateString } from '../../../core/utils/date';
import { HabitCategory, HabitItemUIModel } from '../models/habit.model';


export class HabitRepository {
  async initHabitsTable(): Promise<void> {
    const db = await getDatabase();
    try {
      await db.execAsync('ALTER TABLE habits ADD COLUMN required_streak INTEGER DEFAULT 0');
    } catch {}
  }

  async getHabitsForDate(dateKey: string, currentStreak: number = 0): Promise<HabitItemUIModel[]> {
    await this.initHabitsTable();
    const db = await getDatabase();
    const safeDate = String(dateKey || getTodayDateString());

    const rows = await db.getAllAsync<{
      id: string;
      name: string;
      category: string;
      benefit: string;
      tag: string;
      sort_order: number;
      required_streak: number | null;
      completed: number | null;
    }>(
      `
      SELECT 
        h.id, 
        h.name, 
        h.category, 
        h.benefit, 
        h.tag, 
        h.sort_order,
        h.required_streak,
        hl.completed
      FROM habits h
      LEFT JOIN habit_logs hl ON h.id = hl.habit_id AND hl.date_key = ?
      ORDER BY (CASE WHEN hl.completed = 1 THEN 1 ELSE 0 END) ASC, (CASE WHEN h.required_streak > ? THEN 1 ELSE 0 END) ASC, h.sort_order ASC
      `,
      [safeDate, currentStreak]
    );

    return rows.map((row) => {
      const required = row.required_streak || 0;
      const isLocked = currentStreak < required;
      return {
        id: row.id,
        name: row.name,
        category: row.category as HabitCategory,
        benefit: row.benefit,
        tag: row.tag,
        isCompleted: row.completed === 1,
        sortOrder: row.sort_order,
        requiredStreak: required,
        isLocked,
      };
    });
  }


  async toggleHabitStatus(habitId: string, dateKey: string, currentlyCompleted: boolean): Promise<boolean> {
    const db = await getDatabase();
    if (currentlyCompleted) {
      await db.runAsync('DELETE FROM habit_logs WHERE habit_id = ? AND date_key = ?', [habitId, dateKey]);
      return false;
    } else {
      const logId = `${habitId}_${dateKey}`;
      await db.runAsync(
        'INSERT OR REPLACE INTO habit_logs (id, habit_id, date_key, completed) VALUES (?, ?, ?, 1)',
        [logId, habitId, dateKey]
      );
      return true;
    }
  }

  async calculateStreak(): Promise<number> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ date_key: string; count: number }>(
      `
      SELECT date_key, COUNT(*) as count 
      FROM habit_logs 
      WHERE completed = 1 
      GROUP BY date_key 
      ORDER BY date_key DESC
      `
    );

    const completedMap = new Map<string, number>();
    rows.forEach((r: { date_key: string; count: number }) => completedMap.set(r.date_key, r.count));

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const todayCount = completedMap.get(todayKey) || 0;

    let streak = 0;
    const date = new Date(today);

    // If today is completed (>= 5 deeds), include today in streak
    if (todayCount >= 5) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      // If today is not completed yet, calculate existing active streak starting from yesterday
      date.setDate(date.getDate() - 1);
    }

    // Count backward consecutively from past days
    while (true) {
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const count = completedMap.get(key) || 0;
      if (count >= 5) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  async getWeeklyCompletionStatus(): Promise<Record<string, number>> {
    const db = await getDatabase();
    // Get Monday of current week
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);

    const dateKeys: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dateKeys.push(key);
    }

    const placeholders = dateKeys.map(() => '?').join(',');
    const rows = await db.getAllAsync<{ date_key: string; count: number }>(
      `
      SELECT date_key, COUNT(*) as count 
      FROM habit_logs 
      WHERE completed = 1 AND date_key IN (${placeholders})
      GROUP BY date_key
      `,
      dateKeys
    );

    const result: Record<string, number> = {};
    // Initialize all dates with 0
    dateKeys.forEach((key) => {
      result[key] = 0;
    });
    rows.forEach((r) => {
      result[r.date_key] = r.count;
    });

    return result;
  }

  async addHabit(data: { name: string; category: string; benefit: string; tag: string }): Promise<void> {
    const db = await getDatabase();
    const id = `custom_${Date.now()}`;
    const maxOrderRow = await db.getFirstAsync<{ max_order: number }>('SELECT MAX(sort_order) as max_order FROM habits');
    const newOrder = (maxOrderRow?.max_order || 0) + 1;

    await db.runAsync(
      'INSERT INTO habits (id, name, category, benefit, tag, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [id, data.name, data.category, data.benefit || 'Spiritual Growth', data.tag || 'Custom', newOrder]
    );
  }

  async deleteHabit(habitId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM habit_logs WHERE habit_id = ?', [habitId]);
    await db.runAsync('DELETE FROM habits WHERE id = ?', [habitId]);
  }
}

export const habitRepository = new HabitRepository();

