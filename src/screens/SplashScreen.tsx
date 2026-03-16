/**
 * SplashScreen.tsx
 *
 * Animated splash screen that checks for existing Sequence session.
 * Automatically navigates to Login or Home depending on session state.
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  ReduceMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSequenceAuth } from '../hooks/useSequenceAuth';
import { RootStackParamList } from '../types';
import { COLORS, SPACING } from '../config/constants';

const { width, height } = Dimensions.get('window');
type NavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export default function SplashScreen() {
  const navigation = useNavigation<NavProp>();
  const { checkSession } = useSequenceAuth();

  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: (1 - titleOpacity.value) * 20 }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  useEffect(() => {
    // Sequence: glow → logo → title → subtitle → check session
    glowOpacity.value = withTiming(0.6, { duration: 800, reduceMotion: ReduceMotion.System,  });

    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600, reduceMotion: ReduceMotion.System,  }));
    logoScale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 100 }));

    titleOpacity.value = withDelay(700, withTiming(1, { duration: 500, reduceMotion: ReduceMotion.System,  }));
    subtitleOpacity.value = withDelay(1000, withTiming(1, { duration: 500, reduceMotion: ReduceMotion.System,  }));

    // After animations, check for existing session
    const timer = setTimeout(async () => {
      const hasSession = await checkSession();
      if (!hasSession) {
        navigation.replace('Login');
      }
      // If session exists, AppNavigator handles routing to Home automatically
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.bgPrimary, '#0D0D1F', '#0A0A0F']}
      style={styles.container}
    >
      {/* Background glow */}
      {/* <Animated.View style={[styles.glow, glowStyle]} /> */}

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image
            source={require('../../assets/icon.png')} // path to your icon
            style={styles.logoImage}
            resizeMode="contain"
          />
      </Animated.View>

      {/* Title */}
      <Animated.View style={titleStyle}>
        <Text style={styles.title}>TapNation</Text>
        <Text style={styles.titleAccent}>SOCIAL HUB</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={[styles.subtitleContainer, subtitleStyle]}>
        <Text style={styles.subtitle}>Play. Earn. Own.</Text>
      </Animated.View>

      {/* Bottom badge */}
      <Animated.View style={[styles.badge, subtitleStyle]}>
        <Text style={styles.badgeText}>⬡ Powered by Avalanche + Sequence</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: COLORS.neonPurple,
    top: height * 0.2,
    alignSelf: 'center',
    // Soft glow via shadow (iOS) / elevation (Android)
    shadowColor: COLORS.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 80,
    opacity: 0.08,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoImage: {
    width: 200,
    height: 200,
    borderRadius: 28,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -1,
  },
  titleAccent: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.neonCyan,
    textAlign: 'center',
    letterSpacing: 8,
    marginTop: -4,
  },
  subtitleContainer: {
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  badge: {
    position: 'absolute',
    bottom: 48,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.textMuted,
  },
  badgeText: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
  },
});

// Fix: import BORDER_RADIUS
import { BORDER_RADIUS } from '../config/constants';
