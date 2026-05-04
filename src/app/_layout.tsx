import { Stack } from 'expo-router';
import { AuthProvider } from '@/src/store/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
