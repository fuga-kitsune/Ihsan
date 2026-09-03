import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { HabitItemUIModel } from '../models/habit.model';
import { useTrackerStore } from '../store/useTrackerStore';
import { THEME } from '../../../core/constants/theme';

interface DeleteHabitModalProps {
  habit: HabitItemUIModel | null;
  onClose: () => void;
}

export const DeleteHabitModal: React.FC<DeleteHabitModalProps> = ({ habit, onClose }) => {
  const deleteHabit = useTrackerStore((state) => state.deleteHabit);

  if (!habit) return null;

  const handleDelete = async () => {
    await deleteHabit(habit.id);
    onClose();
  };

  return (
    <Modal visible={!!habit} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.tag}>REMOVE DEED</Text>
          <Text style={styles.title}>Remove this deed?</Text>
          <Text style={styles.description}>
            "<Text style={styles.habitName}>{habit.name}</Text>" will be removed from your daily routine. Past completion history for this deed will also be cleared.
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Keep Deed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 24,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentRose,
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: THEME.colors.textMuted,
    lineHeight: 20,
    marginBottom: 24,
  },
  habitName: {
    color: THEME.colors.textHeading,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.bgCardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.accentRose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
