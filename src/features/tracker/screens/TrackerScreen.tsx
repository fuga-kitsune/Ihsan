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

  useEffect(() => {
    loadHabits();
  }, []);

  const handleSelectDateFromArchive = async (dateKey: string) => {
    await setSelectedDate(dateKey);
    await loadReflection(dateKey);
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

      {/* Date Strip & History Archive button */}
      <View style={styles.dateHeaderRow}>
        <Text style={styles.sectionLabel}>DAILY LOG</Text>
        <View style={styles.headerLinks}>
          <TouchableOpacity onPress={onOpenDuas} activeOpacity={0.7}>
            <Text style={styles.historyLinkText}>Du'as</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>•</Text>
          <TouchableOpacity onPress={onOpenAnalytics} activeOpacity={0.7}>
            <Text style={styles.historyLinkText}>Journey</Text>
          </TouchableOpacity>
          <Text style={styles.linkDivider}>•</Text>
          <TouchableOpacity onPress={() => setArchiveVisible(true)} activeOpacity={0.7}>
            <Text style={styles.historyLinkText}>Archive</Text>
          </TouchableOpacity>
        </View>
      </View>
      <DateStrip />

      <ProgressCard />
      <NiyyahCard />
      <WisdomCard />
      <CategoryTabs />
      <HabitList />

      {/* Navigation Banner to Evening Muhasabah */}
      <TouchableOpacity
        style={styles.muhasabahBanner}
        onPress={onNavigateToMuhasabah}
        activeOpacity={0.8}
      >
        <View style={styles.bannerLeft}>
          <Text style={styles.bannerTag}>EVENING MUHASABAH</Text>
          <Text style={styles.bannerTitle}>Spiritual Check-In & Journal →</Text>
          <Text style={styles.bannerSub}>Reflect on heart state and deeds for {selectedDate}.</Text>
        </View>
      </TouchableOpacity>

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
  bannerLeft: {
    gap: 4,
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  bannerSub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 18,
  },
});

