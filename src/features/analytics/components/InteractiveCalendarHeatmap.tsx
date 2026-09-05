import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { HeatmapDay } from '../models/analytics.model';
import { THEME } from '../../../core/constants/theme';
import { habitRepository } from '../../tracker/repositories/habit.repository';
import { HabitItemUIModel } from '../../tracker/models/habit.model';
import { getTodayDateString } from '../../../core/utils/date';

interface InteractiveCalendarHeatmapProps {
  days: HeatmapDay[];
  title?: string;
}

export const InteractiveCalendarHeatmap: React.FC<InteractiveCalendarHeatmapProps> = ({ days, title }) => {
  const todayStr = getTodayDateString();
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => {
    const todayInMonth = days.find((d) => d.dateKey === todayStr);
    return todayInMonth ? todayInMonth.dateKey : days[days.length - 1]?.dateKey || todayStr;
  });

  const [dayHabits, setDayHabits] = useState<HabitItemUIModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDateKey) return;
    setLoading(true);
    habitRepository.getHabitsForDate(selectedDateKey, 100).then((habits) => {
      setDayHabits(habits);
      setLoading(false);
    });
  }, [selectedDateKey]);

  const getColorForPercentage = (p: number, isFuture: boolean) => {
    if (isFuture) return '#F3F2EE';
    if (p >= 80) return '#1E3A2F'; // High Devotion
    if (p >= 50) return '#4ADE80'; // Moderate Devotion
    if (p >= 20) return '#BBF7D0'; // Subtle Devotion
    return THEME.colors.bgCardSubtle; // Inactive
  };

  const selectedDay = days.find((d) => d.dateKey === selectedDateKey);
  const completedHabits = dayHabits.filter((h) => h.isCompleted);
  const uncompletedHabits = dayHabits.filter((h) => !h.isCompleted && !h.isLocked);

  return (
    <View style={styles.container}>
      {/* Calendar Grid Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.tag}>INTERACTIVE DEVOTION GRID</Text>
            <Text style={styles.title}>{title || 'Monthly Grid'}</Text>
          </View>

          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: THEME.colors.bgCardSubtle }]} />
            <View style={[styles.legendDot, { backgroundColor: '#BBF7D0' }]} />
            <View style={[styles.legendDot, { backgroundColor: '#4ADE80' }]} />
            <View style={[styles.legendDot, { backgroundColor: '#1E3A2F' }]} />
          </View>
        </View>

        <Text style={styles.hintText}>Tap any day to see completed deeds & spiritual breakdown</Text>

        <View style={styles.grid}>
          {days.map((day) => {
            const isFuture = day.dateKey > todayStr;
            const bg = getColorForPercentage(day.percentage, isFuture);
            const isDeep = day.percentage >= 80 && !isFuture;
            const isSelected = day.dateKey === selectedDateKey;

            return (
              <TouchableOpacity
                key={day.dateKey}
                style={styles.dayCol}
                onPress={() => setSelectedDateKey(day.dateKey)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.cell,
                    { backgroundColor: bg },
                    isSelected && styles.cellSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayNum,
                      isDeep && styles.dayNumLight,
                      isSelected && styles.dayNumSelected,
                    ]}
                  >
                    {day.dayNumber}
                  </Text>
                </View>
                <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                  {day.dayOfWeek}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Day Deed Breakdown */}
      <View style={styles.dayDetailsCard}>
        <View style={styles.dayDetailsHeader}>
          <View>
            <Text style={styles.dayDetailsTag}>
              {selectedDateKey === todayStr ? 'TODAY • SELECTED DAY' : 'DAY BREAKDOWN'}
            </Text>
            <Text style={styles.dayDetailsTitle}>
              {selectedDay
                ? `${selectedDay.dayNumber} ${title?.replace('Devotion Grid', '').trim() || ''}`
                : selectedDateKey}
            </Text>
          </View>

          <View style={styles.completionPill}>
            <Text style={styles.completionPillText}>
              {selectedDay ? `${selectedDay.percentage}% Completed` : '0%'}
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={THEME.colors.primary} style={{ marginVertical: 14 }} />
        ) : dayHabits.length === 0 ? (
          <View style={styles.emptyDayBox}>
            <Text style={styles.emptyDayText}>No habit records for this date.</Text>
          </View>
        ) : (
          <View style={styles.habitsSummaryList}>
            {completedHabits.length > 0 && (
              <View style={styles.groupSection}>
                <Text style={styles.groupTitle}>✓ COMPLETED DEEDS ({completedHabits.length})</Text>
                <View style={styles.deedsGrid}>
                  {completedHabits.map((h) => (
                    <View key={h.id} style={styles.deedItemCompleted}>
                      <Text style={styles.checkIcon}>✓</Text>
                      <Text style={styles.deedNameCompleted}>{h.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {uncompletedHabits.length > 0 && (
              <View style={styles.groupSection}>
                <Text style={styles.groupTitleMissed}>○ MISSED / UNLOGGED ({uncompletedHabits.length})</Text>
                <View style={styles.deedsGrid}>
                  {uncompletedHabits.map((h) => (
                    <View key={h.id} style={styles.deedItemMissed}>
                      <Text style={styles.circleIcon}>○</Text>
                      <Text style={styles.deedNameMissed}>{h.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  hintText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
    width: '12%',
  },
  cell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cellSelected: {
    borderColor: THEME.colors.primary,
    transform: [{ scale: 1.08 }],
  },
  dayNum: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  dayNumLight: {
    color: '#FFFFFF',
  },
  dayNumSelected: {
    fontWeight: '800',
  },
  dayName: {
    fontSize: 10,
    color: THEME.colors.textLight,
    fontWeight: '500',
  },
  dayNameSelected: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  dayDetailsCard: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    gap: 14,
  },
  dayDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dayDetailsTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 1,
    marginBottom: 2,
  },
  dayDetailsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.colors.textHeading,
    letterSpacing: -0.2,
  },
  completionPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  completionPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  habitsSummaryList: {
    gap: 12,
  },
  groupSection: {
    gap: 6,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: 0.8,
  },
  groupTitleMissed: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  deedsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  deedItemCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#D7EFE2',
  },
  checkIcon: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  deedNameCompleted: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A2F',
  },
  deedItemMissed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  circleIcon: {
    fontSize: 11,
    color: THEME.colors.textLight,
  },
  deedNameMissed: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  emptyDayBox: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  emptyDayText: {
    fontSize: 13,
    color: THEME.colors.textMuted,
  },
});
