import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useAuth } from '@/store/AuthContext';
import { useLanguage } from '@/store/LanguageContext';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

const MIN_LOADING_MS = 5000;

export default function Index() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
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
    router.replace('/(tabs)');
  }, [loading, minTimeDone, user]);

  const displayName = user?.isAnonymous ? t('common.visitor') : user?.email ?? null;

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
        <Text style={styles.label}>{t('loading.syncing')}</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        {displayName && (
          <>
            <Text style={styles.footerLabel}>{t('loading.signingAs')}</Text>
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
    paddingTop: spacing.xs,
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
    marginBottom: spacing.xxxxl,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  label: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  footer: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: fs.sm,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  footerEmail: {
    fontSize: fs.sm,
    fontWeight: fw.semibold,
    color: colors.content,
  },
});