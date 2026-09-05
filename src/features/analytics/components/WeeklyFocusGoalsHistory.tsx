import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NiyyahItem } from '../../niyyah/models/niyyah.model';
import { THEME } from '../../../core/constants/theme';

interface WeeklyFocusGoalsHistoryProps {
  goals: NiyyahItem[];
}

export const WeeklyFocusGoalsHistory: React.FC<WeeklyFocusGoalsHistoryProps> = ({ goals }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Goals History</Text>

      {goals.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No goals set yet. Pick a goal on your Focus tab!</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {goals.map((item) => {
            const isDone = item.isCompleted;

            return (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.statusBadge, isDone ? styles.statusBadgeDone : styles.statusBadgeInProgress]}>
                    {isDone ? '✓ FULFILLED' : 'IN PROGRESS'}
                  </Text>
                  <Text style={styles.dateMetaText}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>

                <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>
                  "{item.title}"
                </Text>
              </View>
            );
          })}
        </View>
      )}
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
    gap: 10,
  },
  itemRow: {
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    padding: 14,
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statusBadgeDone: {
    color: THEME.colors.primary,
  },
  statusBadgeInProgress: {
    color: THEME.colors.primary,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.colors.textHeading,
    lineHeight: 20,
    fontFamily: THEME.fonts.serif,
  },
  itemTitleDone: {
    color: THEME.colors.primary,
    textDecorationLine: 'line-through',
  },
  dateMetaText: {
    fontSize: 11,
    color: THEME.colors.textLight,
  },
  emptyBox: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: THEME.colors.textMuted,
  },
});
