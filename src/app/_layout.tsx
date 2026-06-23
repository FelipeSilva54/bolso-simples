import { Stack } from 'expo-router';
import React from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { setBackgroundColorAsync } from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/store/AuthContext';
import { PreferencesProvider } from '@/store/PreferencesContext';
import { LanguageProvider } from '@/store/LanguageContext';
import { NotificationProvider } from '@/store/NotificationContext';
import { ToastProvider } from '@/store/ToastContext';
import { PortalHost } from '@/components/PortalProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  React.useEffect(() => {
    setBackgroundColorAsync('#ffffff');
    NavigationBar.setBackgroundColorAsync('#ffffff');
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PreferencesProvider>
        <LanguageProvider>
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
        </LanguageProvider>
      </PreferencesProvider>
    </GestureHandlerRootView>
  );
}