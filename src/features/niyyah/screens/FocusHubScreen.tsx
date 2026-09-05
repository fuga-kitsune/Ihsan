import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNiyyahStore } from '../store/useNiyyahStore';
import { useTrackerStore } from '../../tracker/store/useTrackerStore';
import { QuestCard } from '../components/QuestCard';
import { SetNiyyahModal } from '../components/SetNiyyahModal';
import { SalawatCounterModal } from '../components/SalawatCounterModal';
import { ThemedConfirmModal } from '../../../core/components/ThemedConfirmModal';
import { SpiritualQuest } from '../models/quest.model';
import { THEME } from '../../../core/constants/theme';

export const FocusHubScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const activeWeeklyNiyyahs = useNiyyahStore((state) => state.activeWeeklyNiyyahs);
  const quests = useNiyyahStore((state) => state.quests);
  const loadNiyyahAndQuests = useNiyyahStore((state) => state.loadNiyyahAndQuests);
  const toggleNiyyahComplete = useNiyyahStore((state) => state.toggleNiyyahComplete);
  const deleteNiyyah = useNiyyahStore((state) => state.deleteNiyyah);
  const incrementQuest = useNiyyahStore((state) => state.incrementQuest);
  const resetQuest = useNiyyahStore((state) => state.resetQuest);

  const [modalVisible, setModalVisible] = useState(false);
  const [salawatModalVisible, setSalawatModalVisible] = useState(false);

  // Themed confirmation modal state for Weekly Goal completion
  const [finishGoalTarget, setFinishGoalTarget] = useState<{ id: string; title: string } | null>(null);

  // Themed confirmation modal state for Event restart
  const [resetEventTarget, setResetEventTarget] = useState<{ id: string; title: string } | null>(null);

  const handlePromptFinishGoal = (id: string, title: string) => {
    setFinishGoalTarget({ id, title });
  };

  const confirmFinishGoal = () => {
    if (finishGoalTarget) {
      toggleNiyyahComplete(finishGoalTarget.id, false);
      setFinishGoalTarget(null);
    }
  };

  const confirmResetEvent = (questTitle: string, questId: string) => {
    setResetEventTarget({ id: questId, title: questTitle });
  };

  const executeResetEvent = () => {
    if (resetEventTarget) {
      resetQuest(resetEventTarget.id);
      setResetEventTarget(null);
    }
  };

  useEffect(() => {
    loadNiyyahAndQuests();
  }, []);

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const isFriday = dayOfWeek === 5;
  const isThursdayEveningOrFriday = dayOfWeek === 4 || dayOfWeek === 5;
  const isMonOrThu = dayOfWeek === 1 || dayOfWeek === 4;

  // Surah Al-Kahf & Salawat quests
  const kahfQuest = quests.find((q) => q.id === 'quest_kahf');
  const salawatQuest = quests.find((q) => q.id === 'quest_salawat');
  const fastingQuest = quests.find((q) => q.id === 'quest_fasting');

  const currentStreak = useTrackerStore((state) => state.stats.streak);

  // Load quests with current streak
  useEffect(() => {
    loadNiyyahAndQuests();
  }, [currentStreak]);

  // Quests (filter out Kahf as it is in the Event banner)
  const allQuests = quests.filter((q) => q.id !== 'quest_kahf');
  const unlockedQuests = allQuests.filter((q) => !q.isLocked);

  const activeCount = activeWeeklyNiyyahs.length;
  const canAddMore = activeCount < 3;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: Math.max(insets.bottom + 40, 60) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.tag}>WEEKLY FOCUS</Text>
        <Text style={styles.title}>
          Set your spiritual <Text style={styles.italicAccent}>goals.</Text>
        </Text>
      </View>

      {/* Up to 3 Weekly Goals Section */}
      <View style={styles.focusContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionHeading}>THIS WEEK'S GOALS</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{activeCount}/3</Text>
            </View>
          </View>
          {canAddMore && (
            <TouchableOpacity onPress={() => setModalVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.addActionText}>+ Add Goal</Text>
            </TouchableOpacity>
          )}
        </View>

        {activeWeeklyNiyyahs.length === 0 ? (
          <TouchableOpacity style={styles.emptyPrompt} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
            <Text style={styles.emptyTitle}>Pick Up to 3 Weekly Goals</Text>
            <Text style={styles.emptySub}>Choose from Starter, Sunnah, and Mastery goals as your streak grows.</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.goalsList}>
            {activeWeeklyNiyyahs.map((goal, idx) => {
              const isSalawatGoal = goal.title.toLowerCase().includes('salawat');
              const isDone = goal.isCompleted;

              return (
                <View key={goal.id} style={[styles.goalCard, isDone && styles.goalCardCompleted]}>
                  <View style={styles.goalTop}>
                    <Text style={[styles.goalIndex, isDone && styles.goalIndexCompleted]}>
                      GOAL {idx + 1} • {isDone ? 'COMPLETED' : 'COMMITTED'}
                    </Text>
                    <View style={[styles.committedBadge, isDone && styles.committedBadgeDone]}>
                      <Text style={[styles.committedBadgeText, isDone && styles.committedBadgeTextDone]}>
                        {isDone ? '✓ FULFILLED' : '🔒 THIS WEEK'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.goalTitle, isDone && styles.goalTitleCompleted]}>
                    "{goal.title}"
                  </Text>

                  <View style={styles.goalActionsRow}>
                    {isSalawatGoal && salawatQuest && !isDone && (
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => setSalawatModalVisible(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.counterBtnText}>
                          Tap Counter ({salawatQuest.currentCount}/{salawatQuest.targetCount})
                        </Text>
                      </TouchableOpacity>
                    )}

                    {!isDone ? (
                      <TouchableOpacity
                        style={styles.fulfillBtn}
                        onPress={() => handlePromptFinishGoal(goal.id, goal.title)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.fulfillBtnText}>Mark as Finished ✓</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.finishedPill}>
                        <Text style={styles.finishedPillText}>✓ Finished • Locked until next week</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}

            {canAddMore && (
              <TouchableOpacity
                style={styles.addSlotBtn}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.addSlotText}>+ Pick Weekly Goal ({3 - activeCount} slot left)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* DYNAMIC SUNNAH EVENTS BANNER (Placed directly above Weekly Sunnah) */}
      {isFriday && (
        <View style={styles.eventGroup}>
          {/* 1) Friday Hot Surah Kahf */}
          {kahfQuest && (
            <View style={[styles.hotFridayCard, kahfQuest.isCompleted && styles.hotFridayCardCompleted]}>
              <View style={styles.hotFridayHeader}>
                <View style={styles.hotBadge}>
                  <Text style={styles.hotBadgeText}>HOT • FRIDAY SUNNAH</Text>
                </View>
                <TouchableOpacity
                  onPress={() => kahfQuest.isCompleted ? confirmResetEvent(kahfQuest.title, kahfQuest.id) : incrementQuest(kahfQuest.id, 1)}
                  style={[styles.hotActionBtn, kahfQuest.isCompleted && styles.hotActionBtnCompleted]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.hotActionBtnText, kahfQuest.isCompleted && styles.hotActionBtnTextCompleted]}>
                    {kahfQuest.isCompleted ? 'Finished ✓' : 'Mark as Read'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.hotTitle, kahfQuest.isCompleted && styles.hotTitleCompleted]}>
                Read Surah Al-Kahf Today
              </Text>
              <Text style={styles.hotSub}>
                "Whoever reads Surah al-Kahf on Friday, a light will shine for him between this Friday and the next."
              </Text>
            </View>
          )}

          {/* 2) Friday 1,000 Salawat Event */}
          {salawatQuest && (
            <View style={[styles.eventSalawatCard, salawatQuest.isCompleted && styles.eventSalawatCardCompleted]}>
              <View style={styles.hotFridayHeader}>
                <View style={styles.salawatBadge}>
                  <Text style={styles.salawatBadgeText}>FRIDAY EVENT • 1,000 SALAWAT</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSalawatModalVisible(true)}
                  style={styles.salawatActionBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.salawatActionBtnText}>
                    {salawatQuest.isCompleted ? 'Finished ✓' : `Open Counter (${salawatQuest.currentCount}/${salawatQuest.targetCount})`}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.salawatTitle}>
                Send 1,000 Blessings Upon the Prophet ﷺ
              </Text>
              <Text style={styles.salawatSub}>
                "Increase your sending of blessings upon me on the day of Friday..." — (Abu Dawud)
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Monday & Thursday Fasting Event (when not Friday) */}
      {!isFriday && isMonOrThu && fastingQuest && (
        <View style={styles.monThuEventCard}>
          <View style={styles.hotFridayHeader}>
            <View style={styles.fastingBadge}>
              <Text style={styles.fastingBadgeText}>SUNNAH EVENT • {dayOfWeek === 1 ? 'MONDAY' : 'THURSDAY'} FASTING</Text>
            </View>
            <TouchableOpacity
              onPress={() => fastingQuest.isCompleted ? confirmResetEvent(fastingQuest.title, fastingQuest.id) : incrementQuest(fastingQuest.id, 1)}
              style={styles.fastingActionBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.fastingActionBtnText}>
                {fastingQuest.isCompleted ? 'Fasted ✓' : 'Log Fast'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.fastingTitle}>
            Fast Today (Sunnah of the Prophet ﷺ)
          </Text>
          <Text style={styles.fastingSub}>
            "Deeds are presented on Mondays and Thursdays, and I love for my deeds to be presented while fasting." — (Tirmidhi)
          </Text>
        </View>
      )}

      {/* Weekly Sunnah Section */}
      <View style={styles.habitsSection}>
        <Text style={styles.habitsHeading}>WEEKLY SUNNAH</Text>
        <View style={styles.questsList}>
          {unlockedQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onOpenCounter={() => setSalawatModalVisible(true)}
            />
          ))}
        </View>
      </View>

      <SetNiyyahModal
        visible={modalVisible}
        defaultTimeframe="weekly"
        onClose={() => setModalVisible(false)}
      />

      {salawatQuest && (
        <SalawatCounterModal
          visible={salawatModalVisible}
          quest={salawatQuest}
          onClose={() => setSalawatModalVisible(false)}
        />
      )}

      {/* Themed Confirmation for Weekly Goal Completion */}
      <ThemedConfirmModal
        visible={!!finishGoalTarget}
        tag="WEEKLY GOAL"
        tagColor={THEME.colors.primary}
        title="Complete Weekly Goal?"
        description={`Are you sure you want to mark "${finishGoalTarget?.title}" as finished? Once fulfilled, it cannot be changed or swapped until next week.`}
        confirmText="Mark Finished ✓"
        cancelText="Not Yet"
        confirmVariant="primary"
        onConfirm={confirmFinishGoal}
        onCancel={() => setFinishGoalTarget(null)}
      />

      {/* Themed Confirmation for Event Restart */}
      <ThemedConfirmModal
        visible={!!resetEventTarget}
        tag="RESTART EVENT"
        tagColor={THEME.colors.accentRose}
        title="Restart Sunnah Goal?"
        description={`You have already finished "${resetEventTarget?.title}" for today! Are you sure you want to reset your progress and restart?`}
        confirmText="Restart Event"
        cancelText="Keep Finished"
        confirmVariant="danger"
        onConfirm={executeResetEvent}
        onCancel={() => setResetEventTarget(null)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerSection: {
    marginBottom: 20,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontFamily: THEME.fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: THEME.colors.textHeading,
    fontWeight: '400',
  },
  italicAccent: {
    fontFamily: THEME.fonts.serif,
    fontStyle: 'italic',
    color: THEME.colors.primary,
  },
  focusContainer: {
    marginBottom: 20,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 1,
  },
  countBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  addActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  goalsList: {
    gap: 10,
  },
  goalCard: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    gap: 8,
  },
  goalCardCompleted: {
    backgroundColor: '#F8FCF9',
    borderColor: '#D7EFE2',
  },
  goalTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalIndex: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.8,
  },
  goalIndexCompleted: {
    color: '#166534',
  },
  committedBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  committedBadgeDone: {
    backgroundColor: '#DCFCE7',
  },
  committedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  committedBadgeTextDone: {
    color: '#166534',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME.colors.textHeading,
    lineHeight: 22,
    fontFamily: THEME.fonts.serif,
  },
  goalTitleCompleted: {
    color: '#1E3A2F',
    textDecorationLine: 'line-through',
  },
  finishedPill: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
  },
  finishedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  goalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  counterBtn: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  counterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B45309',
  },
  fulfillBtn: {
    backgroundColor: THEME.colors.bgCard,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  fulfillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  addSlotBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D4C5B9',
    borderRadius: THEME.radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSlotText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  emptyPrompt: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    gap: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textHeading,
  },
  emptySub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 18,
  },
  hotFridayCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: THEME.radius.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
  },
  hotFridayCardCompleted: {
    backgroundColor: '#F8FCF9',
    borderColor: '#D7EFE2',
  },
  hotFridayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.8,
  },
  hotActionBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
  },
  hotActionBtnCompleted: {
    backgroundColor: '#E8F5E9',
  },
  hotActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  hotActionBtnTextCompleted: {
    color: '#1E3A2F',
  },
  hotTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.2,
  },
  hotTitleCompleted: {
    color: '#1E3A2F',
    textDecorationLine: 'line-through',
  },
  hotSub: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  eventGroup: {
    gap: 12,
    marginBottom: 20,
  },
  eventSalawatCard: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    gap: 8,
  },
  eventSalawatCardCompleted: {
    backgroundColor: '#F8FCF9',
    borderColor: '#D7EFE2',
  },
  salawatBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  salawatBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.8,
  },
  salawatActionBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
  },
  salawatActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  salawatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.2,
  },
  salawatSub: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  monThuEventCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: THEME.radius.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
  },
  fastingBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  fastingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
    letterSpacing: 0.8,
  },
  fastingActionBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
  },
  fastingActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  fastingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14532D',
    letterSpacing: -0.2,
  },
  fastingSub: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  habitsSection: {
    gap: 8,
    marginTop: 4,
  },
  habitsHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  questsList: {
    gap: 4,
  },
});
