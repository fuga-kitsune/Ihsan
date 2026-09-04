import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { NiyyahTimeframe } from '../models/niyyah.model';
import { useNiyyahStore } from '../store/useNiyyahStore';
import { THEME } from '../../../core/constants/theme';

interface SetNiyyahModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SetNiyyahModal: React.FC<SetNiyyahModalProps> = ({ visible, onClose }) => {
  const setNiyyah = useNiyyahStore((state) => state.setNiyyah);
  const [title, setTitle] = useState('');
  const [timeframe, setTimeframe] = useState<NiyyahTimeframe>('weekly');

  const INSPIRING_INTENTIONS = [
    'Complete Surah Al-Mulk every night before sleep',
    'Pray all 12 Sunnah Rawatib prayers this week',
    'Fast Mondays and Thursdays (Sunnah devotion)',
    'Recite 100x Istighfar daily with presence of heart',
    'Give a quiet act of Sadaqah every Friday',
    'Wake up 15 minutes before Fajr for 2 Rak\'ah Tahajjud',
  ];

  const handleSave = async (intentionText?: string) => {
    const textToSave = intentionText || title;
    if (!textToSave.trim()) return;

    await setNiyyah(textToSave.trim(), timeframe);
    setTitle('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.tag}>SPIRITUAL FOCUS</Text>
              <Text style={styles.title}>Set Your Niyyah</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Timeframe Selector */}
            <Text style={styles.label}>TIMEFRAME</Text>
            <View style={styles.timeframeRow}>
              <TouchableOpacity
                style={[styles.timeframePill, timeframe === 'weekly' && styles.timeframePillActive]}
                onPress={() => setTimeframe('weekly')}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeframeText, timeframe === 'weekly' && styles.timeframeTextActive]}>
                  Weekly Focus
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.timeframePill, timeframe === 'monthly' && styles.timeframePillActive]}
                onPress={() => setTimeframe('monthly')}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeframeText, timeframe === 'monthly' && styles.timeframeTextActive]}>
                  Monthly Intention
                </Text>
              </TouchableOpacity>
            </View>

            {/* Custom Input */}
            <Text style={styles.label}>YOUR INTENTION</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read 1 page of Quran after Fajr every day..."
              placeholderTextColor={THEME.colors.textLight}
              value={title}
              onChangeText={setTitle}
            />

            {title.trim().length > 0 && (
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => handleSave()}
                activeOpacity={0.8}
              >
                <Text style={styles.saveBtnText}>Save Custom Niyyah</Text>
              </TouchableOpacity>
            )}

            {/* Inspiring Ideas */}
            <Text style={[styles.label, { marginTop: 16 }]}>OR CHOOSE AN INSPIRING FOCUS</Text>
            <View style={styles.ideaList}>
              {INSPIRING_INTENTIONS.map((idea) => (
                <TouchableOpacity
                  key={idea}
                  style={styles.ideaCard}
                  onPress={() => handleSave(idea)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.ideaText}>🌿 {idea}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
  timeframeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  timeframePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeframePillActive: {
    backgroundColor: THEME.colors.primary,
  },
  timeframeText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: 16,
    color: THEME.colors.textHeading,
    fontSize: 14,
    marginBottom: 10,
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
    paddingBottom: 24,
  },
  ideaCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: 16,
  },
  ideaText: {
    fontSize: 13,
    color: THEME.colors.textBody,
    lineHeight: 18,
    fontWeight: '500',
  },
});
