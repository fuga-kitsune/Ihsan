import { Platform } from 'react-native';

export const THEME = {
  colors: {
    bgCanvas: '#FAFAF9',
    bgCard: '#FFFFFF',
    bgCardSubtle: '#F5F5F4',
    bgCardActive: '#F0FDF4',
    bgPill: '#F5F5F4',
    bgPillActive: '#1C1917',
    
    primary: '#1E3A2F',
    primarySoft: '#E6F4EA',
    accentRose: '#C25E6B',
    accentGold: '#B45309',
    
    textHeading: '#1C1917',
    textBody: '#44403C',
    textMuted: '#78716C',
    textLight: '#A8A29E',
    textInverse: '#FFFFFF',
  },
  fonts: {
    serif: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    sans: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 24,
    full: 9999,
  }
};
