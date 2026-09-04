import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { THEME } from '../../../core/constants/theme';

interface NiyyahFulfillConfirmModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const NiyyahFulfillConfirmModal: React.FC<NiyyahFulfillConfirmModalProps> = ({
  visible,
  title,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.tag}>ALHAMDULILLAH</Text>
          <Text style={styles.title}>Fulfill This Niyyah?</Text>
          <Text style={styles.description}>
            Have you completed your spiritual intention:
          </Text>
          <Text style={styles.intentionText}>"{title}"</Text>
          <Text style={styles.subtext}>
            Once marked as fulfilled, it will be sealed in your Spiritual Journey history and you can set your next intention!
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelText}>Still In Progress</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.8}>
              <Text style={styles.confirmText}>Yes, Fulfilled ✓</Text>
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
    color: THEME.colors.accentGold,
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
  intentionText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.primary,
    fontFamily: THEME.fonts.serif,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 12,
    color: THEME.colors.textLight,
    lineHeight: 17,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
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
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  confirmBtn: {
    flex: 1.2,
    paddingVertical: 13,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
