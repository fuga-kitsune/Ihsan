import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

interface ConfirmModalProps {
  visible: boolean;
  tag?: string;
  tagColor?: string;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'gold';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ThemedConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  tag = 'CONFIRMATION',
  tagColor = THEME.colors.accentRose,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  const getConfirmBtnStyle = () => {
    switch (confirmVariant) {
      case 'danger':
        return styles.confirmBtnDanger;
      case 'gold':
        return styles.confirmBtnGold;
      case 'primary':
      default:
        return styles.confirmBtnPrimary;
    }
  };

  const getConfirmTextStyle = () => {
    switch (confirmVariant) {
      case 'gold':
        return styles.confirmTextGold;
      default:
        return styles.confirmTextWhite;
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {tag ? <Text style={[styles.tag, { color: tagColor }]}>{tag}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, getConfirmBtnStyle()]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={[styles.confirmText, getConfirmTextStyle()]}>{confirmText}</Text>
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
  confirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnPrimary: {
    backgroundColor: THEME.colors.primary,
  },
  confirmBtnDanger: {
    backgroundColor: THEME.colors.accentRose,
  },
  confirmBtnGold: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmTextWhite: {
    color: '#FFFFFF',
  },
  confirmTextGold: {
    color: '#B45309',
  },
});
