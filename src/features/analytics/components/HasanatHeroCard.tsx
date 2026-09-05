import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HasanatSummary } from '../models/analytics.model';
import { THEME } from '../../../core/constants/theme';

interface HasanatHeroCardProps {
  summary: HasanatSummary;
  totalDeeds: number;
  currentStreak: number;
  bestStreak: number;
  consistencyRate: number;
}

export const HasanatHeroCard: React.FC<HasanatHeroCardProps> = ({
  summary,
  totalDeeds,
  currentStreak,
  bestStreak,
  consistencyRate,
}) => {
  return (
    <View style={styles.card}>
      {/* Top Tag & Multiplier */}
      <View style={styles.topRow}>
        <Text style={styles.tag}>DIVINE HASANAT ACCUMULATION</Text>
        <View style={styles.multiplierBadge}>
          <Text style={styles.multiplierText}>10x • 700x Promise</Text>
        </View>
      </View>

      {/* Hero Hasanat Counter */}
      <View style={styles.heroCenter}>
        <Text style={styles.hasanatMain}>{summary.totalEstimatedHasanat.toLocaleString()}+</Text>
        <Text style={styles.hasanatSub}>Estimated Divine Rewards Earned</Text>
      </View>

      {/* 4 Sleek Mini Metrics inside the card */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalDeeds}</Text>
          <Text style={styles.statTitle}>Deeds Done</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentStreak}d</Text>
          <Text style={styles.statTitle}>Streak</Text>
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
  multiplierBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  multiplierText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  heroCenter: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  hasanatMain: {
    fontSize: 36,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: -1,
    fontFamily: THEME.fonts.serif,
  },
  hasanatSub: {
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
