import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { THEME } from '../../../core/constants/theme';

interface ResetConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.tag}>START AFRESH</Text>
          <Text style={styles.title}>Reset All Local Logs?</Text>
          <Text style={styles.description}>
            This will permanently clear your completed habit checkmarks, spiritual mood check-ins, and written evening reflections.
          </Text>
          <Text style={styles.subtext}>
            Your habit templates will be preserved so you can start with a fresh intention.
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Keep Data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteText}>Reset Everything</Text>
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
    marginBottom: 6,
  },
  subtext: {
    fontSize: 12,
    color: THEME.colors.textLight,
    lineHeight: 17,
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
  deleteBtn: {
    flex: 1.2,
    paddingVertical: 13,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.accentRose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
