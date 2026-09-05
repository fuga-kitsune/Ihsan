import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { analyticsRepository } from '../repositories/analytics.repository';
import { AnalyticsSummary } from '../models/analytics.model';
import { ConsistencyHeatmap } from '../components/ConsistencyHeatmap';
import { HeartJourneyChart } from '../components/HeartJourneyChart';
import { NiyyahMilestonesHistory } from '../components/NiyyahMilestonesHistory';
import { useNiyyahStore } from '../../niyyah/store/useNiyyahStore';
import { THEME } from '../../../core/constants/theme';

interface AnalyticsScreenProps {
  onBack: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const [monthOffset, setMonthOffset] = useState<number>(0); // 0 = this month, -1 = last month, -2 = 2 months ago
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  const allNiyyahs = useNiyyahStore((state) => state.allNiyyahs);
  const loadAllNiyyahs = useNiyyahStore((state) => state.loadAllNiyyahs);

  const loadData = (offset: number) => {
    analyticsRepository.getAnalyticsSummary(offset).then(setData);
  };

  useEffect(() => {
    loadData(monthOffset);
    loadAllNiyyahs();
  }, [monthOffset]);

  if (!data) return null;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: Math.max(insets.bottom + 40, 60) },
      ]}
      showsVerticalScrollIndicator={false}
    >


      {/* Month Switcher Header */}
      <View style={styles.monthHeaderRow}>
        <TouchableOpacity
          style={styles.monthNavBtn}
          onPress={() => setMonthOffset((prev) => prev - 1)}
          activeOpacity={0.7}
        >
          <Text style={styles.monthNavBtnText}>← Prev</Text>
        </TouchableOpacity>

        <View style={styles.monthTitleCenter}>
          <Text style={styles.monthTitleText}>{data.monthTitle}</Text>
          <Text style={styles.monthBadgeText}>{data.isCurrentMonth ? 'Current Month' : 'Past Archive'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.monthNavBtn, data.isCurrentMonth && styles.monthNavBtnDisabled]}
          onPress={() => !data.isCurrentMonth && setMonthOffset((prev) => Math.min(prev + 1, 0))}
          disabled={data.isCurrentMonth}
          activeOpacity={0.7}
        >
          <Text style={[styles.monthNavBtnText, data.isCurrentMonth && styles.monthNavBtnTextDisabled]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stat Metric Cards */}
      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{data.totalDeedsCompleted}</Text>
          <Text style={styles.statLabel}>Deeds Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNum}>{data.activeDaysCount} <Text style={styles.statSub}>days</Text></Text>
          <Text style={styles.statLabel}>Active Devotion</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNum}>{data.averageCompletionRate}%</Text>
          <Text style={styles.statLabel}>Avg Consistency</Text>
        </View>
      </View>

      {/* Monthly Heatmap Grid */}
      <ConsistencyHeatmap days={data.heatmapDays} title={`${data.monthTitle} Heatmap`} />

      {/* Heart State Journey Chart */}
      <HeartJourneyChart distribution={data.heartDistribution} />

      {/* Niyyah Milestones History */}
      <NiyyahMilestonesHistory niyyahs={allNiyyahs} />
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
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.bgPill,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textHeading,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthNavBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.bgCard,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  monthNavBtnDisabled: {
    opacity: 0.3,
  },
  monthNavBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  monthNavBtnTextDisabled: {
    color: THEME.colors.textLight,
  },
  monthTitleCenter: {
    alignItems: 'center',
  },
  monthTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  monthBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  statSub: {
    fontSize: 13,
    fontWeight: '400',
    color: THEME.colors.textMuted,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
});
