import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNiyyahStore } from '../store/useNiyyahStore';
import { QuestCard } from '../components/QuestCard';
import { SetNiyyahModal } from '../components/SetNiyyahModal';
import { SalawatCounterModal } from '../components/SalawatCounterModal';
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

  useEffect(() => {
    loadNiyyahAndQuests();
  }, []);

  const isFriday = new Date().getDay() === 5;

  // Surah Al-Kahf quest item for Friday
  const kahfQuest = quests.find((q) => q.id === 'quest_kahf');
  const salawatQuest = quests.find((q) => q.id === 'quest_salawat');

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

      {/* Friday Special Hot Card (ONLY shown on Fridays) */}
      {isFriday && kahfQuest && (
        <View style={[styles.hotFridayCard, kahfQuest.isCompleted && styles.hotFridayCardCompleted]}>
          <View style={styles.hotFridayHeader}>
            <View style={styles.hotBadge}>
              <Text style={styles.hotBadgeText}>HOT • FRIDAY SUNNAH</Text>
            </View>
            <TouchableOpacity
              onPress={() => kahfQuest.isCompleted ? resetQuest(kahfQuest.id) : incrementQuest(kahfQuest.id, 1)}
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

      {/* Up to 3 Weekly Goals Section */}
      <View style={styles.focusContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionHeading}>ACTIVE GOALS</Text>
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
            <Text style={styles.emptySub}>Choose from Tahajjud, Birr al-Walidayn, Salawat, or write your own.</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.goalsList}>
            {activeWeeklyNiyyahs.map((goal, idx) => {
              const isSalawatGoal = goal.title.toLowerCase().includes('salawat');
              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalTop}>
                    <Text style={styles.goalIndex}>GOAL {idx + 1}</Text>
                    <TouchableOpacity
                      onPress={() => deleteNiyyah(goal.id)}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.goalTitle}>"{goal.title}"</Text>

                  <View style={styles.goalActionsRow}>
                    {isSalawatGoal && salawatQuest && (
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

                    <TouchableOpacity
                      style={styles.fulfillBtn}
                      onPress={() => toggleNiyyahComplete(goal.id, false)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.fulfillBtnText}>Mark as Finished ✓</Text>
                    </TouchableOpacity>
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
                <Text style={styles.addSlotText}>+ Add Goal ({3 - activeCount} slot left)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
  removeText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME.colors.textHeading,
    lineHeight: 22,
    fontFamily: THEME.fonts.serif,
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
