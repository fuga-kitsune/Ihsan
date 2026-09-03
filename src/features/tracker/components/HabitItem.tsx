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

  return (
    <TouchableOpacity
      style={[styles.item, habit.isCompleted && styles.itemCompleted]}
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
          <Text style={[styles.name, habit.isCompleted && styles.nameCompleted]}>
            {habit.name}
          </Text>
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
  },
  itemCompleted: {
    backgroundColor: THEME.colors.bgCardActive,
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
});
