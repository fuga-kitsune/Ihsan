import { getDatabase } from '../../../core/database/db';
import { AnalyticsSummary, HeartStateCount, HeatmapDay, CategoryBreakdown, HasanatSummary } from '../models/analytics.model';

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

    // 4. Category breakdown
    const categoryRows = await db.getAllAsync<{ category: string; count: number }>(
      `SELECT h.category, COUNT(*) as count 
       FROM habit_logs hl 
       JOIN habits h ON hl.habit_id = h.id 
       WHERE hl.completed = 1 AND hl.date_key LIKE ? 
       GROUP BY h.category`,
      [`${monthPrefix}-%`]
    );

    const categoryLabels: Record<string, string> = {
      prayers: 'Obligatory & Sunnah Prayers',
      quran: 'Daily Quran Recitation',
      dhikr: 'Morning, Evening & Daily Dhikr',
      deeds: 'Acts of Sadaqah & Character',
    };

    const categoryBreakdown: CategoryBreakdown[] = Object.keys(categoryLabels).map((cat) => {
      const found = categoryRows.find((r) => r.category === cat);
      const count = found?.count || 0;
      const pct = totalDeeds > 0 ? Math.round((count / totalDeeds) * 100) : 0;
      return {
        category: cat,
        label: categoryLabels[cat],
        completedCount: count,
        percentage: pct,
      };
    });

    // 5. Calculate Hasanat
    // In Quran (Surah Al-An'am 6:160): "Whoever brings a good deed shall have ten times the like thereof to his credit"
    // Fard Prayer / Quran / Sunnah / Dhikr / Sadaqah
    // Base estimation: 1 deed = 100 hasanat (multiplied at least 10x to 700x as in authentic Hadith)
    const totalAllTimeDeedsRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM habit_logs WHERE completed = 1'
    );
    const totalAllTimeDeeds = totalAllTimeDeedsRow?.count || 0;

    const monthHasanat = totalDeeds * 100;
    const totalEstimatedHasanat = totalAllTimeDeeds * 100;

    const hasanatSummary: HasanatSummary = {
      totalEstimatedHasanat,
      monthHasanat,
      multiplierRank: '10x to 700x Divine Promise',
      hadithWisdom: 'مَن جَاءَ بِالْحَسَنَةِ فَلَهُ عَشْرُ أَمْثَالِهَا\n"Whoever comes with a good deed will have ten times the like thereof to his credit." — (Surah Al-An\'am 6:160)',
    };

    // 6. Streaks
    const allActiveDays = await db.getAllAsync<{ date_key: string }>(
      'SELECT DISTINCT date_key FROM habit_logs WHERE completed = 1 ORDER BY date_key ASC'
    );
    let bestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    allActiveDays.forEach((row) => {
      const d = new Date(row.date_key);
      if (prevDate) {
        const diffTime = d.getTime() - prevDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak;
      prevDate = d;
    });

    // 7. Heart state distribution for this month
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
      categoryBreakdown,
      hasanatSummary,
      totalDeedsCompleted: totalDeeds,
      averageCompletionRate: elapsedDaysInMonth > 0 ? Math.round(sumPercentages / elapsedDaysInMonth) : 0,
      activeDaysCount: daysWithActivity,
      currentStreak: daysWithActivity > 0 ? tempStreak : 0,
      bestStreak: Math.max(bestStreak, daysWithActivity > 0 ? tempStreak : 0),
      monthTitle,
      isCurrentMonth,
    };
  }
}

export const analyticsRepository = new AnalyticsRepository();

