import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTrackerStore } from '../store/useTrackerStore';
import { THEME } from '../../../core/constants/theme';

export const ProgressCard: React.FC = () => {
  const stats = useTrackerStore((state) => state.stats);

  const getStreakMotivation = (streak: number, count: number) => {
    if (count >= 5) {
      return '✨ Daily streak protected today!';
    }
    if (streak > 0) {
      return `🔥 Complete 5 deeds today to protect your ${streak}-day streak!`;
    }
    return '🌱 Complete 5 deeds today to start your consistency streak!';
  };

  return (
    <View style={styles.card}>
      {/* Top Streak Protection Banner */}
      <View style={styles.streakBanner}>
        <View style={styles.streakLeft}>
          <Text style={styles.flameIcon}>🔥</Text>
          <Text style={styles.streakCountText}>
            {stats.streak} {stats.streak === 1 ? 'DAY' : 'DAYS'} STREAK
          </Text>
        </View>
        <Text style={styles.streakStatusPill}>
          {stats.completedCount >= 5 ? 'PROTECTED' : 'AT RISK'}
        </Text>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.infoCol}>
          <Text style={styles.headerLabel}>TODAY'S INTENTION</Text>
          <Text style={styles.scoreText}>
            {stats.completedCount} <Text style={styles.scoreSub}>of {stats.totalCount} completed</Text>
          </Text>
          <Text style={styles.streakMotivation}>
            {getStreakMotivation(stats.streak, stats.completedCount)}
          </Text>
        </View>

        <View style={styles.progressCircle}>
          <Text style={styles.percentageNumber}>{stats.percentage}%</Text>
        </View>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${stats.percentage}%` }]} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 20,
    marginBottom: 24,
  },
  streakBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flameIcon: {
    fontSize: 14,
  },
  streakCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textHeading,
    letterSpacing: 0.5,
  },
  streakStatusPill: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: 0.8,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoCol: {
    gap: 4,
    flex: 1,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 1.1,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  scoreSub: {
    fontSize: 14,
    fontWeight: '400',
    color: THEME.colors.textMuted,
  },
  streakMotivation: {
    fontSize: 12,
    color: THEME.colors.accentGold,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 16,
  },

  progressCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  barBackground: {
    height: 6,
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.full,
  },
});
