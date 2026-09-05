import { getDatabase } from '@/core/database/db';
import { SpiritualQuest, INITIAL_QUESTS } from '../models/quest.model';

export class QuestRepository {
  async initQuestTable(): Promise<void> {
    const db = await getDatabase();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS spiritual_quests (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        period TEXT NOT NULL,
        description TEXT NOT NULL,
        benefit TEXT NOT NULL,
        target_count INTEGER NOT NULL,
        current_count INTEGER DEFAULT 0,
        is_completed INTEGER DEFAULT 0,
        unit TEXT NOT NULL,
        icon_name TEXT NOT NULL,
        required_streak INTEGER DEFAULT 0
      );
    `);

    try {
      await db.execAsync('ALTER TABLE spiritual_quests ADD COLUMN required_streak INTEGER DEFAULT 0');
    } catch {}

    // Seed or sync defaults
    for (const q of INITIAL_QUESTS) {
      const exists = await db.getFirstAsync<{ id: string }>('SELECT id FROM spiritual_quests WHERE id = ?', [q.id]);
      if (!exists) {
        await db.runAsync(
          `INSERT INTO spiritual_quests (id, title, category, period, description, benefit, target_count, current_count, is_completed, unit, icon_name, required_streak)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [q.id, q.title, q.category, q.period, q.description, q.benefit, q.targetCount, q.currentCount, q.isCompleted ? 1 : 0, q.unit, q.iconName, q.requiredStreak ?? 0]
        );
      } else {
        await db.runAsync(
          'UPDATE spiritual_quests SET title = ?, description = ?, target_count = ?, unit = ?, required_streak = ? WHERE id = ?',
          [q.title, q.description, q.targetCount, q.unit, q.requiredStreak ?? 0, q.id]
        );
      }
    }
  }

  async getAllQuests(currentStreak: number = 0): Promise<SpiritualQuest[]> {
    await this.initQuestTable();
    const db = await getDatabase();
    const rows = await db.getAllAsync<{
      id: string;
      title: string;
      category: string;
      period: string;
      description: string;
      benefit: string;
      target_count: number;
      current_count: number;
      is_completed: number;
      unit: string;
      icon_name: string;
      required_streak: number | null;
    }>('SELECT * FROM spiritual_quests ORDER BY is_completed ASC, required_streak ASC, period DESC');

    return rows.map((r) => {
      const reqStreak = r.required_streak || 0;
      const isLocked = currentStreak < reqStreak;
      return {
        id: r.id,
        title: r.title,
        category: r.category as any,
        period: r.period as any,
        description: r.description,
        benefit: r.benefit,
        targetCount: r.target_count,
        currentCount: r.current_count,
        isCompleted: r.is_completed === 1,
        unit: r.unit,
        iconName: r.icon_name,
        requiredStreak: reqStreak,
        isLocked,
      };
    });
  }

  async incrementQuest(id: string, amount: number = 1): Promise<SpiritualQuest | null> {
    const db = await getDatabase();
    const quest = await db.getFirstAsync<{
      id: string;
      title: string;
      category: string;
      period: string;
      description: string;
      benefit: string;
      target_count: number;
      current_count: number;
      is_completed: number;
      unit: string;
      icon_name: string;
    }>('SELECT * FROM spiritual_quests WHERE id = ?', [id]);

    if (!quest) return null;

    const newCount = Math.min(quest.current_count + amount, quest.target_count);
    const isCompleted = newCount >= quest.target_count ? 1 : 0;

    await db.runAsync(
      'UPDATE spiritual_quests SET current_count = ?, is_completed = ? WHERE id = ?',
      [newCount, isCompleted, id]
    );

    return {
      ...quest,
      category: quest.category as any,
      period: quest.period as any,
      targetCount: quest.target_count,
      currentCount: newCount,
      isCompleted: isCompleted === 1,
      unit: quest.unit,
      iconName: quest.icon_name,
    };
  }

  async resetQuest(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('UPDATE spiritual_quests SET current_count = 0, is_completed = 0 WHERE id = ?', [id]);
  }

  async addCustomQuest(quest: Omit<SpiritualQuest, 'id' | 'currentCount' | 'isCompleted'>): Promise<void> {
    const db = await getDatabase();
    const id = `custom_quest_${Date.now()}`;
    await db.runAsync(
      `INSERT INTO spiritual_quests (id, title, category, period, description, benefit, target_count, current_count, is_completed, unit, icon_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`,
      [id, quest.title, quest.category, quest.period, quest.description, quest.benefit, quest.targetCount, quest.unit, quest.iconName]
    );
  }
}

export const questRepository = new QuestRepository();
