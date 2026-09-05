import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../../core/constants/theme';

interface SpiritualGrowthTierCardProps {
  currentStreak: number;
  totalDeeds: number;
}

export const SpiritualGrowthTierCard: React.FC<SpiritualGrowthTierCardProps> = ({
  currentStreak,
  totalDeeds,
}) => {
  const getTier = () => {
    if (currentStreak >= 7) {
      return {
        level: 'Level 3 • Spiritual Mastery',
        desc: 'Consistent in Tahajjud, Dhuha & deep dhikr',
        badge: 'MASTER',
        badgeBg: '#FEF3C7',
        badgeColor: '#B45309',
        nextMsg: 'MashaAllah! You are unlocking top-tier spiritual deeds.',
      };
    }
    if (currentStreak >= 2) {
      return {
        level: 'Level 2 • Sunnah Foundations',
        desc: 'Consistent in Adhkar & Daily Istighfar',
        badge: 'GROWING',
        badgeBg: '#DCFCE7',
        badgeColor: '#166534',
        nextMsg: `${7 - currentStreak} more days to reach Level 3 Mastery`,
      };
    }
    return {
      level: 'Level 1 • Daily Essentials',
      desc: 'Establishing the 5 Daily Prayers & Quran',
      badge: 'STARTER',
      badgeBg: '#F3F4F6',
      badgeColor: '#4B5563',
      nextMsg: `${2 - currentStreak} more days to unlock Sunnah Foundations`,
    };
  };

  const tier = getTier();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <Text style={styles.tag}>GROWTH STAGE</Text>
          <Text style={styles.levelTitle}>{tier.level}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: tier.badgeBg }]}>
          <Text style={[styles.badgeText, { color: tier.badgeColor }]}>{tier.badge}</Text>
        </View>
      </View>

      <Text style={styles.desc}>{tier.desc}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.nextText}>🌱 {tier.nextMsg}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    gap: 2,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.textHeading,
    letterSpacing: -0.2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  desc: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 18,
  },
  footerRow: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFE8DE',
  },
  nextText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
});
