import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HabitItemUIModel } from '../../tracker/models/habit.model';
import { THEME } from '../../../core/constants/theme';

interface TodayDeedsSnapshotCardProps {
  habits: HabitItemUIModel[];
  dateLabel: string;
}

export const TodayDeedsSnapshotCard: React.FC<TodayDeedsSnapshotCardProps> = ({ habits, dateLabel }) => {
  const activeHabits = habits.filter((h) => !h.isLocked);
  const completedCount = activeHabits.filter((h) => h.isCompleted).length;
  const totalCount = activeHabits.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Day's Accountability</Text>
        </View>
        <View style={[styles.badge, percentage >= 80 ? styles.badgeHigh : styles.badgeNormal]}>
          <Text style={[styles.badgeText, percentage >= 80 ? styles.badgeTextHigh : styles.badgeTextNormal]}>
            {completedCount}/{totalCount} Completed
          </Text>
        </View>
      </View>

      {/* Mini Badges for key prayers & deeds */}
      <View style={styles.badgesRow}>
        {activeHabits.slice(0, 7).map((h) => (
          <View
            key={h.id}
            style={[
              styles.habitPill,
              h.isCompleted && styles.habitPillCompleted,
            ]}
          >
            <Text style={[styles.habitPillText, h.isCompleted && styles.habitPillTextCompleted]}>
              {h.isCompleted ? '✓ ' : '○ '}{h.name.replace('Prayer', '').trim()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  badgeNormal: {
    backgroundColor: '#FEF3C7',
  },
  badgeHigh: {
    backgroundColor: '#DCFCE7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextNormal: {
    color: '#B45309',
  },
  badgeTextHigh: {
    color: '#166534',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  habitPill: {
    backgroundColor: THEME.colors.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  habitPillCompleted: {
    backgroundColor: '#F8FCF9',
    borderColor: '#D7EFE2',
  },
  habitPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textMuted,
  },
  habitPillTextCompleted: {
    color: '#1E3A2F',
    fontWeight: '600',
  },
});
