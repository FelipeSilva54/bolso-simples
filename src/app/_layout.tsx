import { Stack } from 'expo-router';
import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { AuthProvider } from '@/store/AuthContext';

export default function RootLayout() {
  React.useEffect(() => {
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(stack)" />
      </Stack>
    </AuthProvider>
  );
}