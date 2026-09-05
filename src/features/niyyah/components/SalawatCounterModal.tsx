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
  quest,
  onClose,
}) => {
  const incrementQuest = useNiyyahStore((state) => state.incrementQuest);
  const resetQuest = useNiyyahStore((state) => state.resetQuest);

  const [sessionTaps, setSessionTaps] = useState(0);

  const handleTap = () => {
    if (quest.currentCount >= quest.targetCount) return;

    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate(10);
      } catch {}
    }

    incrementQuest(quest.id, 1);
    setSessionTaps((prev) => prev + 1);
  };

  const handleAddBatch = (amount: number) => {
    if (quest.currentCount >= quest.targetCount) return;
    const toAdd = Math.min(amount, quest.targetCount - quest.currentCount);
    incrementQuest(quest.id, toAdd);
    setSessionTaps((prev) => prev + toAdd);
  };

  const isCompleted = quest.currentCount >= quest.targetCount;
  const progressPercent = Math.min(Math.round((quest.currentCount / quest.targetCount) * 100), 100);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.tag}>FRIDAY & WEEKLY SUNNAH</Text>
              <Text style={styles.title}>1,000 Salawat Counter</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Salawat text preview */}
          <View style={styles.arabicBox}>
            <Text style={styles.arabicText}>
              اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
            </Text>
            <Text style={styles.transliteration}>
              Allahumma salli 'ala Muhammad wa 'ala ali Muhammad
            </Text>
          </View>

          {/* Large Tap Zone */}
          <TouchableOpacity
            style={[styles.tapCircle, isCompleted && styles.tapCircleCompleted]}
            onPress={handleTap}
            activeOpacity={0.8}
            disabled={isCompleted}
          >
            <Text style={[styles.tapCount, isCompleted && styles.tapCountCompleted]}>
              {quest.currentCount}
            </Text>
            <Text style={styles.tapTarget}>of {quest.targetCount}</Text>
            <Text style={styles.tapHint}>
              {isCompleted ? 'Finished! Alhamdulillah' : 'Tap to Count'}
            </Text>
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
                {isCompleted ? 'Goal reached' : `${quest.targetCount - quest.currentCount} remaining`}
              </Text>
            </View>
          </View>

          {/* Quick Batch Buttons & Reset */}
          <View style={styles.footerRow}>
            {!isCompleted ? (
              <View style={styles.batchRow}>
                <TouchableOpacity style={styles.batchBtn} onPress={() => handleAddBatch(10)}>
                  <Text style={styles.batchBtnText}>+10</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.batchBtn} onPress={() => handleAddBatch(33)}>
                  <Text style={styles.batchBtnText}>+33</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.batchBtn} onPress={() => handleAddBatch(100)}>
                  <Text style={styles.batchBtnText}>+100</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => resetQuest(quest.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.resetBtnText}>Reset Counter</Text>
              </TouchableOpacity>
            )}
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
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#FAF5EF',
    borderWidth: 4,
    borderColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tapCircleCompleted: {
    backgroundColor: '#E8F5E9',
    borderColor: '#10B981',
  },
  tapCount: {
    fontSize: 38,
    fontWeight: '700',
    color: THEME.colors.primary,
    letterSpacing: -1,
  },
  tapCountCompleted: {
    color: '#10B981',
  },
  tapTarget: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '500',
    marginTop: -2,
  },
  tapHint: {
    fontSize: 11,
    color: THEME.colors.accentGold,
    fontWeight: '600',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
  batchRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
  },
  batchBtn: {
    flex: 1,
    backgroundColor: THEME.colors.bgCard,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  batchBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  resetBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    width: '100%',
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
});
