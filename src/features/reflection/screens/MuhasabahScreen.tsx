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

import { TodayDeedsSnapshotCard } from '../components/TodayDeedsSnapshotCard';
import { SleepSunnahRemembranceCard } from '../components/SleepSunnahRemembranceCard';
import { shiftDate, getTodayDateString } from '../../../core/utils/date';
import { useTrackerStore } from '../../tracker/store/useTrackerStore';

interface MuhasabahScreenProps {
  onBack: () => void;
}

interface HeartStateOption {
  id: string;
  arabicTitle: string;
  englishMeaning: string;
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

  const habits = useTrackerStore((state) => state.habits);
  const loadHabits = useTrackerStore((state) => state.loadHabits);

  const todayStr = getTodayDateString();
  const isToday = dateKey === todayStr;

  const { gregorian, hijri } = formatHeaderDates(dateKey);

  useEffect(() => {
    loadReflection(dateKey);
    loadHabits(dateKey);
    // Guarantee screen ALWAYS opens at the very top (Evening Muhasabah header)
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, 50);
  }, [dateKey]);

  const handlePrevDay = () => {
    const prev = shiftDate(dateKey, -1);
    loadReflection(prev);
    loadHabits(prev);
  };

  const handleNextDay = () => {
    if (isToday) return;
    const next = shiftDate(dateKey, 1);
    loadReflection(next);
    loadHabits(next);
  };

  const HEART_STATES: HeartStateOption[] = [
    {
      id: 'shukr',
      arabicTitle: 'Alhamdulillah',
      englishMeaning: 'Grateful & Content',
    },
    {
      id: 'tawakkul',
      arabicTitle: 'Tawakkul',
      englishMeaning: 'Trusting Allah',
    },
    {
      id: 'himmah',
      arabicTitle: 'Himmah',
      englishMeaning: 'Energized & Focused',
    },
    {
      id: 'sabr',
      arabicTitle: 'Sabr',
      englishMeaning: 'Patient in Trials',
    },
    {
      id: 'istighfar',
      arabicTitle: 'Astaghfirullah',
      englishMeaning: 'Seeking Forgiveness',
    },
  ];

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
        {/* Top Status & Date Switcher */}
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.dateNavBtn}
            onPress={handlePrevDay}
            activeOpacity={0.7}
          >
            <Text style={styles.dateNavBtnText}>← Yesterday</Text>
          </TouchableOpacity>

          {isSavedVisible ? (
            <Text style={styles.savedPill}>Saved to Journal ✓</Text>
          ) : (
            <Text style={styles.currentDateIndicator}>{isToday ? 'Tonight' : 'Past Reflection'}</Text>
          )}

          <TouchableOpacity
            style={[styles.dateNavBtn, isToday && styles.dateNavBtnDisabled]}
            onPress={handleNextDay}
            disabled={isToday}
            activeOpacity={0.7}
          >
            <Text style={[styles.dateNavBtnText, isToday && styles.dateNavBtnTextDisabled]}>
              Tomorrow →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Header - Always seen first */}
        <View style={styles.headerSection}>
          <Text style={styles.dateLabel}>{gregorian.toUpperCase()} • {hijri.toUpperCase()}</Text>
          <Text style={styles.title}>
            Evening <Text style={styles.italicAccent}>Muhasabah.</Text>
          </Text>
        </View>

        {/* 1. Today's Deeds Snapshot Card */}
        <TodayDeedsSnapshotCard habits={habits} dateLabel={gregorian} />

        {/* 2. Heart State Check-in Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>How is your heart tonight?</Text>

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
                  <View style={styles.stateTitleRow}>
                    <Text style={[styles.stateArabic, isSelected && styles.stateArabicActive]}>
                      {option.arabicTitle}
                    </Text>
                    <Text style={[styles.stateEnglish, isSelected && styles.stateEnglishActive]}>
                      • {option.englishMeaning}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Guided Journaling Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Journal & Gratitude</Text>

          <TextInput
            style={styles.journalInput}
            multiline
            placeholder="Reflect on your intentions, blessings, and deeds today..."
            placeholderTextColor={THEME.colors.textLight}
            value={content}
            onChangeText={updateReflection}
          />
        </View>

        {/* 4. Sayyid al-Istighfar Sunnah Before Sleep Card */}
        <SleepSunnahRemembranceCard />
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

  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateNavBtn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.bgCard,
    borderWidth: 1,
    borderColor: '#ECEAE6',
  },
  dateNavBtnDisabled: {
    opacity: 0.3,
  },
  dateNavBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  dateNavBtnTextDisabled: {
    color: THEME.colors.textLight,
  },
  currentDateIndicator: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
  savedPill: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  headerSection: {
    marginBottom: 24,
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
    marginBottom: 16,
  },
  sectionSub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 18,
    marginBottom: 16,
  },
  stateList: {
    gap: 8,
  },
  stateItem: {
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  stateItemActive: {
    backgroundColor: '#F3F9F5',
    borderColor: '#D7EFE2',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
  stateTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
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
    fontSize: 13,
    color: THEME.colors.textMuted,
    fontWeight: '500',
  },
  stateEnglishActive: {
    color: THEME.colors.primary,
    fontWeight: '600',
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

