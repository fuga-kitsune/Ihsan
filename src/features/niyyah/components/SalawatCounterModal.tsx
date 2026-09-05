import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Vibration, Platform } from 'react-native';
import { THEME } from '../../../core/constants/theme';
import { useNiyyahStore } from '../store/useNiyyahStore';
import { SpiritualQuest } from '../models/quest.model';

interface SalawatCounterModalProps {
  visible: boolean;
  quest: SpiritualQuest;
  onClose: () => void;
}

export const SalawatCounterModal: React.FC<SalawatCounterModalProps> = ({
  visible,
  quest: initialQuest,
  onClose,
}) => {
  const quests = useNiyyahStore((state) => state.quests);
  const quest = quests.find((q) => q.id === initialQuest.id) || initialQuest;

  const incrementQuest = useNiyyahStore((state) => state.incrementQuest);
  const resetQuest = useNiyyahStore((state) => state.resetQuest);

  const handleTap = () => {
    if (quest.currentCount >= quest.targetCount) return;

    const nextCount = quest.currentCount + 1;
    const justCompleted = nextCount >= quest.targetCount;

    // Trigger haptic vibration immediately
    if (Platform.OS !== 'web') {
      try {
        if (justCompleted) {
          Vibration.vibrate([0, 80, 80, 120]);
        } else {
          // Standard tactile bump
          Vibration.vibrate(25);
        }
      } catch (err) {
        console.warn('Vibration error', err);
      }
    }

    incrementQuest(quest.id, 1);
  };

  const isCompleted = quest.currentCount >= quest.targetCount;
  const progressPercent = Math.min(Math.round((quest.currentCount / quest.targetCount) * 100), 100);

  const isIstighfar = quest.id === 'quest_istighfar' || quest.title.toLowerCase().includes('istighfar');

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.tag}>
                {isIstighfar ? 'DAILY SUNNAH' : 'FRIDAY & WEEKLY SUNNAH'}
              </Text>
              <Text style={styles.title}>
                {isIstighfar ? '100x Daily Istighfar' : '1,000 Salawat Counter'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Remembrance text preview */}
          <View style={styles.arabicBox}>
            <Text style={styles.arabicText}>
              {isIstighfar ? 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ' : 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ'}
            </Text>
            <Text style={styles.transliteration}>
              {isIstighfar
                ? "Astaghfirullaha wa atubu ilayh"
                : "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad"}
            </Text>
          </View>

          {/* Large Tap Zone */}
          <TouchableOpacity
            style={[styles.tapCircle, isCompleted && styles.tapCircleCompleted]}
            onPress={handleTap}
            activeOpacity={0.85}
            disabled={isCompleted}
          >
            <Text style={[styles.tapCount, isCompleted && styles.tapCountCompleted]}>
              {quest.currentCount}
            </Text>
            <Text style={styles.tapTarget}>of {quest.targetCount}</Text>

            <View style={[styles.statusBadge, isCompleted && styles.statusBadgeCompleted]}>
              <Text style={[styles.statusBadgeText, isCompleted && styles.statusBadgeTextCompleted]}>
                {isCompleted ? 'Completed' : 'Tap to Count'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                  isCompleted && styles.progressBarFillCompleted,
                ]}
              />
            </View>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressPercent}>{progressPercent}% completed</Text>
              <Text style={styles.remainingText}>
                {isCompleted ? 'Goal fulfilled' : `${quest.targetCount - quest.currentCount} remaining`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: THEME.colors.bgCanvas,
    borderRadius: THEME.radius.lg,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  },
  closeText: {
    fontSize: 16,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  arabicBox: {
    backgroundColor: THEME.colors.bgCard,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE6',
    marginBottom: 20,
  },
  arabicText: {
    fontSize: 20,
    color: THEME.colors.textHeading,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  transliteration: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  tapCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FAF5EF',
    borderWidth: 3,
    borderColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    gap: 2,
  },
  tapCircleCompleted: {
    backgroundColor: '#F8FCF9',
    borderColor: '#10B981',
  },
  tapCount: {
    fontSize: 44,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: -1,
  },
  tapCountCompleted: {
    color: '#10B981',
  },
  tapTarget: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
    marginTop: 2,
  },
  statusBadgeCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  statusBadgeTextCompleted: {
    color: '#166534',
  },
  progressContainer: {
    width: '100%',
    marginTop: 18,
    gap: 6,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#ECEAE6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 4,
  },
  progressBarFillCompleted: {
    backgroundColor: '#10B981',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textHeading,
  },
  remainingText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  footerRow: {
    marginTop: 20,
    width: '100%',
  },
  resetBtn: {
    backgroundColor: '#FAF5EF',
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#EFE8DE',
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
});
