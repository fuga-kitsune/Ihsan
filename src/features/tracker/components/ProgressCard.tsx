import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreamlineFireIcon } from '../../../core/components/StreamlineFireIcon';
import { StreamlineLockIcon } from '../../../core/components/StreamlineLockIcon';
import { StreamlineCheckBadge } from '../../../core/components/StreamlineCheckBadge';
import { useTrackerStore } from '../store/useTrackerStore';
import { THEME } from '../../../core/constants/theme';

export const ProgressCard: React.FC = () => {
  const stats = useTrackerStore((state) => state.stats);

  const flameScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isProtected = stats.completedCount >= 5;
  const streak = stats.streak;

  useEffect(() => {
    // Breathing pulse for the flame/lock
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    // Punchy celebratory pop when deeds change
    Animated.sequence([
      Animated.timing(flameScale, { toValue: 1.25, duration: 130, useNativeDriver: true }),
      Animated.spring(flameScale, { toValue: 1, friction: 3.5, tension: 120, useNativeDriver: true }),
    ]).start();
  }, [stats.completedCount]);

  // Determine current day of week index (Monday = 0, Sunday = 6)
  const currentDayOfWeek = (new Date().getDay() + 6) % 7;
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={styles.container}>
      {/* LEFT TILE: Dedicated Streak Card */}
      <View style={[styles.streakTile, isProtected && styles.streakTileLocked]}>
        <View style={styles.streakTopRow}>
          <View style={[styles.badgePill, isProtected && styles.badgePillLocked]}>
            <Text style={[styles.streakBadgeText, isProtected && styles.streakBadgeTextLocked]}>
              {isProtected ? '✓ LOCKED' : '🔥 STREAK'}
            </Text>
          </View>
        </View>

        <View style={styles.streakCenterRow}>
          <Text style={[styles.streakNumber, isProtected && styles.streakNumberLocked]}>
            {streak}
          </Text>
          <Animated.View
            style={[
              styles.iconWrapper,
              { transform: [{ scale: Animated.multiply(pulseAnim, flameScale) }] },
            ]}
          >
            {isProtected ? (
              <StreamlineCheckBadge size={46} />
            ) : (
              <StreamlineFireIcon size={46} />
            )}
          </Animated.View>
        </View>

        <Text style={[styles.streakDaysLabel, isProtected && styles.streakDaysLabelLocked]}>
          {isProtected ? 'Protected Today' : 'Days in Devotion'}
        </Text>
      </View>

      {/* RIGHT TILE: Daily Deeds with Tick Icon & Week Matrix (M T W T F S S) */}
      <View style={styles.goalTile}>
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleRow}>
            <View style={styles.tickBoxCircle}>
              <Ionicons name="checkbox" size={18} color="#1E3A2F" />
            </View>
            <Text style={styles.goalTitle}>Daily Deeds</Text>
          </View>

          <View style={styles.scorePill}>
            <Text style={styles.scoreBold}>{stats.completedCount}</Text>
            <Text style={styles.scoreTotal}>/{stats.totalCount}</Text>
          </View>
        </View>

        {/* 7-DAY WEEK ROW (M T W T F S S) */}
        <View style={styles.weekRow}>
          {weekDays.map((letter, idx) => {
            const isToday = idx === currentDayOfWeek;
            const isPast = idx < currentDayOfWeek;

            let iconNode = null;
            if (isToday) {
              iconNode = isProtected ? (
                <StreamlineCheckBadge size={18} />
              ) : (
                <StreamlineFireIcon size={18} />
              );
            } else if (isPast) {
              iconNode = (
                <Ionicons name="checkmark" size={12} color={THEME.colors.primary} />
              );
            }

            return (
              <View key={idx} style={styles.dayCol}>
                {/* Logo / Icon above the day letter */}
                <View
                  style={[
                    styles.dayCircle,
                    isPast && styles.dayCirclePast,
                    isToday && styles.dayCircleToday,
                  ]}
                >
                  {iconNode}
                </View>
                {/* Day Letter */}
                <Text style={[styles.dayLetter, isToday && styles.dayLetterToday]}>
                  {letter}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  /* LEFT TILE (STREAK) */
  streakTile: {
    flex: 1,
    borderRadius: 22,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    minHeight: 118,
  },
  streakTileLocked: {
    backgroundColor: '#E6F4EA', // App theme primarySoft green
    borderColor: '#C2E7D0', // Subtle 1px green border matching theme
  },
  streakTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgePill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
    backgroundColor: '#FDE68A',
  },
  badgePillLocked: {
    backgroundColor: '#C2E7D0',
  },
  streakBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#B45309',
  },
  streakBadgeTextLocked: {
    color: THEME.colors.primary,
  },
  streakCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  streakNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: '#78350F',
    letterSpacing: -1,
  },
  streakNumberLocked: {
    color: THEME.colors.primary,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDaysLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  streakDaysLabelLocked: {
    color: THEME.colors.primary,
  },

  /* RIGHT TILE (DAILY GOAL + TICK BOX + WEEKS) */
  goalTile: {
    flex: 1.45,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 22,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ECEAE6',
    minHeight: 118,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tickBoxCircle: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.textHeading,
    letterSpacing: -0.2,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: THEME.colors.bgCardSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  scoreBold: {
    fontSize: 13,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  scoreTotal: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },

  /* WEEKS ROW (M T W T F S S) */
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dayCol: {
    alignItems: 'center',
    gap: 5,
  },
  dayLetter: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  dayLetterToday: {
    color: THEME.colors.primary,
    fontWeight: '800',
  },
  dayCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.bgCardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCirclePast: {
    backgroundColor: THEME.colors.primarySoft,
  },
  dayCircleToday: {
    backgroundColor: 'transparent',
  },
});
