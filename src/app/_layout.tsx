import { Stack } from 'expo-router';
import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/store/AuthContext';
import { PreferencesProvider } from '@/store/PreferencesContext';
import { NotificationProvider } from '@/store/NotificationContext';
import { ToastProvider } from '@/store/ToastContext';
import { PortalHost } from '@/components/PortalProvider';

export default function RootLayout() {
  React.useEffect(() => {
    setBackgroundColorAsync('#ffffff');
    NavigationBar.setBackgroundColorAsync('#ffffff');
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PreferencesProvider>
        <AuthProvider>
          <NotificationProvider>
            <PortalHost>
              <ToastProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="index" />
                  <Stack.Screen name="login" />
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="(stack)" />
                </Stack>
              </ToastProvider>
            </PortalHost>
          </NotificationProvider>
        </AuthProvider>
      </PreferencesProvider>
    </GestureHandlerRootView>
  );
}