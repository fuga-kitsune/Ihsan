import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StreamlineFireIcon } from '../../../core/components/StreamlineFireIcon';
import { StreamlineCheckBadge } from '../../../core/components/StreamlineCheckBadge';
import { useTrackerStore } from '../store/useTrackerStore';
import { THEME } from '../../../core/constants/theme';
import { getTodayDateString } from '../../../core/utils/date';

export const ProgressCard: React.FC = () => {
  const stats = useTrackerStore((state) => state.stats);
  const weeklyCompletion = useTrackerStore((state) => state.weeklyCompletion);

  const flameScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(stats.percentage)).current;

  const todayKey = getTodayDateString();
  const todayCount = weeklyCompletion[todayKey] ?? (stats.completedCount);
  const isProtected = todayCount >= 5;
  const streak = stats.streak;

  useEffect(() => {
    // Smooth, snappy spring animation for the progress bar fill
    Animated.spring(progressAnim, {
      toValue: stats.percentage,
      friction: 8,
      tension: 50,
      useNativeDriver: false,
    }).start();
  }, [stats.percentage]);

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

  // Generate current week dates (Mon to Sun)
  const now = new Date();
  const currentDayOfWeek = (now.getDay() + 6) % 7; // Mon = 0, Sun = 6
  const monday = new Date(now);
  monday.setDate(now.getDate() - currentDayOfWeek);

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((letter, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isToday = idx === currentDayOfWeek;
    const isPast = idx < currentDayOfWeek;
    const count = weeklyCompletion[dateKey] || 0;
    const isCompleted = count >= 5;
    const isPartial = count > 0 && count < 5;

    return {
      letter,
      dateKey,
      count,
      isToday,
      isPast,
      isCompleted,
      isPartial,
    };
  });

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

      {/* RIGHT TILE: Daily Deeds with Tick Icon, Progress Bar & Week Matrix (M T W T F S S) */}
      <View style={styles.goalTile}>
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleRow}>
            <View style={styles.tickBoxCircle}>
              <Ionicons name="checkbox" size={17} color="#1E3A2F" />
            </View>
            <Text style={styles.goalTitle}>Daily Deeds</Text>
          </View>

          <View style={styles.scorePill}>
            <Text style={styles.scoreBold}>{stats.completedCount}</Text>
            <Text style={styles.scoreTotal}>/{stats.totalCount}</Text>
          </View>
        </View>

        {/* Slim Animated Progress Bar */}
        <View style={styles.miniBarBackground}>
          <Animated.View
            style={[
              styles.miniBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>

        {/* 7-DAY WEEK ROW (M T W T F S S) */}
        <View style={styles.weekRow}>
          {weekDays.map((d, idx) => {
            let iconNode = null;
            if (d.isCompleted) {
              iconNode = <StreamlineCheckBadge size={18} />;
            } else if (d.isPartial || (d.isToday && d.count > 0)) {
              iconNode = <StreamlineFireIcon size={18} />;
            }

            return (
              <View key={idx} style={styles.dayCol}>
                {/* Logo / Icon above the day letter */}
                <View
                  style={[
                    styles.dayCircle,
                    d.isCompleted && styles.dayCirclePast,
                    d.isToday && styles.dayCircleToday,
                  ]}
                >
                  {iconNode}
                </View>
                {/* Day Letter */}
                <Text style={[styles.dayLetter, d.isToday && styles.dayLetterToday]}>
                  {d.letter}
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
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 11,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ECEAE6',
    minHeight: 118,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tickBoxCircle: {
    width: 20,
    height: 20,
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
  miniBarBackground: {
    height: 4,
    backgroundColor: '#F5F5F4',
    borderRadius: THEME.radius.full,
    overflow: 'hidden',
    marginVertical: 4,
  },
  miniBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.full,
  },

  /* WEEKS ROW (M T W T F S S) */
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
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
