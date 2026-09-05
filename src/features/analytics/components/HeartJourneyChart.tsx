import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartStateCount } from '../models/analytics.model';
import { THEME } from '../../../core/constants/theme';

interface HeartJourneyChartProps {
  distribution: HeartStateCount[];
}

export const HeartJourneyChart: React.FC<HeartJourneyChartProps> = ({ distribution }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Heart State Journey</Text>

      <View style={styles.list}>
        {distribution.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={styles.infoCol}>
              <View style={styles.labelRow}>
                <Text style={styles.arabic}>{item.arabicTitle}</Text>
                <Text style={styles.label}>• {item.label}</Text>
              </View>
              <Text style={styles.countText}>{item.count} logged ({item.percentage}%)</Text>
            </View>

            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  { width: `${Math.max(item.percentage, 4)}%`, backgroundColor: item.color },
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arabic: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.textHeading,
  },
  label: {
    fontSize: 12,
    color: THEME.colors.textMuted,
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
  },
});
