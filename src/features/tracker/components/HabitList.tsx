import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTrackerStore } from '../store/useTrackerStore';
import { HabitItemUIModel } from '../models/habit.model';
import { HabitItem } from './HabitItem';
import { AddHabitModal } from './AddHabitModal';
import { DeleteHabitModal } from './DeleteHabitModal';
import { THEME } from '../../../core/constants/theme';

export const HabitList: React.FC = () => {
  const habits = useTrackerStore((state) => state.habits);
  const activeCategory = useTrackerStore((state) => state.activeCategory);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabitToDelete, setSelectedHabitToDelete] = useState<HabitItemUIModel | null>(null);

  const filteredHabits = habits.filter((h) => {
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

