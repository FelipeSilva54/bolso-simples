import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Heart, Copy } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';

const PIX_KEY = 'seuemail@exemplo.com';

const PRESET_VALUES = [5, 10, 20, 50];

export function SupportScreen() {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSelectPreset = (value: number) => {
    setSelectedPreset(value);
    setCustomValue('');
  };

  const handleCustomValueChange = (text: string) => {
    setCustomValue(text);
    setSelectedPreset(null);
  };

  const handleCopyPix = async () => {
    const rawValue =
      selectedPreset !== null
        ? selectedPreset
        : parseFloat(customValue.replace(',', '.'));

    if (!rawValue || rawValue < 1) {
      Alert.alert('Valor inválido', 'Escolha ou digite um valor para continuar.');
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
        title="Apoie o app"
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
          <Heart size={48} color={colors.success} weight="fill" />
          <Text style={styles.heroTitle}>O Bolso Simples é gratuito e sem anúncios</Text>
          <Text style={styles.heroSubtitle}>
            Se o app te ajuda a organizar a vida financeira, considere contribuir com qualquer
            valor. Isso mantém o app vivo e em evolução.
          </Text>
        </View>

        {/* Seção 2 — Seletor de valor */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Escolha ou digite um valor</Text>

          <View style={styles.chipsRow}>
            {PRESET_VALUES.map((value) => (
              <TouchableOpacity
                key={value}
                style={[styles.chip, selectedPreset === value && styles.chipSelected]}
                onPress={() => handleSelectPreset(value)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Contribuir com R$ ${value}`}
              >
                <Text style={[styles.chipText, selectedPreset === value && styles.chipTextSelected]}>
                  R$ {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputPrefix}>R$</Text>
            <TextInput
              style={styles.input}
              placeholder="Ou digite outro valor"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              value={customValue}
              onChangeText={handleCustomValueChange}
              accessibilityLabel="Campo de valor customizado"
            />
          </View>
        </View>

        {/* Seção 3 — Chave Pix */}
        <View style={styles.pixCard}>
          <Text style={styles.pixLabel}>CHAVE PIX</Text>
          <Text style={styles.pixValue}>{PIX_KEY}</Text>
        </View>
        <Text style={styles.pixHint}>
          O Pix é gerado com o valor que você escolheu. Basta copiar e colar no seu banco.
        </Text>

        {/* Seção 4 — Botão */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleCopyPix}
          leftIcon={<Copy size={20} color={colors.white} weight="regular" />}
          accessibilityLabel="Copiar chave Pix com valor para contribuição"
        >
          {copied ? 'Copiado! ✓' : 'Copiar Pix com valor'}
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
    paddingTop: spacing.xl,
  },
  heroTitle: {
    fontSize: fs.xl,
    fontWeight: fw.bold,
    color: colors.content,
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
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
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
    borderRadius: radius.md,
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
    borderRadius: radius.lg,
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
