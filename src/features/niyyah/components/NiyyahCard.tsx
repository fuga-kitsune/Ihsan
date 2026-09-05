import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNiyyahStore } from '../store/useNiyyahStore';
import { SetNiyyahModal } from './SetNiyyahModal';
import { NiyyahFulfillConfirmModal } from './NiyyahFulfillConfirmModal';
import { THEME } from '../../../core/constants/theme';

export const NiyyahCard: React.FC = () => {
  const activeNiyyah = useNiyyahStore((state) => state.activeNiyyah);
  const loadActiveNiyyah = useNiyyahStore((state) => state.loadActiveNiyyah);
  const toggleComplete = useNiyyahStore((state) => state.toggleComplete);

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    loadActiveNiyyah();
  }, []);

  const handleStatusPress = () => {
    if (!activeNiyyah) return;
    if (activeNiyyah.isCompleted) {
      // If already fulfilled, clicking opens Set Modal for the next intention
      setModalVisible(true);
    } else {
      // Ask for confirmation before fulfilling
      setConfirmModalVisible(true);
    }
  };

  const handleConfirmFulfill = async () => {
    setConfirmModalVisible(false);
    await toggleComplete();
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.tag}>
          {activeNiyyah ? `${activeNiyyah.timeframe.toUpperCase()} NIYYAH` : 'SPIRITUAL FOCUS'}
        </Text>

        <TouchableOpacity onPress={() => setModalVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.changeText}>
            {!activeNiyyah ? '+ Set Niyyah' : activeNiyyah.isCompleted ? '+ New Niyyah' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {activeNiyyah ? (
        <View style={styles.contentCol}>
          <Text style={[styles.title, activeNiyyah.isCompleted && styles.titleCompleted]}>
            "{activeNiyyah.title}"
          </Text>

          <TouchableOpacity
            style={[styles.statusBtn, activeNiyyah.isCompleted && styles.statusBtnCompleted]}
            onPress={handleStatusPress}
            activeOpacity={0.7}
          >
            <Text style={[styles.statusText, activeNiyyah.isCompleted && styles.statusTextCompleted]}>
              {activeNiyyah.isCompleted ? '✓ Fulfilled • Tap for Next Niyyah' : '○ Mark as Fulfilled'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.emptyPrompt} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
          <Text style={styles.emptyTitle}>Set a Weekly or Monthly Intention</Text>
          <Text style={styles.emptySub}>
            Direct your heart toward a specific goal (e.g. Surah Al-Mulk, Sunnah prayers, Sadaqah).
          </Text>
        </TouchableOpacity>
      )}

      <SetNiyyahModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {activeNiyyah && (
        <NiyyahFulfillConfirmModal
          visible={confirmModalVisible}
          title={activeNiyyah.title}
          onClose={() => setConfirmModalVisible(false)}
          onConfirm={handleConfirmFulfill}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF5EF',
    borderRadius: THEME.radius.lg,
    padding: 20,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#EFE8DE',
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  contentCol: {
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: THEME.colors.textHeading,
    lineHeight: 24,
    fontFamily: THEME.fonts.serif,
  },
  titleCompleted: {
    color: THEME.colors.primary,
    textDecorationLine: 'line-through',
  },
  statusBtn: {
    backgroundColor: THEME.colors.bgCard,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    alignSelf: 'flex-start',
  },
  statusBtnCompleted: {
    backgroundColor: THEME.colors.bgCardActive,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  statusTextCompleted: {
    color: THEME.colors.primary,
  },
  emptyPrompt: {
    gap: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textHeading,
  },
  emptySub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    lineHeight: 18,
  },
});
