import React from 'react';
import { ThemedConfirmModal } from '../../../core/components/ThemedConfirmModal';
import { THEME } from '../../../core/constants/theme';

interface ResetConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ visible, onClose, onConfirm }) => {
  return (
    <ThemedConfirmModal
      visible={visible}
      tag="START AFRESH"
      tagColor={THEME.colors.accentRose}
      title="Reset All Local Logs?"
      description="This will permanently clear your completed checkmarks, spiritual mood check-ins, and written evening reflections. Habit templates will be preserved so you can start with a fresh intention."
      confirmText="Reset Everything"
      cancelText="Keep Data"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
};
