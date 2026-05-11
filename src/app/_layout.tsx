import { Stack } from 'expo-router';
import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { AuthProvider } from '@/store/AuthContext';
import { PortalHost } from '@/components/PortalProvider';

export default function RootLayout() {
  React.useEffect(() => {
    setBackgroundColorAsync('#ffffff');
    NavigationBar.setBackgroundColorAsync('#ffffff');
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  return (
    <AuthProvider>
      <PortalHost>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(stack)" />
        </Stack>
      </PortalHost>
    </AuthProvider>
  );
}