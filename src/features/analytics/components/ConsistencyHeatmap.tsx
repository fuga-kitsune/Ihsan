import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeatmapDay } from '../models/analytics.model';
import { THEME } from '../../../core/constants/theme';

interface ConsistencyHeatmapProps {
  days: HeatmapDay[];
  title?: string;
}

export const ConsistencyHeatmap: React.FC<ConsistencyHeatmapProps> = ({ days, title }) => {
  const getColorForPercentage = (p: number) => {
    if (p >= 80) return '#1E3A2F'; // High Devotion (Deep Forest Sage)
    if (p >= 50) return '#4ADE80'; // Moderate Devotion (Emerald Tint)
    if (p >= 20) return '#BBF7D0'; // Subtle Devotion (Mint)
    return THEME.colors.bgCardSubtle; // Resting / Minimal
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.tag}>DEVOTION PATTERN</Text>
          <Text style={styles.title}>{title || 'Monthly Heatmap'}</Text>
        </View>

        <View style={styles.legend}>
          <View style={[styles.legendDot, { backgroundColor: THEME.colors.bgCardSubtle }]} />
          <View style={[styles.legendDot, { backgroundColor: '#BBF7D0' }]} />
          <View style={[styles.legendDot, { backgroundColor: '#4ADE80' }]} />
          <View style={[styles.legendDot, { backgroundColor: '#1E3A2F' }]} />
        </View>
      </View>

      <View style={styles.grid}>
        {days.map((day) => {
          const bg = getColorForPercentage(day.percentage);
          const isDeep = day.percentage >= 80;

          return (
            <View key={day.dateKey} style={styles.dayCol}>
              <View style={[styles.cell, { backgroundColor: bg }]}>
                <Text style={[styles.dayNum, isDeep && styles.dayNumLight]}>
                  {day.dayNumber}
                </Text>
              </View>
              <Text style={styles.dayName}>{day.dayOfWeek}</Text>
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  legend: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
    width: '12%',
  },
  cell: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  dayNumLight: {
    color: '#FFFFFF',
  },
  dayName: {
    fontSize: 10,
    color: THEME.colors.textLight,
    fontWeight: '500',
  },
});
