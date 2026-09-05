import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SpiritualQuest } from '../models/quest.model';
import { useNiyyahStore } from '../store/useNiyyahStore';
import { useTrackerStore } from '../../tracker/store/useTrackerStore';
import { ThemedConfirmModal } from '../../../core/components/ThemedConfirmModal';
import { THEME } from '../../../core/constants/theme';

interface QuestCardProps {
  quest: SpiritualQuest;
  onOpenCounter?: (quest: SpiritualQuest) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onOpenCounter }) => {
  const incrementQuest = useNiyyahStore((state) => state.incrementQuest);
  const resetQuest = useNiyyahStore((state) => state.resetQuest);
  const currentStreak = useTrackerStore((state) => state.stats.streak);

  const [confirmResetVisible, setConfirmResetVisible] = useState(false);

  const isFriday = new Date().getDay() === 5;
  const isKahf = quest.id === 'quest_kahf';
  const isSalawat = quest.id === 'quest_salawat';
  const isIstighfar = quest.id === 'quest_istighfar';
  const hasCounter = isSalawat || isIstighfar;

  const isNewlyUnlocked =
    (quest.requiredStreak ?? 0) > 0 &&
    !quest.isLocked &&
    currentStreak >= (quest.requiredStreak ?? 0) &&
    currentStreak <= (quest.requiredStreak ?? 0) + 2;

  const progress = Math.min(quest.currentCount / Math.max(quest.targetCount, 1), 1);
  const percentage = Math.round(progress * 100);

  const handleAction = () => {
    if (quest.isLocked) return;
    if (quest.isCompleted) {
      setConfirmResetVisible(true);
    } else if (hasCounter && onOpenCounter) {
      onOpenCounter(quest);
    } else {
      incrementQuest(quest.id, 1);
    }
  };

  if (quest.isLocked) {
    return (
      <View style={[styles.card, styles.cardLocked]}>
        <View style={styles.mainRow}>
          <View style={styles.infoCol}>
            <View style={styles.titleLine}>
              <View style={styles.blurredPill}>
                <Text style={styles.blurredPlaceholder}>••••••••••••••••</Text>
              </View>
              <View style={styles.lockBadge}>
                <Text style={styles.lockBadgeText}>🔒 {quest.requiredStreak}-day streak</Text>
              </View>
            </View>
            <Text style={styles.subInfoLocked}>
              Keep up your streak to reveal this weekly habit
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, isNewlyUnlocked && styles.cardNewlyUnlocked, quest.isCompleted && styles.cardCompleted]}>
      {/* Main Row */}
      <View style={styles.mainRow}>
        <TouchableOpacity
          activeOpacity={hasCounter ? 0.7 : 1}
          onPress={() => hasCounter && onOpenCounter && onOpenCounter(quest)}
          style={styles.infoCol}
        >
          <View style={styles.titleLine}>
            <Text style={[styles.title, quest.isCompleted && styles.titleCompleted]}>
              {quest.title}
            </Text>
            {isNewlyUnlocked && (
              <View style={styles.newBadgeRed}>
                <Text style={styles.newBadgeRedText}>NEW</Text>
              </View>
            )}
            {isKahf && (
              <View style={[styles.miniBadge, isFriday ? styles.fridayActiveBadge : styles.fridayBadge]}>
                <Text style={[styles.miniBadgeText, isFriday ? styles.fridayActiveText : styles.fridayText]}>
                  {isFriday ? 'Today' : 'Friday'}
                </Text>
              </View>
            )}
            {quest.isCompleted && (
              <View style={styles.doneBadge}>
                <Text style={styles.doneBadgeText}>DONE</Text>
              </View>
            )}
          </View>

          <Text style={styles.subInfo}>
            <Text style={styles.countBold}>{quest.currentCount}</Text>/{quest.targetCount} {quest.unit}
            {percentage > 0 && !quest.isCompleted ? `  •  ${percentage}%` : ''}
          </Text>
        </TouchableOpacity>

        {/* Action Buttons: Increment + Undo/Reset */}
        <View style={styles.actionButtonsRow}>
          {quest.currentCount > 0 && !quest.isCompleted && (
            <TouchableOpacity
              onPress={() => incrementQuest(quest.id, -1)}
              activeOpacity={0.7}
              style={styles.btnUndo}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Text style={styles.btnUndoText}>-1</Text>
            </TouchableOpacity>
          )}

          {!quest.isCompleted ? (
            <TouchableOpacity
              onPress={handleAction}
              activeOpacity={0.7}
              style={[
                styles.btn,
                hasCounter && styles.btnCounter,
              ]}
            >
              <Text
                style={[
                  styles.btnText,
                  hasCounter && styles.btnCounterText,
                ]}
              >
                {hasCounter ? 'Counter' : '+1'}
              </Text>
            </TouchableOpacity>
          ) : !isIstighfar && quest.period !== 'Daily' ? (
            <TouchableOpacity
              onPress={handleAction}
              activeOpacity={0.7}
              style={[styles.btn, styles.btnReset]}
            >
              <Text style={[styles.btnText, styles.btnResetText]}>
                Reset
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Thin Slim Progress Track */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            { width: `${percentage}%` },
            quest.isCompleted && styles.progressBarCompleted,
          ]}
        />
      </View>

      <ThemedConfirmModal
        visible={confirmResetVisible}
        tag="RESTART SUNNAH"
        tagColor={THEME.colors.accentRose}
        title="Restart Sunnah Goal?"
        description={`You have already finished "${quest.title}" for this week! Are you sure you want to reset your progress to 0 and restart?`}
        confirmText="Restart Goal"
        cancelText="Keep Finished"
        confirmVariant="danger"
        onConfirm={() => {
          setConfirmResetVisible(false);
          resetQuest(quest.id);
        }}
        onCancel={() => setConfirmResetVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEAE6',
    gap: 8,
  },
  cardNewlyUnlocked: {
    backgroundColor: '#FFF8F6',
    borderColor: '#FED7D7',
  },
  cardLocked: {
    backgroundColor: '#F9F8F6',
    borderColor: '#ECEAE6',
    opacity: 0.75,
  },
  cardCompleted: {
    backgroundColor: '#F8FCF9',
    borderColor: '#D7EFE2',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  infoCol: {
    flex: 1,
    gap: 3,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.2,
  },
  titleLocked: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.colors.textMuted,
  },
  titleCompleted: {
    color: '#1E3A2F',
    textDecorationLine: 'line-through',
  },
  lockBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  lockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  newBadgeRed: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  newBadgeRedText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.6,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  fridayBadge: {
    backgroundColor: '#F3F4F6',
  },
  fridayActiveBadge: {
    backgroundColor: '#E8F5E9',
  },
  miniBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  fridayText: {
    color: THEME.colors.textMuted,
  },
  fridayActiveText: {
    color: '#1E3A2F',
  },
  doneBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.radius.full,
  },
  doneBadgeText: {
    color: '#166534',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subInfo: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '400',
  },
  subInfoLocked: {
    fontSize: 12,
    color: THEME.colors.textLight,
  },
  countBold: {
    fontWeight: '700',
    color: THEME.colors.textHeading,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnUndo: {
    backgroundColor: '#F5F5F4',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnUndoText: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  btn: {
    backgroundColor: '#F5F5F4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    minWidth: 44,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  btnCounter: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  btnCounterText: {
    color: '#B45309',
  },
  btnReset: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  btnResetText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#F0EFEA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 2,
  },
  progressBarCompleted: {
    backgroundColor: '#10B981',
  },
  blurredPill: {
    backgroundColor: '#E7E5E4',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: THEME.radius.sm,
  },
  blurredPlaceholder: {
    fontSize: 12,
    color: '#A8A29E',
    letterSpacing: 2,
    fontWeight: '700',
  },
});
