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
    habitRepository.getHabitsForDate(selectedDateKey).then((habits) => {
      setDayHabits(habits);
      setLoading(false);
    });
  }, [selectedDateKey]);

  const getColorForPercentage = (p: number, isFuture: boolean) => {
    if (isFuture) return '#F7F6F3';
    if (p >= 80) return '#1E3A2F'; // High Devotion (Deep Emerald)
    if (p >= 50) return '#4ADE80'; // Moderate Devotion (Vibrant Green)
    if (p >= 20) return '#C8E6C9'; // Subtle Devotion
    return '#EFEFEA'; // Past Inactive (clean visible neutral circle)
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

        {/* Weekday Header Row */}
        <View style={styles.weekHeaderRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <Text key={d} style={styles.weekHeaderDay}>
              {d}
            </Text>
          ))}
        </View>

        {/* Days Grid (aligned by first day of month) */}
        <View style={styles.grid}>
          {(() => {
            if (days.length === 0) return null;
            // First day of this month
            const firstDateStr = days[0].dateKey;
            const firstDayOfWeek = new Date(firstDateStr).getDay(); // 0 = Sun, 1 = Mon ...
            
            const leadingEmptySlots = Array.from({ length: firstDayOfWeek });

            return (
              <>
                {leadingEmptySlots.map((_, i) => (
                  <View key={`empty-${i}`} style={styles.dayCol} />
                ))}

                {days.map((day) => {
                  const isFuture = day.dateKey > todayStr;
                  const bg = getColorForPercentage(day.percentage, isFuture);
                  const isDeep = day.percentage >= 80 && !isFuture;
                  const isSelected = day.dateKey === selectedDateKey;

                  return (
                    <TouchableOpacity
                      key={day.dateKey}
                      style={[styles.dayCol, isFuture && styles.dayColFuture]}
                      onPress={() => !isFuture && setSelectedDateKey(day.dateKey)}
                      disabled={isFuture}
                      activeOpacity={isFuture ? 1 : 0.7}
                    >
                      <View
                        style={[
                          styles.cell,
                          { backgroundColor: bg },
                          isFuture && styles.cellFuture,
                          isSelected && styles.cellSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayNum,
                            isFuture && styles.dayNumFuture,
                            isDeep && styles.dayNumLight,
                            isSelected && styles.dayNumSelected,
                          ]}
                        >
                          {day.dayNumber}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            );
          })()}
        </View>
      </View>

      {/* Selected Day Deed Breakdown */}
      <View style={styles.dayDetailsCard}>
        <View style={styles.dayDetailsHeader}>
          <View>
            <Text style={styles.dayDetailsTitle}>
              {selectedDay
                ? `${selectedDay.dayNumber} ${title || ''}`
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
  weekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  weekHeaderDay: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  dayCol: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dayColFuture: {
    // Unreached future day wrapper
  },
  cell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cellFuture: {
    backgroundColor: '#F3F2EE',
  },
  cellSelected: {
    borderColor: THEME.colors.primary,
    transform: [{ scale: 1.08 }],
  },
  dayNum: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  dayNumFuture: {
    color: THEME.colors.textLight,
    fontWeight: '400',
  },
  dayNumLight: {
    color: '#FFFFFF',
  },
  dayNumSelected: {
    fontWeight: '800',
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
