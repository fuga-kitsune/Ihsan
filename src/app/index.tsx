import { useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../core/constants/theme';
import { AnalyticsScreen } from '../features/analytics/screens/AnalyticsScreen';
import { DuaLibraryScreen } from '../features/duas/screens/DuaLibraryScreen';
import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { MuhasabahScreen } from '../features/reflection/screens/MuhasabahScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { useSettingsStore } from '../features/settings/store/useSettingsStore';
import { SplashScreenView } from '../features/splash/components/SplashScreenView';
import { TrackerScreen } from '../features/tracker/screens/TrackerScreen';

export default function RootApp() {
  const insets = useSafeAreaInsets();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'tracker' | 'muhasabah' | 'settings' | 'analytics' | 'duas'>('tracker');
  const lastBackPressRef = useRef<number>(0);
  const settings = useSettingsStore((state) => state.settings);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      // 1. If on any sub-screen, single back returns to Tracker
      if (currentScreen !== 'tracker') {
        setCurrentScreen('tracker');
        return true;
      }

      // 2. If on root TrackerScreen, double-back tap exits
      const now = Date.now();
      if (now - lastBackPressRef.current < 2000) {
        BackHandler.exitApp();
        return true;
      }

      lastBackPressRef.current = now;
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      }
      return true;
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSubscription.remove();
  }, [currentScreen]);

  // Show animated in-app Splash on launch
  if (showSplash) {
    return <SplashScreenView onFinish={() => setShowSplash(false)} />;
  }

  // Show serene Onboarding flow if new user
  if (!settings.hasCompletedOnboarding) {
    return <OnboardingScreen onFinish={() => setCurrentScreen('tracker')} />;
  }

  return (
    <View style={[styles.canvas, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.bgCanvas} />
      {currentScreen === 'tracker' && (
        <TrackerScreen
          onNavigateToMuhasabah={() => setCurrentScreen('muhasabah')}
          onOpenSettings={() => setCurrentScreen('settings')}
          onOpenAnalytics={() => setCurrentScreen('analytics')}
          onOpenDuas={() => setCurrentScreen('duas')}
        />
      )}
      {currentScreen === 'muhasabah' && (
        <MuhasabahScreen onBack={() => setCurrentScreen('tracker')} />
      )}
      {currentScreen === 'settings' && (
        <SettingsScreen onBack={() => setCurrentScreen('tracker')} />
      )}
      {currentScreen === 'analytics' && (
        <AnalyticsScreen onBack={() => setCurrentScreen('tracker')} />
      )}
      {currentScreen === 'duas' && (
        <DuaLibraryScreen onBack={() => setCurrentScreen('tracker')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: THEME.colors.bgCanvas,
  },
});

