import React, { useEffect, useRef } from 'react';
import { View, Image, Text, Animated, StyleSheet } from 'react-native';
import { THEME } from '../../../core/constants/theme';
import { APP_CONFIG } from '../../../core/constants/app';

interface SplashScreenViewProps {
  onFinish: () => void;
}

export const SplashScreenView: React.FC<SplashScreenViewProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pure clean fade in with no zoom
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // After 1.8 seconds, smoothly fade out and enter app
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require('../../../../assets/branding/ihsan_logo_transparent.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{APP_CONFIG.name}</Text>
        <Text style={styles.tagline}>{APP_CONFIG.tagline}</Text>
      </Animated.View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bgCanvas,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: THEME.fonts.serif,
    fontWeight: '400',
    color: THEME.colors.textHeading,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 13,
    color: THEME.colors.textMuted,
    letterSpacing: 0.5,
  },
});
