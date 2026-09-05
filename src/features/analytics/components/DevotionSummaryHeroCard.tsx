import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../../core/constants/theme';

interface DevotionSummaryHeroCardProps {
  totalDeeds: number;
  currentStreak: number;
  bestStreak: number;
  consistencyRate: number;
}

export const DevotionSummaryHeroCard: React.FC<DevotionSummaryHeroCardProps> = ({
  totalDeeds,
  currentStreak,
  bestStreak,
  consistencyRate,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.tag}>MONTHLY DEVOTION SUMMARY</Text>
      </View>

      <View style={styles.heroCenter}>
        <Text style={styles.deedsMain}>{totalDeeds}</Text>
        <Text style={styles.deedsSub}>Total Good Deeds Accomplished</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentStreak}d</Text>
          <Text style={styles.statTitle}>Active Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{bestStreak}d</Text>
          <Text style={styles.statTitle}>Best Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{consistencyRate}%</Text>
          <Text style={styles.statTitle}>Consistency</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 1,
  },
  heroCenter: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  deedsMain: {
    fontSize: 40,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: -1,
    fontFamily: THEME.fonts.serif,
  },
  deedsSub: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textHeading,
  },
  statTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
});
