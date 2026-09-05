import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HabitItemUIModel } from '../models/habit.model';
import { useTrackerStore } from '../store/useTrackerStore';
import { THEME } from '../../../core/constants/theme';

interface HabitItemProps {
  habit: HabitItemUIModel;
  onLongPress?: (habit: HabitItemUIModel) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onLongPress }) => {
  const toggleHabit = useTrackerStore((state) => state.toggleHabit);
  const currentStreak = useTrackerStore((state) => state.stats.streak);

  // A habit is "NEW" for 2 days after unlocking (e.g. required 2 -> streak 2 or 3)
  const isNewlyUnlocked =
    (habit.requiredStreak ?? 0) > 0 &&
    !habit.isLocked &&
    currentStreak >= (habit.requiredStreak ?? 0) &&
    currentStreak <= (habit.requiredStreak ?? 0) + 2;

  if (habit.isLocked) {
    return (
      <View style={[styles.item, styles.itemLocked]}>
        <View style={styles.leftCol}>
          <View style={styles.lockIconBox}>
            <Text style={styles.lockIconText}>🔒</Text>
          </View>
          <View style={styles.textCol}>
            <View style={styles.nameRow}>
              <Text style={styles.nameLocked}>{habit.name}</Text>
              <View style={styles.streakBadge}>
                <Text style={styles.streakBadgeText}>Unlocks at {habit.requiredStreak}-day streak</Text>
              </View>
            </View>
            <Text style={styles.benefitLocked}>{habit.benefit}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.item,
        isNewlyUnlocked && styles.itemNewlyUnlocked,
        habit.isCompleted && styles.itemCompleted,
      ]}
      onPress={() => toggleHabit(habit.id)}
      onLongPress={() => onLongPress?.(habit)}
      delayLongPress={350}
      activeOpacity={0.7}
    >
      <View style={styles.leftCol}>
        <View style={[styles.radioOuter, habit.isCompleted && styles.radioOuterActive]}>
          {habit.isCompleted && <View style={styles.radioInner} />}
        </View>
        <View style={styles.textCol}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, habit.isCompleted && styles.nameCompleted]}>
              {habit.name}
            </Text>
            {isNewlyUnlocked && (
              <View style={styles.newBadgeRed}>
                <Text style={styles.newBadgeRedText}>NEW</Text>
              </View>
            )}
          </View>
          <Text style={styles.benefit}>{habit.benefit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  itemNewlyUnlocked: {
    backgroundColor: '#FFF8F6',
    borderColor: '#FED7D7',
  },
  itemCompleted: {
    backgroundColor: THEME.colors.bgCardActive,
    borderColor: '#D1EAE0',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: THEME.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.colors.primary,
  },
  textCol: {
    flex: 1,
  },
  name: {
    color: THEME.colors.textHeading,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  nameCompleted: {
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  benefit: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
    fontWeight: '400',
  },
  itemLocked: {
    backgroundColor: '#F9F8F6',
    borderColor: '#ECEAE6',
    opacity: 0.75,
  },
  lockIconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIconText: {
    fontSize: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  nameLocked: {
    color: THEME.colors.textMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  streakBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  streakBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  newBadgeRed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  newBadgeRedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.6,
  },
  benefitLocked: {
    color: THEME.colors.textLight,
    fontSize: 12,
    marginTop: 2,
  },
});
