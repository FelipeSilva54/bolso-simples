import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { CopySimple } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { useLanguage } from '@/store/LanguageContext';

const PIX_KEY = 'fe8e68dc-fc29-483d-ad38-0d9bd4d84221';

const PRESET_VALUES = [5, 10, 20, 50];

export function SupportScreen() {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleSelectPreset = (value: number) => {
    setSelectedPreset(value);
    setCustomValue('');
  };

  const formatBRL = (digits: string): string => {
    if (!digits) return '';
    const cents = parseInt(digits, 10);
    if (isNaN(cents)) return '';
    return (cents / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCustomValueChange = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setCustomValue(digits);
    setSelectedPreset(null);
  };

  const handleCopyPix = async () => {
    const rawValue =
      selectedPreset !== null
        ? selectedPreset
        : parseInt(customValue, 10) / 100;

    if (!rawValue || rawValue < 1) {
      Alert.alert(t('support.invalidValueTitle'), t('support.invalidValueMsg'));
      return;
    }

    const formatted = rawValue.toFixed(2).replace('.', ',');
    const pixString = `Pix: ${PIX_KEY} | Valor: R$ ${formatted}`;

    await Clipboard.setStringAsync(pixString);
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Seção 1 — Hero */}
        <View style={styles.hero}>
          <Image source={require('@/assets/images/Support-Image.png')} style={styles.heroImage} />
          <AppText style={styles.heroTitle}>{t('support.heroTitle')}</AppText>
          <AppText style={styles.heroSubtitle}>{t('support.heroSubtitle')}</AppText>
        </View>

        {/* Seção 2 — Seletor de valor */}
        <View style={styles.section}>
          <AppText style={styles.sectionLabel}>{t('support.chooseValue')}</AppText>

          <View style={styles.chipsRow}>
            {PRESET_VALUES.map((value) => (
              <TouchableOpacity
                key={value}
                style={[styles.chip, selectedPreset === value && styles.chipSelected]}
                onPress={() => handleSelectPreset(value)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${t('support.contributeA11yPrefix')}${value}`}
              >
                <AppText style={[styles.chipText, selectedPreset === value && styles.chipTextSelected]}>
                  R$ {value}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <AppText style={styles.inputPrefix}>R$</AppText>
            <TextInput
              style={styles.input}
              placeholder={t('support.otherValuePlaceholder')}
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={formatBRL(customValue)}
              onChangeText={handleCustomValueChange}
              accessibilityLabel="Campo de valor customizado"
            />
          </View>
        </View>

        {/* Seção 3 — Chave Pix */}
        <View style={styles.pixCard}>
          <AppText style={styles.pixLabel}>{t('support.pixLabel')}</AppText>
          <AppText style={styles.pixValue}>{PIX_KEY}</AppText>
        </View>
        <AppText style={styles.pixHint}>{t('support.pixHint')}</AppText>

        {/* Seção 4 — Botão */}
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

  // Seletor de valor
  section: {
    gap: spacing.md,
  },
  sectionLabel: {
    fontSize: fs.sm,
    fontWeight: fw.medium,
    color: colors.subcontent,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  chipSelected: {
    backgroundColor: colors.success,
  },
  chipText: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
  },
  chipTextSelected: {
    color: colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  inputPrefix: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: fs.md,
    color: colors.content,
  },

  // Pix card
  pixCard: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  pixLabel: {
    fontSize: fs.xs,
    fontWeight: fw.medium,
    color: colors.subcontent,
    letterSpacing: 1,
  },
  pixValue: {
    fontSize: fs.md,
    fontWeight: fw.semibold,
    color: colors.content,
  },
  pixHint: {
    fontSize: fs.sm,
    color: colors.muted,
    textAlign: 'center',
  },
});
