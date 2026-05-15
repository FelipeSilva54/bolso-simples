import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useAuth } from '@/store/AuthContext';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

const MIN_LOADING_MS = 5000;

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [minTimeDone, setMinTimeDone] = useState(false);

  // Timer de 5s mínimo — garante que a tela não pisca e some
  useEffect(() => {
    const timer = setTimeout(() => setMinTimeDone(true), MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, []);

  // Só redireciona quando AMBOS estiverem prontos: Firebase + timer
  useEffect(() => {
    if (loading || !minTimeDone) return;
    router.replace(user ? '/(tabs)' : '/login');
  }, [loading, minTimeDone, user]);

  const displayName = user?.isAnonymous ? 'Visitante' : user?.email ?? null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/Logo-Vertical.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Logo Bolso Simples"
        />
      </View>

      <View style={styles.center}>
        <LottieView
          source={require('@/assets/images/wallet-loading.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.label}>Estamos sincronizando os seus dados, aguarde alguns segundos...</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        {displayName && (
          <>
            <Text style={styles.footerLabel}>Você está entrando como</Text>
            <Text style={styles.footerEmail}>{displayName}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  logo: {
    width: 160,
    height: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  lottie: {
    width: 160,
    height: 160,
  },
  label: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footer: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: fs.sm,
    color: colors.primary,
  },
  footerEmail: {
    fontSize: fs.sm,
    fontWeight: fw.bold,
    color: colors.content,
  },
});