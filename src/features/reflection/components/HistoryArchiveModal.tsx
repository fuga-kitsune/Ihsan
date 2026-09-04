import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reflectionRepository, DailyHistoryRecord } from '../repositories/reflection.repository';
import { THEME } from '../../../core/constants/theme';
import { formatHeaderDates } from '../../../core/utils/date';

interface HistoryArchiveModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (dateKey: string) => void;
}

export const HistoryArchiveModal: React.FC<HistoryArchiveModalProps> = ({
  visible,
  onClose,
  onSelectDate,
}) => {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<DailyHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      reflectionRepository
        .getHistoryArchive()
        .then((records) => {
          setHistory(records);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [visible]);

  const getHeartStateLabel = (state: string) => {
    switch (state) {
      case 'shukr':
        return 'Alhamdulillah (Shukr)';
      case 'tawakkul':
        return 'Tawakkul (Trusting Allah)';
      case 'himmah':
        return 'Himmah (High Energy)';
      case 'sabr':
        return 'Sabr (Patience)';
      case 'istighfar':
        return 'Astaghfirullah (Tawbah)';
      default:
        return '';
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (e.nativeEvent.contentOffset.y < -60) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.topDismissArea} />
        </TouchableWithoutFeedback>

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.header}>
            <View>
              <Text style={styles.tag}>SPIRITUAL ARCHIVE</Text>
              <Text style={styles.title}>Past Reflections & Deeds</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollContent}
          >
            {isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Opening spiritual logs...</Text>
              </View>
            ) : history.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No past history logged yet. Your journey begins today!
                </Text>
              </View>
            ) : (
              history.map((item) => {
                const { gregorian } = formatHeaderDates(item.dateKey);
                const hasReflection = item.reflectionContent && item.reflectionContent.trim().length > 0;
                const heartLabel = getHeartStateLabel(item.heartState);

                return (
                  <TouchableOpacity
                    key={item.dateKey}
                    style={styles.recordCard}
                    onPress={() => {
                      onSelectDate(item.dateKey);
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.recordHeader}>
                      <Text style={styles.recordDate}>{gregorian.toUpperCase()}</Text>
                      <View style={styles.taskBadge}>
                        <Text style={styles.taskBadgeText}>
                          {item.completedTasksCount}/{item.totalTasksCount} deeds
                        </Text>
                      </View>
                    </View>

                    {heartLabel ? (
                      <View style={styles.heartPill}>
                        <Text style={styles.heartPillText}>{heartLabel}</Text>
                      </View>
                    ) : null}

                    {hasReflection ? (
                      <Text style={styles.reflectionSnippet} numberOfLines={2}>
                        "{item.reflectionContent.trim()}"
                      </Text>
                    ) : (
                      <Text style={styles.noReflectionText}>No reflection written on this day.</Text>
                    )}

                    <Text style={styles.tapToView}>Tap to load day →</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 23, 0.45)',
    justifyContent: 'flex-end',
  },
  topDismissArea: {
    flex: 1,
    width: '100%',
  },
  sheet: {
    backgroundColor: THEME.colors.bgCanvas,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    height: '80%',
    width: '100%',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.bgCardSubtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  closeText: {
    fontSize: 18,
    color: THEME.colors.textMuted,
    fontWeight: '500',
    padding: 4,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 32,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  recordCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 18,
    gap: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordDate: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.textHeading,
    letterSpacing: 0.8,
  },
  taskBadge: {
    backgroundColor: THEME.colors.bgCardSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  taskBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.primary,
  },
  heartPill: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.bgCardSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  heartPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  reflectionSnippet: {
    fontSize: 13,
    color: THEME.colors.textBody,
    lineHeight: 19,
    fontFamily: THEME.fonts.serif,
    fontStyle: 'italic',
  },
  noReflectionText: {
    fontSize: 12,
    color: THEME.colors.textLight,
    fontStyle: 'italic',
  },
  tapToView: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginTop: 4,
  },
});
