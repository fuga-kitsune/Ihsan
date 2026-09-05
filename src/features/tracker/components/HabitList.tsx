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
  const selectedDate = useTrackerStore((state) => state.selectedDate);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabitToDelete, setSelectedHabitToDelete] = useState<HabitItemUIModel | null>(null);

  // Helper function to sort habits
  const sortHabits = (list: HabitItemUIModel[]) => {
    return [...list].sort((a, b) => {
      // Locked items always at the bottom
      if (a.isLocked !== b.isLocked) {
        return a.isLocked ? 1 : -1;
      }
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });
  };

  // Maintain local displayed list pre-sorted
  const [displayHabits, setDisplayHabits] = useState<HabitItemUIModel[]>(() => sortHabits(habits));
  const reorderTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevDateRef = React.useRef<string>(selectedDate);

  React.useEffect(() => {
    if (reorderTimerRef.current) {
      clearTimeout(reorderTimerRef.current);
    }

    // If date changed, immediately sort and replace without delay or animated jump
    if (prevDateRef.current !== selectedDate) {
      prevDateRef.current = selectedDate;
      setDisplayHabits(sortHabits(habits));
      return;
    }

    // Check if habit count changed
    if (displayHabits.length !== habits.length) {
      setDisplayHabits(sortHabits(habits));
      return;
    }

    const habitsMap = new Map(habits.map((h) => [h.id, h]));

    // Update the item completion status IN PLACE for immediate tap feedback
    setDisplayHabits((prev) => prev.map((item) => habitsMap.get(item.id) || item));

    // Graceful 400ms delay before animating the newly toggled item to bottom / top
    reorderTimerRef.current = setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setDisplayHabits(sortHabits(habits));
    }, 400);

    return () => {
      if (reorderTimerRef.current) {
        clearTimeout(reorderTimerRef.current);
      }
    };
  }, [habits, selectedDate]);

  const filteredHabits = displayHabits.filter((h) => {
    if (activeCategory === 'all') return true;
    return h.category === activeCategory;
  });

  const unlockedHabits = filteredHabits.filter((h) => !h.isLocked);
  const lockedHabits = filteredHabits.filter((h) => h.isLocked);

  // Show only the immediately NEXT streak milestone as a blurred mystery teaser (not all locked items)
  const nextRequiredStreak = lockedHabits.length > 0
    ? Math.min(...lockedHabits.map((h) => h.requiredStreak ?? 999))
    : null;
  const nextMilestoneHabits = nextRequiredStreak !== null
    ? lockedHabits.filter((h) => (h.requiredStreak ?? 0) === nextRequiredStreak).slice(0, 1)
    : [];

  return (
    <View style={styles.container}>
      {/* Active Unlocked Deeds */}
      {unlockedHabits.map((habit) => (
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

      {/* Glimpse / Teaser for the Next Streak Milestone (Blurred mystery teaser) */}
      {nextMilestoneHabits.length > 0 && (
        <View style={styles.lockedSection}>
          <View style={styles.lockedHeader}>
            <Text style={styles.lockedTitle}>NEXT MILESTONE UNLOCK</Text>
            <Text style={styles.lockedSub}>Keep your daily streak going to unlock the next spiritual deed</Text>
          </View>

          {nextMilestoneHabits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onLongPress={(h) => setSelectedHabitToDelete(h)}
            />
          ))}
        </View>
      )}

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
  lockedSection: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ECEAE6',
    gap: 2,
  },
  lockedHeader: {
    marginBottom: 12,
    paddingHorizontal: 2,
    gap: 2,
  },
  lockedTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 1,
  },
  lockedSub: {
    fontSize: 12,
    color: THEME.colors.textLight,
  },
});

