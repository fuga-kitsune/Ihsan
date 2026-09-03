import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert, Share, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '../store/useSettingsStore';
import { reflectionRepository } from '../../reflection/repositories/reflection.repository';
import { useTrackerStore } from '../../tracker/store/useTrackerStore';
import { useReflectionStore } from '../../reflection/store/useReflectionStore';
import { ResetConfirmModal } from '../components/ResetConfirmModal';
import { THEME } from '../../../core/constants/theme';
import { formatHeaderDates } from '../../../core/utils/date';


interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore((state) => state.settings);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const setHijriOffset = useSettingsStore((state) => state.setHijriOffset);
  const toggleEveningReminder = useSettingsStore((state) => state.toggleEveningReminder);
  const toggleMorningReminder = useSettingsStore((state) => state.toggleMorningReminder);
  const toggleFridayReminder = useSettingsStore((state) => state.toggleFridayReminder);
  const wipeAllData = useSettingsStore((state) => state.wipeAllData);

  const loadHabits = useTrackerStore((state) => state.loadHabits);
  const loadReflection = useReflectionStore((state) => state.loadReflection);

  const [statsSummary, setStatsSummary] = useState({ totalDays: 0, totalReflections: 0 });
  const [resetModalVisible, setResetModalVisible] = useState(false);

  useEffect(() => {
    loadSettings();
    reflectionRepository.getHistoryArchive().then((history) => {
      const withRef = history.filter((h) => h.reflectionContent.trim().length > 0).length;
      setStatsSummary({ totalDays: history.length, totalReflections: withRef });
    });
  }, []);

  const hijriOptions = [-2, -1, 0, 1, 2];
  const { hijri } = formatHeaderDates(undefined, settings.hijriOffsetDays);

  const handleExportData = async () => {
    const history = await reflectionRepository.getHistoryArchive();
    if (history.length === 0) {
      Alert.alert('No Data', 'You do not have any logged entries yet.');
      return;
    }

    let textExport = '=== MUHASABAH SPIRITUAL JOURNAL EXPORT ===\n\n';
    history.forEach((record) => {
      textExport += `📅 Date: ${record.dateKey}\n`;
      textExport += `✨ Deeds Completed: ${record.completedTasksCount}/${record.totalTasksCount}\n`;
      textExport += `🌿 Heart State: ${record.heartState || 'Not recorded'}\n`;
      if (record.reflectionContent) {
        textExport += `📝 Evening Reflection:\n"${record.reflectionContent.trim()}"\n`;
      }
      textExport += '-------------------------------------------\n\n';
    });

    try {
      await Share.share({
        title: 'Muhasabah Spiritual Journal Backup',
        message: textExport,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmReset = async () => {
    setResetModalVisible(false);
    await wipeAllData();
    await loadHabits();
    await loadReflection();
    setStatsSummary({ totalDays: 0, totalReflections: 0 });
    onBack();
  };


  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: Math.max(insets.bottom + 40, 60) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>
          Preferences & <Text style={styles.italicAccent}>Routine.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Customize your spiritual reminders, calibrate calendar dates, and manage your local journal data.
        </Text>
      </View>

      {/* Hijri Calibration Section */}
      <View style={styles.card}>
        <Text style={styles.cardTag}>CALENDAR ALIGNMENT</Text>
        <Text style={styles.cardTitle}>Hijri Date Calibration</Text>
        <Text style={styles.cardSub}>
          Current Display: <Text style={styles.highlightText}>{hijri}</Text>
        </Text>

        <View style={styles.offsetRow}>
          {hijriOptions.map((offset) => {
            const isSelected = settings.hijriOffsetDays === offset;
            const label = offset === 0 ? 'Exact' : offset > 0 ? `+${offset}d` : `${offset}d`;

            return (
              <TouchableOpacity
                key={offset}
                style={[styles.offsetPill, isSelected && styles.offsetPillActive]}
                onPress={() => setHijriOffset(offset)}
                activeOpacity={0.7}
              >
                <Text style={[styles.offsetText, isSelected && styles.offsetTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.card}>
        <Text style={styles.cardTag}>SPIRITUAL REMINDERS</Text>
        <Text style={styles.cardTitle}>Daily Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Evening Muhasabah</Text>
            <Text style={styles.settingSub}>9:30 PM reminder before sleep</Text>
          </View>
          <Switch
            value={settings.eveningReminderEnabled}
            onValueChange={toggleEveningReminder}
            trackColor={{ false: THEME.colors.bgCardSubtle, true: THEME.colors.primary }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Morning Remembrance</Text>
            <Text style={styles.settingSub}>6:30 AM morning Adhkar reminder</Text>
          </View>
          <Switch
            value={settings.morningReminderEnabled}
            onValueChange={toggleMorningReminder}
            trackColor={{ false: THEME.colors.bgCardSubtle, true: THEME.colors.primary }}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Friday Surah Al-Kahf</Text>
            <Text style={styles.settingSub}>Weekly Friday morning reminder</Text>
          </View>
          <Switch
            value={settings.fridayReminderEnabled}
            onValueChange={toggleFridayReminder}
            trackColor={{ false: THEME.colors.bgCardSubtle, true: THEME.colors.primary }}
          />
        </View>
      </View>

      {/* Data Backup & Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTag}>DATA & PRIVACY</Text>
        <Text style={styles.cardTitle}>Journal Backup</Text>
        <Text style={styles.cardSub}>
          {statsSummary.totalDays} days recorded • {statsSummary.totalReflections} written reflections
        </Text>

        <TouchableOpacity style={styles.actionBtn} onPress={handleExportData} activeOpacity={0.8}>
          <Text style={styles.actionBtnText}>Export / Share Journal Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerBtn} onPress={() => setResetModalVisible(true)} activeOpacity={0.8}>
          <Text style={styles.dangerBtnText}>Reset Local Data</Text>
        </TouchableOpacity>
      </View>

      <ResetConfirmModal
        visible={resetModalVisible}
        onClose={() => setResetModalVisible(false)}
        onConfirm={handleConfirmReset}
      />
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.bgPill,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.textHeading,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontFamily: THEME.fonts.serif,
    fontSize: 32,
    lineHeight: 38,
    color: THEME.colors.textHeading,
    fontWeight: '400',
    marginBottom: 8,
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
  },
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: 22,
    marginBottom: 20,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.accentGold,
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    marginBottom: 16,
  },
  highlightText: {
    color: THEME.colors.primary,
    fontWeight: '600',
  },
  offsetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  offsetPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.bgCardSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offsetPillActive: {
    backgroundColor: THEME.colors.primary,
  },
  offsetText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textBody,
  },
  offsetTextActive: {
    color: '#FFFFFF',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.colors.textHeading,
    marginBottom: 2,
  },
  settingSub: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.bgCardSubtle,
    marginVertical: 4,
  },
  actionBtn: {
    backgroundColor: THEME.colors.bgCardSubtle,
    paddingVertical: 14,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionBtnText: {
    color: THEME.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  dangerBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerBtnText: {
    color: THEME.colors.accentRose,
    fontSize: 13,
    fontWeight: '500',
  },
});
