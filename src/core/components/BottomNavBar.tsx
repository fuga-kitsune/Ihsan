import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { StreamlineDeedsIcon } from './StreamlineDeedsIcon';
import { StreamlineTargetIcon } from './StreamlineTargetIcon';
import { StreamlineChartIcon } from './StreamlineChartIcon';
import { StreamlineMoonIcon } from './StreamlineMoonIcon';

export type ScreenTab = 'tracker' | 'focus' | 'analytics' | 'muhasabah';

interface BottomNavBarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onSelectTab }) => {
  const insets = useSafeAreaInsets();

  const renderIcon = (id: ScreenTab, isActive: boolean) => {
    switch (id) {
      case 'tracker':
        return <StreamlineDeedsIcon size={24} focused={isActive} />;
      case 'focus':
        return <StreamlineTargetIcon size={24} focused={isActive} />;
      case 'analytics':
        return <StreamlineChartIcon size={24} focused={isActive} />;
      case 'muhasabah':
        return <StreamlineMoonIcon size={24} focused={isActive} />;
      default:
        return null;
    }
  };

  const tabs: {
    id: ScreenTab;
    label: string;
  }[] = [
    {
      id: 'tracker',
      label: 'Deeds',
    },
    {
      id: 'focus',
      label: 'Focus',
    },
    {
      id: 'analytics',
      label: 'Journey',
    },
    {
      id: 'muhasabah',
      label: 'Muhasabah',
    },
  ];

  return (
    <View
      style={[
        styles.navContainer,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.navInner}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                {renderIcon(tab.id, isActive)}
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    backgroundColor: THEME.colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: '#ECEAE8',
    paddingTop: 8,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  navInner: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  iconWrapper: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    letterSpacing: -0.1,
  },
  activeTabLabel: {
    color: THEME.colors.textHeading,
    fontWeight: '700',
  },
});

