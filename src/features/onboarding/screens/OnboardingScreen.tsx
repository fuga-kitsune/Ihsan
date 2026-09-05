import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSettingsStore } from '../../settings/store/useSettingsStore';
import { useNiyyahStore } from '../../niyyah/store/useNiyyahStore';
import { THEME } from '../../../core/constants/theme';

import { APP_CONFIG } from '../../../core/constants/app';

interface OnboardingScreenProps {
  onFinish: () => void;
}


export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useSettingsStore((state) => state.completeOnboarding);
  const setNiyyah = useNiyyahStore((state) => state.setNiyyah);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // User selections
  const [selectedFocus, setSelectedFocus] = useState<string>('prayers');
  const [selectedPace, setSelectedPace] = useState<string>('steadfast');
  const [selectedNiyyah, setSelectedNiyyah] = useState<string>('Complete Surah Al-Mulk every night before sleep');

  const FOCUS_OPTIONS = [
    {
      id: 'prayers',
      icon: '🕌',
      title: 'Consistency in 5 Daily Prayers',
      desc: 'Anchor your day in peace and steadfast devotion upon the sunnah.',
      defaultNiyyah: 'Pray all 12 Sunnah Rawatib prayers this week',
    },
    {
      id: 'quran',
      icon: '📖',
      title: 'Connecting Deeply with Quran',
      desc: 'Cultivate a daily routine of reciting and reflecting on Allah’s words.',
      defaultNiyyah: 'Complete Surah Al-Mulk every night before sleep',
    },
    {
      id: 'purification',
      icon: '🤲',
      title: 'Heart Purification & Peace',
      desc: 'Release anxiety, engage in istighfar, and build tranquil tawakkul.',
      defaultNiyyah: 'Recite 100x Istighfar daily with presence of heart',
    },
    {
      id: 'rekindle',
      icon: '🌿',
      title: 'Rekindling Faith & Overcoming Burnout',
      desc: 'Gentle, consistent spiritual habits that make devotion easy and joyful.',
      defaultNiyyah: 'Give a quiet act of Sadaqah every Friday',
    },
  ];

  const PACE_OPTIONS = [
    {
      id: 'gentle',
      tag: 'GENTLE START',
      title: '3 to 5 Core Deeds Daily',
      desc: 'Prioritizing essential fard prayers, morning gratitude, and simple istighfar.',
    },
    {
      id: 'steadfast',
      tag: 'STEADFAST RHYTHM',
      title: '6 to 8 Devotion Deeds Daily',
      desc: 'Includes sunnah prayers, daily Quran recitation, and evening muhasabah.',
    },
    {
      id: 'aspiration',
      tag: 'HIGH ASPIRATION',
      title: '10+ Complete Devotion Routine',
      desc: 'Tahajjud, full morning & evening adhkar, deep contemplation, and fasting.',
    },
  ];

  const handleFocusSelect = (id: string, defaultNiyyah: string) => {
    setSelectedFocus(id);
    setSelectedNiyyah(defaultNiyyah);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await setNiyyah(selectedNiyyah, 'weekly');
    await completeOnboarding();
    onFinish();
  };

  return (
    <View style={[styles.canvas, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom + 20, 40) }]}>
      {/* Progress Dots */}
      <View style={styles.topProgressRow}>
        <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
        <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
        <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* STEP 1: Intentions */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.tag}>WELCOME TO {APP_CONFIG.name.toUpperCase()}</Text>
            <Text style={styles.title}>
              What is your primary <Text style={styles.italicAccent}>focus?</Text>
            </Text>
            <Text style={styles.subtitle}>
              "Actions are judged by intentions." Select what your soul needs most right now.
            </Text>


            <View style={styles.optionsList}>
              {FOCUS_OPTIONS.map((item) => {
                const isSelected = selectedFocus === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.cardOption, isSelected && styles.cardOptionSelected]}
                    onPress={() => handleFocusSelect(item.id, item.defaultNiyyah)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionHeader}>
                      <Text style={styles.optionIcon}>{item.icon}</Text>
                      <View style={styles.optionTextCol}>
                        <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                          {item.title}
                        </Text>
                        <Text style={styles.optionDesc}>{item.desc}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 2: Devotion Pace */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.tag}>DEVOTION RHYTHM</Text>
            <Text style={styles.title}>
              Choose your <Text style={styles.italicAccent}>pace.</Text>
            </Text>
            <Text style={styles.subtitle}>
              "The most beloved deeds to Allah are those that are most consistent, even if small."
            </Text>

            <View style={styles.optionsList}>
              {PACE_OPTIONS.map((item) => {
                const isSelected = selectedPace === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.cardOption, isSelected && styles.cardOptionSelected]}
                    onPress={() => setSelectedPace(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.paceTag}>{item.tag}</Text>
                    <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                      {item.title}
                    </Text>
                    <Text style={styles.optionDesc}>{item.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 3: Starting Niyyah */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.tag}>SACRED INTENTION</Text>
            <Text style={styles.title}>
              Your starting <Text style={styles.italicAccent}>Niyyah.</Text>
            </Text>
            <Text style={styles.subtitle}>
              We have prepared your starting weekly spiritual focus:
            </Text>

            <View style={styles.niyyahParchment}>
              <Text style={styles.niyyahTag}>FIRST WEEKLY GOAL</Text>
              <Text style={styles.niyyahQuote}>"{selectedNiyyah}"</Text>
              <Text style={styles.niyyahNote}>
                You can change this or track your fulfillment anytime from your dashboard.
              </Text>
            </View>

            <View style={styles.quoteBox}>
              <Text style={styles.hadithArabic}>إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ</Text>
              <Text style={styles.hadithText}>"Indeed, actions are according to intentions." — Prophet Muhammad ﷺ</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Continue Button */}
      <View style={styles.bottomBar}>
        {step > 1 && (
          <TouchableOpacity style={styles.prevBtn} onPress={() => setStep((s) => (s - 1) as (1 | 2 | 3))} activeOpacity={0.7}>
            <Text style={styles.prevBtnText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.continueBtn} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.continueBtnText}>
            {step === 3 ? 'Begin My Spiritual Journey →' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: THEME.colors.bgCanvas,
  },
  topProgressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  progressDot: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.bgCardSubtle,
  },
  progressDotActive: {
    backgroundColor: THEME.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  stepContainer: {
    gap: 10,
  },
  logoRow: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  logoImage: {
    width: 120,
    height: 75,
  },
  tag: {

    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
  },

  title: {
    fontFamily: THEME.fonts.serif,
    fontSize: 34,
    lineHeight: 40,
    color: THEME.colors.textHeading,
    fontWeight: '400',
    letterSpacing: -0.5,
  },
  italicAccent: {
    fontFamily: THEME.fonts.serif,
    fontStyle: 'italic',
    color: THEME.colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textMuted,
    lineHeight: 21,
    marginBottom: 16,
  },
  optionsList: {
    gap: 12,
  },
  cardOption: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 18,
    gap: 6,
  },
  cardOptionSelected: {
    backgroundColor: THEME.colors.bgCardActive,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  optionIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  optionTextCol: {
    flex: 1,
    gap: 4,
  },
  paceTag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 0.8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.2,
  },
  optionTitleSelected: {
    color: THEME.colors.primary,
  },
  optionDesc: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 18,
  },
  niyyahParchment: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 22,
    gap: 10,
    marginTop: 8,
  },
  niyyahTag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
  },
  niyyahQuote: {
    fontSize: 18,
    fontFamily: THEME.fonts.serif,
    color: THEME.colors.textHeading,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  niyyahNote: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    lineHeight: 17,
  },
  quoteBox: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  hadithArabic: {
    fontSize: 18,
    color: THEME.colors.textHeading,
    fontFamily: THEME.fonts.serif,
  },
  hadithText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  prevBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.bgCardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  continueBtn: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
