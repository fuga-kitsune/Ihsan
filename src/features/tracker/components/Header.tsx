import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTrackerStore } from '../store/useTrackerStore';
import { useReflectionStore } from '../../reflection/store/useReflectionStore';
import { useSettingsStore } from '../../settings/store/useSettingsStore';
import { THEME } from '../../../core/constants/theme';
import { formatHeaderDates, getTodayDateString, shiftDate } from '../../../core/utils/date';
import { StreamlineProfileIcon } from '../../../core/components/StreamlineProfileIcon';

interface HeaderProps {
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const selectedDate = useTrackerStore((state) => state.selectedDate);
  const setSelectedDate = useTrackerStore((state) => state.setSelectedDate);
  const loadReflection = useReflectionStore((state) => state.loadReflection);
  const hijriOffsetDays = useSettingsStore((state) => state.settings.hijriOffsetDays);

  const todayKey = getTodayDateString();
  const isToday = selectedDate === todayKey;
  const { gregorian, hijri } = formatHeaderDates(selectedDate, hijriOffsetDays);

  const handlePrevDay = async () => {
    const prevDate = shiftDate(selectedDate, -1);
    await setSelectedDate(prevDate);
    await loadReflection(prevDate);
  };

  const handleNextDay = async () => {
    if (isToday) return;
    const nextDate = shiftDate(selectedDate, 1);
    await setSelectedDate(nextDate);
    await loadReflection(nextDate);
  };

  const handleJumpToToday = async () => {
    await setSelectedDate(todayKey);
    await loadReflection(todayKey);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={handlePrevDay}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.6}
          >
            <Ionicons name="chevron-back" size={16} color={THEME.colors.textMuted} />
          </TouchableOpacity>

          <Text style={[styles.dateLabel, !isToday && styles.pastDateLabel]}>
            {gregorian.toUpperCase()} • {hijri.toUpperCase()}
          </Text>

          {!isToday && (
            <TouchableOpacity
              style={styles.arrowBtn}
              onPress={handleNextDay}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.6}
            >
              <Ionicons name="chevron-forward" size={16} color={THEME.colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {onOpenSettings && (
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={onOpenSettings}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <StreamlineProfileIcon size={22} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>
        Grow your soul in <Text style={styles.italicAccent}>devotion.</Text>
      </Text>
      {/* <Text style={styles.subtitle}>
        Every small deed today builds your steadfastness and peace.
      </Text> */}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arrowBtn: {
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnTodayPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
    marginLeft: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  returnTodayPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    letterSpacing: 0.8,
  },
  pastDateLabel: {
    color: '#92400E',
    fontWeight: '700',
  },
  profileBtn: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
  },

  title: {
    fontFamily: THEME.fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: THEME.colors.textHeading,
    fontWeight: '400',
    marginBottom: 6,
  },
  italicAccent: {
    fontFamily: THEME.fonts.serif,
    fontStyle: 'italic',
    color: THEME.colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textMuted,
    lineHeight: 20,
    fontWeight: '400',
  },
});
