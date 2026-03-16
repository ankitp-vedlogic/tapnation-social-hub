/**
 * AppNavigator.tsx
 *
 * Root navigation stack. Conditionally shows auth or app screens
 * based on authentication state from Zustand store.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { RootStackParamList } from '../types';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import OfferwallScreen from '../screens/OfferwallScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#0A0A0F' },
        }}
      >
        {!isAuthenticated ? (
          // ─── Auth Stack ────────────────────────────────────────
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </>
        ) : (
          // ─── App Stack ─────────────────────────────────────────
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="Offerwall"
              component={OfferwallScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
