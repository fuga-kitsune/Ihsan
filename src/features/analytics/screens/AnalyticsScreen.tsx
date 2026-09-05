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

import { InteractiveCalendarHeatmap } from '../components/InteractiveCalendarHeatmap';
import { CategoryBreakdownChart } from '../components/CategoryBreakdownChart';
import { WeeklyFocusGoalsHistory } from '../components/WeeklyFocusGoalsHistory';

import { useAnalyticsStore } from '../store/useAnalyticsStore';

interface AnalyticsScreenProps {
  onBack?: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'archive' | 'insights'>('archive');
  const data = useAnalyticsStore((state) => state.data);
  const monthOffset = useAnalyticsStore((state) => state.monthOffset);
  const loadAnalytics = useAnalyticsStore((state) => state.loadAnalytics);
  const setMonthOffset = useAnalyticsStore((state) => state.setMonthOffset);

  const allNiyyahs = useNiyyahStore((state) => state.allNiyyahs);
  const loadNiyyahAndQuests = useNiyyahStore((state) => state.loadNiyyahAndQuests);

  useEffect(() => {
    loadAnalytics(monthOffset);
    loadNiyyahAndQuests();
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
          onPress={() => setMonthOffset(monthOffset - 1)}
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
          onPress={() => !data.isCurrentMonth && setMonthOffset(Math.min(monthOffset + 1, 0))}
          disabled={data.isCurrentMonth}
          activeOpacity={0.7}
        >
          <Text style={[styles.monthNavBtnText, data.isCurrentMonth && styles.monthNavBtnTextDisabled]}>
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Clean Segmented Tab Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'archive' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('archive')}
          activeOpacity={0.8}
        >
          <Text style={[styles.segmentText, activeTab === 'archive' && styles.segmentTextActive]}>
            Calendar & Deeds Log
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'insights' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('insights')}
          activeOpacity={0.8}
        >
          <Text style={[styles.segmentText, activeTab === 'insights' && styles.segmentTextActive]}>
            Categories & Heart
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'archive' ? (
        <>
          {/* Interactive Tap-Day Calendar Heatmap Grid */}
          <InteractiveCalendarHeatmap
            days={data.heatmapDays}
            title={data.monthTitle}
          />

          {/* Weekly Focus Goals History */}
          <WeeklyFocusGoalsHistory goals={allNiyyahs} />
        </>
      ) : (
        <>
          {/* Pillars of Devotion Category Breakdown */}
          <CategoryBreakdownChart breakdown={data.categoryBreakdown} />

          {/* Heart State Distribution */}
          <HeartJourneyChart distribution={data.heartDistribution} />
        </>
      )}
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
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F2EFEB',
    borderRadius: THEME.radius.md,
    padding: 3,
    marginBottom: 16,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: THEME.radius.sm,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  segmentTextActive: {
    color: THEME.colors.textHeading,
    fontWeight: '700',
  },
});
