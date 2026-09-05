import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { DateStrip } from '../components/DateStrip';
import { ProgressCard } from '../components/ProgressCard';
import { CategoryTabs } from '../components/CategoryTabs';
import { HabitList } from '../components/HabitList';
import { WisdomCard } from '../../wisdom/components/WisdomCard';
import { NiyyahCard } from '../../niyyah/components/NiyyahCard';
import { HistoryArchiveModal } from '../../reflection/components/HistoryArchiveModal';

import { useTrackerStore } from '../store/useTrackerStore';
import { useReflectionStore } from '../../reflection/store/useReflectionStore';
import { THEME } from '../../../core/constants/theme';
import { getTodayDateString } from '../../../core/utils/date';

interface TrackerScreenProps {
  onNavigateToMuhasabah: () => void;
  onOpenSettings: () => void;
  onOpenAnalytics: () => void;
  onOpenDuas: () => void;
}

export const TrackerScreen: React.FC<TrackerScreenProps> = ({
  onNavigateToMuhasabah,
  onOpenSettings,
  onOpenAnalytics,
  onOpenDuas,
}) => {
  const insets = useSafeAreaInsets();
  const loadHabits = useTrackerStore((state) => state.loadHabits);
  const selectedDate = useTrackerStore((state) => state.selectedDate);
  const setSelectedDate = useTrackerStore((state) => state.setSelectedDate);
  const loadReflection = useReflectionStore((state) => state.loadReflection);

  const [archiveVisible, setArchiveVisible] = useState(false);

  const todayKey = getTodayDateString();
  const isToday = selectedDate === todayKey;

  useEffect(() => {
    loadHabits();
  }, []);

  const handleSelectDateFromArchive = async (dateKey: string) => {
    await setSelectedDate(dateKey);
    await loadReflection(dateKey);
  };

  const handleJumpToToday = async () => {
    await setSelectedDate(todayKey);
    await loadReflection(todayKey);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: Math.max(insets.bottom + 24, 48) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Header onOpenSettings={onOpenSettings} />

      {/* Streak & Daily Deeds Card */}
      <ProgressCard />

      {/* Past Day Viewing Notice Banner */}
      {!isToday && (
        <View style={styles.pastDayBanner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.pastDayTitle}>Viewing Past Date</Text>
            <Text style={styles.pastDaySub}>
              Changes made here will update your past spiritual log and streak history.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.returnTodayBtn}
            onPress={handleJumpToToday}
            activeOpacity={0.7}
          >
            <Text style={styles.returnTodayBtnText}>Go to Today</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* <NiyyahCard /> */}
      {/* <WisdomCard /> */}
      <CategoryTabs />
      <HabitList />

      <HistoryArchiveModal
        visible={archiveVisible}
        onClose={() => setArchiveVisible(false)}
        onSelectDate={handleSelectDateFromArchive}
      />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkDivider: {
    fontSize: 10,
    color: THEME.colors.textLight,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 1.1,
  },

  historyLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  muhasabahBanner: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 22,
    marginTop: 18,
    marginBottom: 24,
  },
  pastDayBanner: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  bannerLeft: {
    flex: 1,
    gap: 2,
  },
  pastDayTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  pastDaySub: {
    fontSize: 12,
    color: '#B45309',
    lineHeight: 16,
  },
  returnTodayBtn: {
    backgroundColor: '#1E3A2F',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    alignSelf: 'center',
  },
  returnTodayBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

