import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTrackerStore } from '../store/useTrackerStore';
import { useSettingsStore } from '../../settings/store/useSettingsStore';
import { THEME } from '../../../core/constants/theme';
import { formatHeaderDates } from '../../../core/utils/date';

interface HeaderProps {
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const selectedDate = useTrackerStore((state) => state.selectedDate);
  const hijriOffsetDays = useSettingsStore((state) => state.settings.hijriOffsetDays);
  const { gregorian, hijri } = formatHeaderDates(selectedDate, hijriOffsetDays);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.dateLabel}>{gregorian.toUpperCase()} • {hijri.toUpperCase()}</Text>
        {onOpenSettings && (
          <TouchableOpacity onPress={onOpenSettings} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.settingsBtnText}>Settings</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>
        Grow your soul in <Text style={styles.italicAccent}>devotion.</Text>
      </Text>
      <Text style={styles.subtitle}>
        Every small deed today builds your steadfastness and peace.
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    letterSpacing: 1.2,
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
