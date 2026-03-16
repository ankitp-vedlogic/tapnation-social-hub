/**
 * App.tsx — Root Component
 *
 * Wraps the entire app with required providers:
 * - GestureHandlerRootView (for react-native-gesture-handler)
 * - SafeAreaProvider (for safe area insets)
 * - AppNavigator (handles auth vs app routing)
 */

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import AppToast from '@/components/AppToast';
import RewardAnimationOverlay from '@/components/RewardAnimationOverlay';
import { useRewardAnimationStore } from '@/stores/rewardAnimationStore';

export default function App() {
  const { visible, amount, hideReward } = useRewardAnimationStore();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <AppNavigator />
        <AppToast />
        {visible && (<RewardAnimationOverlay
          amount={amount}
          onFinish={hideReward} />)}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
