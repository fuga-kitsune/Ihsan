import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export type ScreenTab = 'tracker' | 'duas' | 'analytics' | 'muhasabah';

interface BottomNavBarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onSelectTab }) => {
  const insets = useSafeAreaInsets();

  const tabs: {
    id: ScreenTab;
    label: string;
    iconActive: keyof typeof Ionicons.glyphMap;
    iconInactive: keyof typeof Ionicons.glyphMap;
    color: string;
  }[] = [
    {
      id: 'tracker',
      label: 'Deeds',
      iconActive: 'checkmark-circle',
      iconInactive: 'checkmark-circle-outline',
      color: '#0284C7', // Vivid Ocean Blue
    },
    {
      id: 'duas',
      label: "Du'as",
      iconActive: 'book',
      iconInactive: 'book-outline',
      color: '#0D9488', // Serene Teal / Turquoise
    },
    {
      id: 'analytics',
      label: 'Journey',
      iconActive: 'stats-chart',
      iconInactive: 'stats-chart-outline',
      color: '#1E3A2F', // Forest Pine
    },
    {
      id: 'muhasabah',
      label: 'Muhasabah',
      iconActive: 'moon',
      iconInactive: 'moon-outline',
      color: '#EAB308', // Warm Moon Yellow
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
          const iconName = isActive ? tab.iconActive : tab.iconInactive;
          const iconColor = isActive ? tab.color : THEME.colors.textLight;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={iconColor}
              />
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
    paddingVertical: 5,
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    letterSpacing: -0.1,
  },
  activeTabLabel: {
    color: THEME.colors.textHeading,
  },
});
