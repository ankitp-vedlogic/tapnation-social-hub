/**
 * NeonButton.tsx
 * High-quality gaming-style button with neon glow effect and press animation.
 */

import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  ReduceMotion,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SPACING } from '../config/constants';

interface Props {
  onPress: () => void;
  label: string;
  variant?: 'cyan' | 'purple' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const GRADIENT_MAP = {
  cyan: [COLORS.neonCyan, '#0088FF'] as const,
  purple: [COLORS.neonPurple, '#7B2FBE'] as const,
  gold: [COLORS.neonGold, '#FF8C00'] as const,
  ghost: ['transparent', 'transparent'] as const,
};

const SIZE_MAP = {
  sm: { height: 40, fontSize: 14, paddingHorizontal: SPACING.md },
  md: { height: 52, fontSize: 16, paddingHorizontal: SPACING.lg },
  lg: { height: 60, fontSize: 18, paddingHorizontal: SPACING.xl },
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function NeonButton({
  onPress,
  label,
  variant = 'cyan',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, { damping: 15 });
    opacity.value = withTiming(0.85, {
      duration: 100,
      reduceMotion: ReduceMotion.System,
    });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withTiming(1, { duration: 150, reduceMotion: ReduceMotion.System, });
  }, []);

  const { height, fontSize, paddingHorizontal } = SIZE_MAP[size];
  const isGhost = variant === 'ghost';

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
      style={[animatedStyle, style]}
    >
      {isGhost ? (
        <View
          style={[
            styles.ghostButton,
            { height, paddingHorizontal },
            (disabled || loading) && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.neonCyan} size="small" />
          ) : (
            <View style={styles.labelRow}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={[styles.ghostLabel, { fontSize }]}>{label}</Text>
            </View>
          )}
        </View>
      ) : (
        <LinearGradient
          colors={GRADIENT_MAP[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradientButton,
            { height, paddingHorizontal },
            (disabled || loading) && styles.disabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textPrimary} size="small" />
          ) : (
            <View style={styles.labelRow}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={[styles.gradientLabel, { fontSize }]}>{label}</Text>
            </View>
          )}
        </LinearGradient>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  gradientButton: {
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  ghostButton: {
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.neonCyan + '60',
    backgroundColor: COLORS.neonCyan + '10',
  },
  gradientLabel: {
    color: '#000',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ghostLabel: {
    color: COLORS.neonCyan,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconContainer: {
    marginRight: 4,
  },
  disabled: {
    opacity: 0.4,
  },
});
