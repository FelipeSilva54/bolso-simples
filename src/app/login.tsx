import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { colors, fontSize as fs, fontWeight as fw, spacing, lineHeight as lh } from '@/constants';
import { Button } from '@/components/Button';
import { useAuth } from '@/store/AuthContext';
import { useLanguage } from '@/store/LanguageContext';

export default function LoginRoute() {
  const { loginAnonymous, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingAnonymous, setLoadingAnonymous] = useState(false);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('transparent');
    NavigationBar.setButtonStyleAsync('dark');
  }, []);

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      const message = err?.message ?? t('login.googleErrorGeneric');
      Alert.alert(t('login.googleErrorTitle'), message);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setLoadingAnonymous(true);
    try {
      await loginAnonymous();
    } finally {
      setLoadingAnonymous(false);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <View style={[styles.bannerContainer, { height: height * 0.55 }]}>
        <Image
          source={require('@/assets/images/Capa-Login.webp')}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.card, { paddingBottom: spacing.xxl + insets.bottom }]}>
        <Text style={styles.title}>{t('login.title')}</Text>

        <View style={styles.gapSm} />

        <Text style={styles.subtitle}>
          {t('login.subtitleBase')}
          <Text style={styles.bold}>{t('login.featureBrazilian')}</Text>
          {', '}
          <Text style={styles.bold}>{t('login.featureFree')}</Text>
          {t('login.and')}
          <Text style={styles.bold}>{t('login.featureNoAds')}</Text>
        </Text>

        <View style={styles.gapXl} />

        <Button
          variant="soft"
          onPress={handleGoogleSignIn}
          loading={loadingGoogle}
          disabled={loadingAnonymous}
          leftIcon={
            <Image
              source={require('@/assets/images/Logo-Google.png')}
              style={styles.googleIcon}
              accessibilityLabel={t('common.googleLogo')}
            />
          }
        >
          {t('login.signInGoogle')}
        </Button>

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>{t('common.or')}</Text>
          <View style={styles.separatorLine} />
        </View>

        <Button
          variant="primary"
          onPress={handleAnonymousSignIn}
          loading={loadingAnonymous}
          disabled={loadingGoogle}
        >
          {t('login.signInAnonymous')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  bannerContainer: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
  },
  title: {
    fontSize: fs.xxxl,
    fontWeight: fw.semibold,
    lineHeight: lh.md(fs.xxxl),
    color: colors.content,
  },
  gapSm: {
    height: spacing.md,
  },
  gapXl: {
    height: spacing.xxl,
  },
  subtitle: {
    fontSize: fs.md,
    lineHeight: lh.lg(fs.md),
    color: colors.subcontent,
  },
  bold: {
    fontWeight: fw.bold,
    color: colors.content,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  separatorText: {
    fontSize: fs.sm,
    color: colors.muted,
    marginHorizontal: spacing.sm,
  },
});