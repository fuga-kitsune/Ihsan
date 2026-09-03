import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTrackerStore } from '../store/useTrackerStore';
import { useReflectionStore } from '../../reflection/store/useReflectionStore';
import { THEME } from '../../../core/constants/theme';
import { getTodayDateString } from '../../../core/utils/date';

export const DateStrip: React.FC = () => {
  const selectedDate = useTrackerStore((state) => state.selectedDate);
  const setSelectedDate = useTrackerStore((state) => state.setSelectedDate);
  const loadReflection = useReflectionStore((state) => state.loadReflection);

  const todayKey = getTodayDateString();

  // Generate last 10 days
  const days = [];
  for (let i = 0; i < 10; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    const dayName = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();

    days.push({ dateKey, dayName, dayNumber, isToday: i === 0 });
  }

  const handleDateSelect = async (dateKey: string) => {
    await setSelectedDate(dateKey);
    await loadReflection(dateKey);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {days.map((d) => {
          const isSelected = selectedDate === d.dateKey;

          return (
            <TouchableOpacity
              key={d.dateKey}
              style={[styles.dateCard, isSelected && styles.dateCardActive]}
              onPress={() => handleDateSelect(d.dateKey)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelActive]}>
                {d.dayName}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.dayNumberActive]}>
                {d.dayNumber}
              </Text>
              {d.isToday && <View style={[styles.todayDot, isSelected && styles.todayDotActive]} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  scrollList: {
    gap: 8,
  },
  dateCard: {
    width: 62,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dateCardActive: {
    backgroundColor: THEME.colors.primary,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textMuted,
  },
  dayLabelActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textHeading,
  },
  dayNumberActive: {
    color: '#FFFFFF',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentGold,
  },
  todayDotActive: {
    backgroundColor: '#FFFFFF',
  },
});
