import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useTrackerStore } from '../store/useTrackerStore';
import { HabitItemUIModel } from '../models/habit.model';
import { HabitItem } from './HabitItem';
import { AddHabitModal } from './AddHabitModal';
import { DeleteHabitModal } from './DeleteHabitModal';
import { THEME } from '../../../core/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const HabitList: React.FC = () => {
  const habits = useTrackerStore((state) => state.habits);
  const activeCategory = useTrackerStore((state) => state.activeCategory);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabitToDelete, setSelectedHabitToDelete] = useState<HabitItemUIModel | null>(null);

  // Maintain local displayed list to allow graceful delay before reordering
  const [displayHabits, setDisplayHabits] = useState<HabitItemUIModel[]>(habits);
  const reorderTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Helper function to sort habits
  const sortHabits = (list: HabitItemUIModel[]) => {
    return [...list].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });
  };

  React.useEffect(() => {
    if (reorderTimerRef.current) {
      clearTimeout(reorderTimerRef.current);
    }

    const habitsMap = new Map(habits.map((h) => [h.id, h]));

    // Instantly update the item completion status IN PLACE preserving current display order
    setDisplayHabits((prev) => {
      // If count changed or initial empty, initialize sorted
      if (prev.length !== habits.length || prev.length === 0) {
        return sortHabits(habits);
      }
      // Preserve exact order from previous state and just update values (e.g. isCompleted)
      return prev.map((item) => habitsMap.get(item.id) || item);
    });

    // Graceful 450ms delay before animating the newly toggled item to bottom / top
    reorderTimerRef.current = setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDisplayHabits(sortHabits(habits));
    }, 450);

    return () => {
      if (reorderTimerRef.current) {
        clearTimeout(reorderTimerRef.current);
      }
    };
  }, [habits]);

  const filteredHabits = displayHabits.filter((h) => {
    if (activeCategory === 'all') return true;
    return h.category === activeCategory;
  });

  return (
    <View style={styles.container}>
      {filteredHabits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onLongPress={(h) => setSelectedHabitToDelete(h)}
        />
      ))}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.addBtnText}>+ Add a personal deed</Text>
      </TouchableOpacity>

      <AddHabitModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      <DeleteHabitModal
        habit={selectedHabitToDelete}
        onClose={() => setSelectedHabitToDelete(null)}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  addBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 8,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.bgPill,
  },
  addBtnText: {
    color: THEME.colors.textBody,
    fontSize: 14,
    fontWeight: '500',
  },
});

