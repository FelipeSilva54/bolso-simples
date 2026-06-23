import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Check } from 'phosphor-react-native';
import { colors, walletColors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { TextInput as FormInput } from '@/components/TextInput';
import { InfoAlert } from '@/components/InfoAlert';
import { useWallets } from '@/hooks/useWallets';
import { formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';
import { useToast } from '@/store/ToastContext';
import { useLanguage } from '@/store/LanguageContext';

const COLOR_PALETTE = [...walletColors] as string[];

export function AddWalletScreen() {
  const router = useRouter();
  const { createWallet } = useWallets();
  const { preferences } = usePreferences();

  const [name, setName] = useState('');
  const [balanceDigits, setBalanceDigits] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(walletColors[0]);
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);

  const balanceCents = parseInt(balanceDigits || '0', 10);
  const previewBalance = balanceCents / 100;
  const balanceDisplay = balanceDigits
    ? formatCurrency(previewBalance, preferences.currency)
    : '';
  const canSave = name.trim().length > 0 && balanceDigits.length > 0;

  const handleBalanceChange = (text: string) => {
    setBalanceDigits(text.replace(/\D/g, ''));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await createWallet({
        name: name.trim(),
        color: selectedColor,
        initialBalance: previewBalance,
      });
      router.back();
      showToast(t('wallet.walletAdded'));
    } catch {
      Alert.alert(t('common.error'), t('wallet.walletErrorCreate'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <Header
        title={t('wallet.createTitle')}
        variant="screen"
        theme="light"
        showBackButton
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Preview */}
          <View style={[styles.preview, { backgroundColor: selectedColor }]}>
            <View style={styles.previewHeader}>
              <AppText
                style={[styles.previewName, name.length === 0 && styles.previewNamePlaceholder]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name.length > 0 ? name : t('wallet.namePreview')}
              </AppText>
            </View>

            <View style={styles.previewBalanceContainer}>
              <AppText style={styles.previewBalanceLabel}>{t('wallet.balanceSubtitle')}</AppText>
              <AppText style={styles.previewBalanceValue} numberOfLines={1} ellipsizeMode="tail">
                {formatCurrency(previewBalance, preferences.currency)}
              </AppText>
            </View>

            <View style={styles.decorContainer} pointerEvents="none">
              <View style={styles.decorCircleBack} />
              <View style={styles.decorCircleFront} />
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <FormInput
              label={t('wallet.nameLabel')}
              placeholder={t('wallet.namePlaceholder')}
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              accessibilityLabel={t('wallet.nameLabelA11y')}
            />

            <FormInput
              label={t('wallet.balanceLabel')}
              placeholder={t('wallet.balancePlaceholder')}
              value={balanceDisplay}
              onChangeText={handleBalanceChange}
              keyboardType="numeric"
              returnKeyType="done"
              accessibilityLabel={t('wallet.balanceLabelA11y')}
            />

            {/* Color picker */}
            <View>
              <AppText style={styles.colorLabel}>{t('wallet.colorLabel')}</AppText>
              <View style={styles.colorGrid}>
                {COLOR_PALETTE.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorCircle, { backgroundColor: color }]}
                    onPress={() => setSelectedColor(color)}
                    accessibilityLabel={`${t('wallet.colorA11yPrefix')} ${color}`}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: selectedColor === color }}
                    hitSlop={{ top: spacing.xs, bottom: spacing.xs, left: spacing.xs, right: spacing.xs }}
                  >
                    {selectedColor === color && (
                      <Check size={18} color={colors.white} weight="bold" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <InfoAlert>{t('wallet.infoAlert')}</InfoAlert>
        <Button
          variant="primary"
          onPress={handleSave}
          disabled={!canSave}
          loading={saving}
        >
          {t('wallet.saveButton')}
        </Button>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    gap: spacing.xxl,
    paddingBottom: spacing.xxl,
  },

  // Preview — espelha os estilos do WalletCard (sem botão de opções)
  preview: {
    borderRadius: radius.md,
    padding: 20,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  previewName: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.white,
    flex: 1,
  },
  previewNamePlaceholder: {
    opacity: 0.45,
  },
  previewBalanceContainer: {
    gap: spacing.xs,
  },
  previewBalanceLabel: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  previewBalanceValue: {
    fontSize: fs.xxxl,
    fontWeight: fw.medium,
    color: colors.white,
  },
  decorContainer: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 160,
    height: 160,
  },
  decorCircleBack: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: 3,
    right: 15,
  },
  decorCircleFront: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: 0,
    right: 0,
  },

  form: {
    gap: spacing.xxl,
  },
  colorLabel: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
    marginBottom: spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.white,
  },
});
