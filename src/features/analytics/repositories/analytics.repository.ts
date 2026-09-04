import { getDatabase } from '../../../core/database/db';
import { AnalyticsSummary, HeartStateCount, HeatmapDay } from '../models/analytics.model';

export class AnalyticsRepository {

  async getAnalyticsSummary(monthOffset: number = 0): Promise<AnalyticsSummary> {
    const db = await getDatabase();

    // 1. Determine month and date range
    const targetDate = new Date();
    targetDate.setDate(1); // Set to 1st to prevent rollover
    targetDate.setMonth(targetDate.getMonth() + monthOffset);

    const year = targetDate.getFullYear();
    const monthIndex = targetDate.getMonth(); // 0-indexed
    const monthTitle = targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const isCurrentMonth = monthOffset === 0;

    // Days in target month
    const totalDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // 2. Get total habits count
    const habitsCountRow = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM habits');
    const totalHabitsCount = habitsCountRow?.count || 10;

    // 3. Fetch logs for this month
    const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    const logs = await db.getAllAsync<{ date_key: string; count: number }>(
      'SELECT date_key, COUNT(*) as count FROM habit_logs WHERE completed = 1 AND date_key LIKE ? GROUP BY date_key',
      [`${monthPrefix}-%`]
    );
    const logsMap = new Map<string, number>();
    logs.forEach((l: { date_key: string; count: number; }) => logsMap.set(l.date_key, l.count));

    const heatmapDays: HeatmapDay[] = [];
    let totalDeeds = 0;
    let daysWithActivity = 0;
    let sumPercentages = 0;

    const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateKey = `${monthPrefix}-${String(day).padStart(2, '0')}`;
      const d = new Date(year, monthIndex, day);

      const completed = logsMap.get(dateKey) || 0;
      const percentage = totalHabitsCount > 0 ? Math.round((completed / totalHabitsCount) * 100) : 0;

      if (dateKey <= todayStr) {
        totalDeeds += completed;
        if (completed > 0) daysWithActivity++;
        sumPercentages += percentage;
      }

      heatmapDays.push({
        dateKey,
        dayNumber: day,
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        completedCount: completed,
        totalCount: totalHabitsCount,
        percentage: dateKey > todayStr ? 0 : percentage,
      });
    }

    // 4. Heart state distribution for this month
    const reflections = await db.getAllAsync<{ heart_state: string }>(
      'SELECT heart_state FROM reflections WHERE date_key LIKE ? AND heart_state IS NOT NULL AND heart_state != ""',
      [`${monthPrefix}-%`]
    );

    const heartCounts: Record<string, number> = {
      shukr: 0,
      tawakkul: 0,
      himmah: 0,
      sabr: 0,
      istighfar: 0,
    };

    reflections.forEach((r: { heart_state: string }) => {
      if (heartCounts[r.heart_state] !== undefined) {
        heartCounts[r.heart_state]++;
      }
    });

    const totalRecordedHearts = reflections.length || 1;

    const heartDistribution: HeartStateCount[] = [
      {
        id: 'shukr',
        arabicTitle: 'Alhamdulillah',
        label: 'Contentment & Shukr',
        count: heartCounts.shukr,
        percentage: Math.round((heartCounts.shukr / totalRecordedHearts) * 100),
        color: '#1E3A2F',
      },
      {
        id: 'tawakkul',
        arabicTitle: 'Tawakkul',
        label: 'Trusting Allah',
        count: heartCounts.tawakkul,
        percentage: Math.round((heartCounts.tawakkul / totalRecordedHearts) * 100),
        color: '#B45309',
      },
      {
        id: 'himmah',
        arabicTitle: 'Himmah',
        label: 'High Devotion Energy',
        count: heartCounts.himmah,
        percentage: Math.round((heartCounts.himmah / totalRecordedHearts) * 100),
        color: '#0D9488',
      },
      {
        id: 'sabr',
        arabicTitle: 'Sabr',
        label: 'Patience in Hardship',
        count: heartCounts.sabr,
        percentage: Math.round((heartCounts.sabr / totalRecordedHearts) * 100),
        color: '#6366F1',
      },
      {
        id: 'istighfar',
        arabicTitle: 'Astaghfirullah',
        label: 'Seeking Forgiveness',
        count: heartCounts.istighfar,
        percentage: Math.round((heartCounts.istighfar / totalRecordedHearts) * 100),
        color: '#C25E6B',
      },
    ];

    const elapsedDaysInMonth = isCurrentMonth ? new Date().getDate() : totalDaysInMonth;

    return {
      heatmapDays,
      heartDistribution,
      totalDeedsCompleted: totalDeeds,
      averageCompletionRate: elapsedDaysInMonth > 0 ? Math.round(sumPercentages / elapsedDaysInMonth) : 0,
      activeDaysCount: daysWithActivity,
      monthTitle,
      isCurrentMonth,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();

