import { getDatabase } from '@/core/database/db';
import { AppSettings, DEFAULT_SETTINGS } from '../models/settings.model';

export class SettingsRepository {
  async getSettings(): Promise<AppSettings> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM settings');
    const map = new Map<string, string>();
    rows.forEach((r: { key: string; value: string }) => map.set(r.key, r.value));

    return {
      hijriOffsetDays: map.has('hijriOffsetDays') ? parseInt(map.get('hijriOffsetDays')!, 10) : DEFAULT_SETTINGS.hijriOffsetDays,
      eveningReminderEnabled: map.has('eveningReminderEnabled') ? map.get('eveningReminderEnabled') === '1' : DEFAULT_SETTINGS.eveningReminderEnabled,
      eveningReminderHour: map.has('eveningReminderHour') ? parseInt(map.get('eveningReminderHour')!, 10) : DEFAULT_SETTINGS.eveningReminderHour,
      eveningReminderMinute: map.has('eveningReminderMinute') ? parseInt(map.get('eveningReminderMinute')!, 10) : DEFAULT_SETTINGS.eveningReminderMinute,
      morningReminderEnabled: map.has('morningReminderEnabled') ? map.get('morningReminderEnabled') === '1' : DEFAULT_SETTINGS.morningReminderEnabled,
      fridayReminderEnabled: map.has('fridayReminderEnabled') ? map.get('fridayReminderEnabled') === '1' : DEFAULT_SETTINGS.fridayReminderEnabled,
      hasCompletedOnboarding: map.has('hasCompletedOnboarding') ? map.get('hasCompletedOnboarding') === '1' : false,
    };
  }

  async saveSetting(key: keyof AppSettings, value: any): Promise<void> {
    const db = await getDatabase();
    const strVal = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
    await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, strVal]);
  }

  async wipeAllData(): Promise<void> {
    const db = await getDatabase();
    // 1. Wipe all tracking logs and reflections
    await db.runAsync('DELETE FROM habit_logs');
    await db.runAsync('DELETE FROM reflections');
    
    // 2. Wipe all weekly goals/niyyahs
    await db.runAsync('DELETE FROM niyyahs');
    
    // 3. Reset all spiritual quests progress back to 0
    await db.runAsync('UPDATE spiritual_quests SET current_count = 0, is_completed = 0');
    
    // 4. Reset habits back to original defaults (delete custom added ones)
    await db.runAsync('DELETE FROM habits WHERE id LIKE "custom_%"');
    
    // 5. Reset settings
    await db.runAsync('DELETE FROM settings');
  }

}

export const settingsRepository = new SettingsRepository();
