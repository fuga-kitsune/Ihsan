import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NiyyahItem } from '../../niyyah/models/niyyah.model';
import { THEME } from '../../../core/constants/theme';

interface NiyyahMilestonesHistoryProps {
  niyyahs: NiyyahItem[];
}

export const NiyyahMilestonesHistory: React.FC<NiyyahMilestonesHistoryProps> = ({ niyyahs }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.tag}>INTENTIONS & MILESTONES</Text>
      <Text style={styles.title}>Niyyah Journey</Text>
      <Text style={styles.subtitle}>History of weekly & monthly spiritual goals you set and fulfilled.</Text>

      {niyyahs.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No intentions set yet. Set a weekly goal on the dashboard!</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {niyyahs.map((item) => {
            const isDone = item.isCompleted;

            return (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemHeader}>
                  <View style={[styles.timeframeBadge, item.timeframe === 'monthly' && styles.timeframeBadgeMonthly]}>
                    <Text style={styles.timeframeBadgeText}>
                      {item.timeframe.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.statusBadge, isDone ? styles.statusBadgeDone : styles.statusBadgeInProgress]}>
                    {isDone ? '✓ FULFILLED' : 'IN PROGRESS'}
                  </Text>
                </View>

                <Text style={[styles.itemTitle, isDone && styles.itemTitleDone]}>
                  "{item.title}"
                </Text>

                <View style={styles.dateMetaRow}>
                  <Text style={styles.dateMetaText}>
                    🌱 Started: {formatDate(item.createdAt)}
                  </Text>
                  {isDone && item.completedAt ? (
                    <Text style={styles.dateMetaTextDone}>
                      ✨ Fulfilled: {formatDate(item.completedAt)}
                    </Text>
                  ) : (
                    <Text style={styles.dateMetaTextPending}>
                      ⏳ Still active
                    </Text>
                  )}
                </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  itemRow: {
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    padding: 16,
    gap: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeframeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.bgPillActive,
  },
  timeframeBadgeMonthly: {
    backgroundColor: THEME.colors.accentGold,
  },
  timeframeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
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
    color: THEME.colors.textMuted,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: THEME.colors.textHeading,
    lineHeight: 21,
    fontFamily: THEME.fonts.serif,
  },
  itemTitleDone: {
    color: THEME.colors.primary,
  },
  dateMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
  },
  dateMetaText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  dateMetaTextDone: {
    fontSize: 11,
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  dateMetaTextPending: {
    fontSize: 11,
    color: THEME.colors.accentGold,
    fontWeight: '500',
  },
  emptyBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: THEME.colors.textMuted,
  },
});
