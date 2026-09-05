import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReflectionStore } from '../store/useReflectionStore';
import { THEME } from '../../../core/constants/theme';
import { formatHeaderDates } from '../../../core/utils/date';

interface MuhasabahScreenProps {
  onBack: () => void;
}

interface HeartStateOption {
  id: string;
  arabicTitle: string;
  englishMeaning: string;
  stateDescription: string;
}

export const MuhasabahScreen: React.FC<MuhasabahScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const content = useReflectionStore((state) => state.content);
  const heartState = useReflectionStore((state) => state.heartState);
  const dateKey = useReflectionStore((state) => state.dateKey);
  const isSavedVisible = useReflectionStore((state) => state.isSavedVisible);
  const loadReflection = useReflectionStore((state) => state.loadReflection);
  const updateReflection = useReflectionStore((state) => state.updateReflection);
  const setHeartState = useReflectionStore((state) => state.setHeartState);

  const { gregorian, hijri } = formatHeaderDates(dateKey);


  useEffect(() => {
    loadReflection();
    // Guarantee screen ALWAYS opens at the very top (Evening Muhasabah header)
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, 50);
  }, []);

  const HEART_STATES: HeartStateOption[] = [
    {
      id: 'shukr',
      arabicTitle: 'Alhamdulillah',
      englishMeaning: 'Shukr & Contentment',
      stateDescription: 'My heart feels peaceful, grateful, and blessed.',
    },
    {
      id: 'tawakkul',
      arabicTitle: 'Tawakkul',
      englishMeaning: 'Trusting Allah',
      stateDescription: 'Facing uncertainty, but leaving all affairs in Allah’s care.',
    },
    {
      id: 'himmah',
      arabicTitle: 'Himmah',
      englishMeaning: 'High Spiritual Energy',
      stateDescription: 'Focused, productive, and eager for good deeds.',
    },
    {
      id: 'sabr',
      arabicTitle: 'Sabr',
      englishMeaning: 'Patience in Trials',
      stateDescription: 'Going through tests, holding steadfast with patience.',
    },
    {
      id: 'istighfar',
      arabicTitle: 'Astaghfirullah',
      englishMeaning: 'Need Forgiveness & Reset',
      stateDescription: 'Fell short today; seeking Allah’s mercy and renewal.',
    },
  ];

  const JOURNAL_PROMPTS = [
    '✨ 1 blessing or good deed from today...',
    '🤲 1 du\'a or area of growth for tomorrow...',
    '💡 1 lesson my heart learned today...',
  ];

  const handlePromptClick = (prompt: string) => {
    const updated = content ? `${content}\n\n${prompt}\n` : `${prompt}\n`;
    updateReflection(updated);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom + 120, 160) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Status */}
        {isSavedVisible && (
          <View style={styles.topNav}>
            <View />
            <Text style={styles.savedPill}>Saved to Journal</Text>
          </View>
        )}

        {/* Header - Always seen first */}
        <View style={styles.headerSection}>
          <Text style={styles.dateLabel}>{gregorian.toUpperCase()} • {hijri.toUpperCase()}</Text>
          <Text style={styles.title}>
            Evening <Text style={styles.italicAccent}>Muhasabah.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Take a quiet moment of stillness to audit your heart and deeds before sleep.
          </Text>
        </View>

        {/* Heart State Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTag}>SPIRITUAL CHECK-IN</Text>
          <Text style={styles.sectionHeading}>How is your heart tonight?</Text>
          <Text style={styles.sectionSub}>Select the spiritual state that resonates closest with your day.</Text>

          <View style={styles.stateList}>
            {HEART_STATES.map((option) => {
              const isSelected = heartState === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.stateItem, isSelected && styles.stateItemActive]}
                  onPress={() => setHeartState(option.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.stateTextCol}>
                    <View style={styles.stateTitleRow}>
                      <Text style={[styles.stateArabic, isSelected && styles.stateArabicActive]}>
                        {option.arabicTitle}
                      </Text>
                      <Text style={styles.stateEnglish}>• {option.englishMeaning}</Text>
                    </View>
                    <Text style={styles.stateDesc}>{option.stateDescription}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Guided Journaling Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTag}>DAILY REFLECTION</Text>
          <Text style={styles.sectionHeading}>Journal & Gratitude</Text>
          <Text style={styles.sectionSub}>Tap any prompt to add it to your thoughts.</Text>

          <View style={styles.promptList}>
            {JOURNAL_PROMPTS.map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.promptPill}
                onPress={() => handlePromptClick(p)}
                activeOpacity={0.7}
              >
                <Text style={styles.promptPillText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.journalInput}
            multiline
            placeholder="Reflect on your intentions, blessings, and deeds today..."
            placeholderTextColor={THEME.colors.textLight}
            value={content}
            onChangeText={updateReflection}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.bgPill,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  savedPill: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  headerSection: {
    marginBottom: 28,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontFamily: THEME.fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: THEME.colors.textHeading,
    fontWeight: '400',
    marginBottom: 8,
  },
  italicAccent: {
    fontFamily: THEME.fonts.serif,
    fontStyle: 'italic',
    color: THEME.colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textMuted,
    lineHeight: 20,
    fontWeight: '400',
  },
  sectionCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  sectionTag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  sectionHeading: {
    fontSize: 19,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  stateList: {
    gap: 10,
  },
  stateItem: {
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stateItemActive: {
    backgroundColor: THEME.colors.bgCardActive,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: THEME.colors.textLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: THEME.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.primary,
  },
  stateTextCol: {
    flex: 1,
  },
  stateTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  stateArabic: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.colors.textHeading,
  },
  stateArabicActive: {
    color: THEME.colors.primary,
  },
  stateEnglish: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  stateDesc: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    lineHeight: 16,
  },
  promptList: {
    gap: 8,
    marginBottom: 14,
  },
  promptPill: {
    backgroundColor: THEME.colors.bgCardSubtle,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
  },
  promptPillText: {
    fontSize: 13,
    color: THEME.colors.textBody,
    fontWeight: '500',
  },
  journalInput: {
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    padding: 16,
    color: THEME.colors.textHeading,
    fontSize: 14,
    minHeight: 120,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
});

