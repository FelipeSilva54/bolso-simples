import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
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

const COLOR_PALETTE = [...walletColors] as string[];

export function AddWalletScreen() {
  const router = useRouter();
  const { createWallet } = useWallets();
  const { preferences } = usePreferences();

  const [name, setName] = useState('');
  const [balanceDigits, setBalanceDigits] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(walletColors[0]);
  const { showToast } = useToast();
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
      showToast('Carteira adicionada com sucesso');
    } catch {
      Alert.alert('Erro', 'Não foi possível criar a carteira. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />
      <Header
        title="Criar carteira"
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
                {name.length > 0 ? name : 'Nome da carteira'}
              </Text>
            </View>

            <View style={styles.previewBalanceContainer}>
              <Text style={styles.previewBalanceLabel}>Saldo da carteira:</Text>
              <Text style={styles.previewBalanceValue} numberOfLines={1} ellipsizeMode="tail">
                {formatCurrency(previewBalance, preferences.currency)}
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
              label="Apelido"
              placeholder="Ex: Carteira do Thiago"
              value={name}
              onChangeText={setName}
              returnKeyType="next"
              accessibilityLabel="Apelido da carteira"
            />

            <FormInput
              label="Saldo atual"
              placeholder="Ex: R$ 10.000,00"
              value={balanceDisplay}
              onChangeText={handleBalanceChange}
              keyboardType="numeric"
              returnKeyType="done"
              accessibilityLabel="Saldo atual da carteira"
            />

            {/* Color picker */}
            <View>
              <Text style={styles.colorLabel}>Cor de fundo</Text>
              <View style={styles.colorGrid}>
                {COLOR_PALETTE.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorCircle, { backgroundColor: color }]}
                    onPress={() => setSelectedColor(color)}
                    accessibilityLabel={`Selecionar cor ${color}`}
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
        <InfoAlert>
          Use carteiras para separar seu dinheiro por contas, cartões, bancos ou metas.
        </InfoAlert>
        <Button
          variant="primary"
          onPress={handleSave}
          disabled={!canSave}
          loading={saving}
        >
          Salvar carteira
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
