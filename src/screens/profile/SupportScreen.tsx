import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import AppText from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { CopySimple } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { useLanguage } from '@/store/LanguageContext';

const PIX_KEY = 'fe8e68dc-fc29-483d-ad38-0d9bd4d84221';

export function SupportScreen() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopyPix = async () => {
    await Clipboard.setStringAsync(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.white} />

      <Header
        title={t('support.title')}
        variant="screen"
        theme="light"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image source={require('@/assets/images/Support-Image.png')} style={styles.heroImage} />
          <AppText style={styles.heroTitle}>{t('support.heroTitle')}</AppText>
          <AppText style={styles.heroSubtitle}>{t('support.heroSubtitle')}</AppText>
        </View>

        <Button
          variant="primary"
          size="lg"
          onPress={handleCopyPix}
          leftIcon={<CopySimple size={20} color={colors.white} weight="regular" />}
          accessibilityLabel={t('support.copyPixA11y')}
        >
          {copied ? t('support.copied') : t('support.copyPix')}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },

  // Hero
  hero: {
    alignItems: 'center',
    gap: spacing.md,
  },
  heroImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  heroTitle: {
    fontSize: fs.xl,
    fontWeight: fw.bold,
    color: colors.content,
    lineHeight: fs.xl * 1.25,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
    textAlign: 'center',
    lineHeight: fs.md * 1.5,
  },
});
