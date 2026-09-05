import { getDatabase } from '@/core/database/db';
import { SpiritualQuest, INITIAL_QUESTS } from '../models/quest.model';

export class QuestRepository {
  async initQuestTable(): Promise<void> {
    // Handled by core database initialization
  }

  async getAllQuests(currentStreak: number = 0): Promise<SpiritualQuest[]> {
    await this.initQuestTable();
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];

    // Auto-reset daily quests if their last_updated_date is from a previous day
    await db.runAsync(
      `UPDATE spiritual_quests
       SET current_count = 0, is_completed = 0
       WHERE (period = 'Daily' OR id = 'quest_istighfar')
         AND last_updated_date != ''
         AND last_updated_date != ?`,
      [today]
    );

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
      last_updated_date: string | null;
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
        lastUpdatedDate: r.last_updated_date || undefined,
      };
    });
  }

  async incrementQuest(id: string, amount: number = 1): Promise<SpiritualQuest | null> {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];

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
      last_updated_date: string | null;
    }>('SELECT * FROM spiritual_quests WHERE id = ?', [id]);

    if (!quest) return null;

    // Check if daily quest needs rollover reset before incrementing
    let startCount = quest.current_count;
    if ((quest.period === 'Daily' || quest.id === 'quest_istighfar') && quest.last_updated_date && quest.last_updated_date !== today) {
      startCount = 0;
    }

    const newCount = Math.max(0, Math.min(startCount + amount, quest.target_count));
    const isCompleted = newCount >= quest.target_count ? 1 : 0;

    await db.runAsync(
      'UPDATE spiritual_quests SET current_count = ?, is_completed = ?, last_updated_date = ? WHERE id = ?',
      [newCount, isCompleted, today, id]
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
      lastUpdatedDate: today,
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
