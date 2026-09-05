import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HasanatSummary } from '../models/analytics.model';
import { THEME } from '../../../core/constants/theme';

interface HasanatInsightsCardProps {
  summary: HasanatSummary;
  deedsCount: number;
}

export const HasanatInsightsCard: React.FC<HasanatInsightsCardProps> = ({ summary, deedsCount }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.tag}>DIVINE MULTIPLIER & REWARDS</Text>
          <Text style={styles.title}>Hasanat Accumulation</Text>
        </View>
        <View style={styles.multiplierBadge}>
          <Text style={styles.multiplierText}>10x - 700x</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{summary.monthHasanat.toLocaleString()}+</Text>
          <Text style={styles.statLabel}>This Month's Hasanat</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{summary.totalEstimatedHasanat.toLocaleString()}+</Text>
          <Text style={styles.statLabel}>All-Time Hasanat</Text>
        </View>
      </View>

      <View style={styles.hadithBox}>
        <Text style={styles.hadithArabic}>مَن جَاءَ بِالْحَسَنَةِ فَلَهُ عَشْرُ أَمْثَالِهَا</Text>
        <Text style={styles.hadithMeaning}>
          "Whoever comes with a good deed will have ten times the like thereof to his credit."
        </Text>
        <Text style={styles.hadithSource}>Surah Al-An'am (6:160)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  multiplierBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  multiplierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#ECEAE6',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  hadithBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: THEME.radius.md,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#EFE8DE',
  },
  hadithArabic: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A2F',
    textAlign: 'center',
  },
  hadithMeaning: {
    fontSize: 12,
    color: THEME.colors.textBody,
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  hadithSource: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    fontWeight: '600',
  },
});
