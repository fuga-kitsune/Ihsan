import { useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNavBar, ScreenTab } from '../core/components/BottomNavBar';
import { THEME } from '../core/constants/theme';
import { AnalyticsScreen } from '../features/analytics/screens/AnalyticsScreen';
import { FocusHubScreen } from '../features/niyyah/screens/FocusHubScreen';
import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { MuhasabahScreen } from '../features/reflection/screens/MuhasabahScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { useSettingsStore } from '../features/settings/store/useSettingsStore';
import { SplashScreenView } from '../features/splash/components/SplashScreenView';
import { TrackerScreen } from '../features/tracker/screens/TrackerScreen';

export default function RootApp() {
  const insets = useSafeAreaInsets();
  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<'tracker' | 'muhasabah' | 'settings' | 'analytics' | 'focus'>('tracker');
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

  const isMainTab = currentScreen !== 'settings';

  return (
    <View style={[styles.canvas, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.bgCanvas} />
      <View style={styles.mainContent}>
        {currentScreen === 'tracker' && (
          <TrackerScreen
            onNavigateToMuhasabah={() => setCurrentScreen('muhasabah')}
            onOpenSettings={() => setCurrentScreen('settings')}
            onOpenAnalytics={() => setCurrentScreen('analytics')}
            onOpenDuas={() => setCurrentScreen('focus')}
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
        {currentScreen === 'focus' && (
          <FocusHubScreen />
        )}
      </View>
      {isMainTab && (
        <BottomNavBar
          currentTab={currentScreen as ScreenTab}
          onSelectTab={(tab) => setCurrentScreen(tab)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: THEME.colors.bgCanvas,
  },
  mainContent: {
    flex: 1,
  },
});

