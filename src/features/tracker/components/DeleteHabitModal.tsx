import React from 'react';
import { HabitItemUIModel } from '../models/habit.model';
import { useTrackerStore } from '../store/useTrackerStore';
import { ThemedConfirmModal } from '../../../core/components/ThemedConfirmModal';
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
    <ThemedConfirmModal
      visible={!!habit}
      tag="REMOVE DEED"
      tagColor={THEME.colors.accentRose}
      title="Remove this deed?"
      description={`"${habit.name}" will be removed from your daily routine. Past completion history for this deed will also be cleared.`}
      confirmText="Remove"
      cancelText="Keep Deed"
      confirmVariant="danger"
      onConfirm={handleDelete}
      onCancel={onClose}
    />
  );
};
