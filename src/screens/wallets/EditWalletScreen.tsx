import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Check } from 'phosphor-react-native';
import { colors, walletColors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { TextInput as FormInput } from '@/components/TextInput';
import { useAuth } from '@/store/AuthContext';
import { getWallet, updateWallet } from '@/services/wallets';
import { useLanguage } from '@/store/LanguageContext';

const COLOR_PALETTE = [...walletColors] as string[];

export function EditWalletScreen() {
  const router = useRouter();
  const { walletId } = useLocalSearchParams<{ walletId: string }>();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(walletColors[0]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!user || !walletId) return;
    getWallet(user.uid, walletId).then((wallet) => {
      if (wallet) {
        setName(wallet.name);
        setSelectedColor(wallet.color);
        setBalance(wallet.balance);
      }
      setLoading(false);
    });
  }, [user, walletId]);

  const formattedBalance = balance.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const canSave = name.trim().length > 0;

  async function handleSave() {
    if (!user || !walletId) return;
    setSaving(true);
    try {
      await updateWallet(user.uid, walletId, { name: name.trim(), color: selectedColor });
      router.back();
    } catch {
      Alert.alert(t('common.error'), t('wallet.walletErrorSave'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <StatusBar style="dark" />
        <Header
          title={t('wallet.editTitle')}
          variant="screen"
          theme="light"
          showBackButton
          onBackPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <Header
        title={t('wallet.editTitle')}
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
              <Text
                style={[styles.previewName, name.length === 0 && styles.previewNamePlaceholder]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {name.length > 0 ? name : t('wallet.namePreview')}
              </Text>
            </View>
            <View style={styles.previewBalanceContainer}>
              <Text style={styles.previewBalanceLabel}>{t('wallet.balanceSubtitle')}</Text>
              <Text style={styles.previewBalanceValue} numberOfLines={1} ellipsizeMode="tail">
                {formattedBalance}
              </Text>
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
              returnKeyType="done"
              accessibilityLabel={t('wallet.nameLabelA11y')}
            />

            <View>
              <Text style={styles.colorLabel}>{t('wallet.colorLabel')}</Text>
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
        <Button
          variant="primary"
          onPress={handleSave}
          disabled={!canSave}
          loading={saving}
        >
          {t('wallet.saveChanges')}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    gap: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
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
    backgroundColor: colors.white,
  },
});
