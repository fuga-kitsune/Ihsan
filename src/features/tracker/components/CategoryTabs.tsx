import React from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTrackerStore } from '../store/useTrackerStore';
import { HabitCategory } from '../models/habit.model';
import { THEME } from '../../../core/constants/theme';

export const CategoryTabs: React.FC = () => {
  const activeCategory = useTrackerStore((state) => state.activeCategory);
  const setActiveCategory = useTrackerStore((state) => state.setActiveCategory);

  const categories: { id: HabitCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'prayers', label: 'Prayers' },
    { id: 'quran', label: 'Quran' },
    { id: 'dhikr', label: 'Dhikr' },
    { id: 'deeds', label: 'Good Deeds' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;

        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setActiveCategory(cat.id)}
            style={[styles.tab, isActive && styles.activeTab]}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingBottom: 20,
  },
  tab: {
    backgroundColor: THEME.colors.bgPill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.radius.full,
  },
  activeTab: {
    backgroundColor: THEME.colors.bgPillActive,
  },
  tabText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  activeTabText: {
    color: THEME.colors.textInverse,
    fontWeight: '600',
  },
});
