import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CategoryBreakdown } from '../models/analytics.model';
import { THEME } from '../../../core/constants/theme';

interface CategoryBreakdownChartProps {
  breakdown: CategoryBreakdown[];
}

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ breakdown }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.tag}>PILLARS OF DEVOTION</Text>
      <Text style={styles.title}>Deeds Distribution</Text>

      <View style={styles.list}>
        {breakdown.map((item) => (
          <View key={item.category} style={styles.itemRow}>
            <View style={styles.infoCol}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.countText}>{item.completedCount} ({item.percentage}%)</Text>
            </View>

            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  { width: `${Math.max(item.percentage, 3)}%` },
                ]}
              />
            </View>
          </View>
        ))}
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
    marginBottom: 16,
  },
  list: {
    gap: 14,
  },
  itemRow: {
    gap: 6,
  },
  infoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.colors.textHeading,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  barBg: {
    height: 6,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.bgCardSubtle,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.primary,
  },
});
