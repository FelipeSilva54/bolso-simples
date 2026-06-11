import { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/store/AuthContext';
import { colors } from '@/constants';

const MIN_LOADING_MS = 2000;

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [minTimeDone, setMinTimeDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeDone(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || !minTimeDone) return;
    router.replace(user ? '/(tabs)' : '/login');
  }, [loading, minTimeDone, user]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/Logo-Icon.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Logo Bolso Simples"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
});