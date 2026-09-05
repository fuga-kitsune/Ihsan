import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../../core/constants/theme';
import { HeatmapDay } from '../models/analytics.model';

interface WeeklyConsistencyBarChartProps {
  days: HeatmapDay[];
}

export const WeeklyConsistencyBarChart: React.FC<WeeklyConsistencyBarChartProps> = ({ days }) => {
  // Take the last 7 days of recorded data or current week
  const recentDays = days.slice(-7);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.tag}>WEEKLY CADENCE</Text>
          <Text style={styles.title}>Consistency Trend</Text>
        </View>
        <Text style={styles.subTag}>Last 7 Days</Text>
      </View>

      <View style={styles.barsContainer}>
        {recentDays.map((d) => {
          const heightPct = Math.max(d.percentage, 8);
          const isHigh = d.percentage >= 80;

          return (
            <View key={d.dateKey} style={styles.barCol}>
              <Text style={styles.pctLabel}>{d.percentage > 0 ? `${d.percentage}%` : '-'}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${heightPct}%` },
                    isHigh && styles.barFillHigh,
                  ]}
                />
              </View>
              <Text style={styles.dayLabel}>{d.dayOfWeek}</Text>
              <Text style={styles.dateNum}>{d.dayNumber}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ECEAE6',
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  subTag: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    alignItems: 'center',
    width: '12%',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 4,
  },
  pctLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: THEME.colors.textLight,
  },
  barTrack: {
    width: 14,
    height: 80,
    backgroundColor: '#F5F4F0',
    borderRadius: THEME.radius.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.full,
  },
  barFillHigh: {
    backgroundColor: '#1E3A2F',
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textHeading,
  },
  dateNum: {
    fontSize: 10,
    color: THEME.colors.textMuted,
  },
});
