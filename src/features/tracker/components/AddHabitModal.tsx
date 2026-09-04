import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useTrackerStore } from '../store/useTrackerStore';
import { HabitCategory } from '../models/habit.model';
import { THEME } from '../../../core/constants/theme';

interface AddHabitModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ visible, onClose }) => {
  const addHabit = useTrackerStore((state) => state.addHabit);

  const [name, setName] = useState('');
  const [benefit, setBenefit] = useState('');
  const [category, setCategory] = useState<HabitCategory>('deeds');

  const categories: { id: HabitCategory; label: string }[] = [
    { id: 'prayers', label: 'Prayers' },
    { id: 'quran', label: 'Quran' },
    { id: 'dhikr', label: 'Dhikr' },
    { id: 'deeds', label: 'Good Deeds' },
  ];

  const handleSave = async () => {
    if (!name.trim()) return;
    await addHabit({
      name: name.trim(),
      benefit: benefit.trim() || 'Spiritual Growth & Steadfastness',
      category,
    });
    setName('');
    setBenefit('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add a Spiritual Deed</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.catRow}>
              {categories.map((c) => {
                const isActive = category === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setCategory(c.id)}
                    style={[styles.catPill, isActive && styles.catPillActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.catPillText, isActive && styles.catPillTextActive]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>DEED / HABIT NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read Surah Al-Mulk before sleep"
              placeholderTextColor={THEME.colors.textLight}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>INTENTION / BENEFIT (OPTIONAL)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Protection in the grave & night peace"
              placeholderTextColor={THEME.colors.textLight}
              value={benefit}
              onChangeText={setBenefit}
            />

            <TouchableOpacity
              style={[styles.saveBtn, !name.trim() && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!name.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Save Deed</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: THEME.colors.bgCard,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
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
    marginTop: 12,
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  catPill: {
    backgroundColor: THEME.colors.bgPill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.full,
  },
  catPillActive: {
    backgroundColor: THEME.colors.bgPillActive,
  },
  catPillText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  catPillTextActive: {
    color: THEME.colors.textInverse,
    fontWeight: '600',
  },
  input: {
    backgroundColor: THEME.colors.bgCardSubtle,
    borderRadius: THEME.radius.md,
    padding: 14,
    color: THEME.colors.textHeading,
    fontSize: 14,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 16,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: THEME.colors.textInverse,
    fontSize: 15,
    fontWeight: '600',
  },
});
