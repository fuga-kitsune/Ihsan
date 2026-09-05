import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { NiyyahTimeframe } from '../models/niyyah.model';
import { useNiyyahStore } from '../store/useNiyyahStore';
import { THEME } from '../../../core/constants/theme';

interface SetNiyyahModalProps {
  visible: boolean;
  defaultTimeframe?: NiyyahTimeframe;
  onClose: () => void;
}

export const SetNiyyahModal: React.FC<SetNiyyahModalProps> = ({
  visible,
  onClose,
}) => {
  const setNiyyah = useNiyyahStore((state) => state.setNiyyah);
  const activeWeeklyNiyyahs = useNiyyahStore((state) => state.activeWeeklyNiyyahs);
  const [title, setTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const QUICK_WEEKLY_GOALS = [
    'Surah Al-Mulk every night before sleep',
    'Honor parents: Call or send a gift',
    'Night Prayer (Tahajjud) twice this week',
    'Pray all 12 Sunnah Rawatib daily',
    'Fast Monday & Thursday',
    '100x Daily Istighfar & Tawbah',
    'Salatul Dhuha every morning',
    'Guard the tongue from harsh speech',
  ];

  const isGoalCommitted = (goalText: string) => {
    return activeWeeklyNiyyahs.some(
      (n) => n.title.trim().toLowerCase() === goalText.trim().toLowerCase()
    );
  };

  const handleSave = async (intentionText?: string) => {
    const textToSave = (intentionText || title).trim();
    if (!textToSave) return;

    if (isGoalCommitted(textToSave)) {
      setErrorMsg('You have already committed to this goal for this week.');
      return;
    }

    if (activeWeeklyNiyyahs.length >= 3) {
      setErrorMsg('You already have 3 active weekly goals for this week.');
      return;
    }

    const success = await setNiyyah(textToSave, 'weekly');
    if (!success) {
      setErrorMsg('Unable to add goal. You already committed to this goal or reached the 3-goal weekly limit.');
      return;
    }

    setErrorMsg(null);
    setTitle('');
    onClose();
  };

  const isFull = activeWeeklyNiyyahs.length >= 3;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.tag}>WEEKLY FOCUS ({activeWeeklyNiyyahs.length}/3 ACTIVE)</Text>
              <Text style={styles.title}>Pick a Spiritual Goal</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isFull ? (
            <View style={styles.limitBanner}>
              <Text style={styles.limitTitle}>3 Weekly Goals Committed (3/3)</Text>
              <Text style={styles.limitSub}>
                You have set all 3 spiritual goals for this week. Once chosen, they remain committed for the week until next week's cycle begins.
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {errorMsg && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              )}

              {/* Custom Input */}
              <Text style={styles.label}>WRITE YOUR OWN</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Read Surah Al-Mulk every night..."
                placeholderTextColor={THEME.colors.textLight}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errorMsg) setErrorMsg(null);
                }}
              />

              {title.trim().length > 0 && (
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => handleSave()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveBtnText}>Add to Weekly Focus</Text>
                </TouchableOpacity>
              )}

              {/* Quick Goals List */}
              <Text style={[styles.label, { marginTop: 16 }]}>QUICK GOALS</Text>
              <View style={styles.ideaList}>
                {QUICK_WEEKLY_GOALS.map((goal) => {
                  const alreadyChosen = isGoalCommitted(goal);
                  return (
                    <TouchableOpacity
                      key={goal}
                      style={[styles.ideaCard, alreadyChosen && styles.ideaCardChosen]}
                      onPress={() => !alreadyChosen && handleSave(goal)}
                      activeOpacity={alreadyChosen ? 1 : 0.7}
                      disabled={alreadyChosen}
                    >
                      <View style={styles.ideaCardRow}>
                        <Text style={[styles.ideaText, alreadyChosen && styles.ideaTextChosen]}>
                          {goal}
                        </Text>
                        {alreadyChosen && (
                          <View style={styles.chosenBadge}>
                            <Text style={styles.chosenBadgeText}>COMMITTED</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: THEME.colors.bgCanvas,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    padding: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  closeText: {
    fontSize: 16,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: 16,
    color: THEME.colors.textHeading,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  ideaList: {
    gap: 8,
  },
  ideaCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  ideaText: {
    fontSize: 13,
    color: THEME.colors.textBody,
    lineHeight: 18,
    fontWeight: '500',
  },
  limitBanner: {
    backgroundColor: '#FEF3C7',
    padding: 18,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 6,
    marginVertical: 10,
  },
  limitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
  },
  limitSub: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: THEME.radius.md,
    marginBottom: 12,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '600',
  },
  ideaCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  ideaCardChosen: {
    backgroundColor: '#F7F6F3',
    borderColor: '#E8E5DF',
    opacity: 0.65,
  },
  ideaTextChosen: {
    color: THEME.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  chosenBadge: {
    backgroundColor: '#E7E5E4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  chosenBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
});
