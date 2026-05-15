import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  Translate,
  CurrencyCircleDollar,
  Moon,
  CaretRight,
  Check,
} from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { BottomSheet } from '@/components/BottomSheet';
import { usePreferences, AppPreferences } from '@/store/PreferencesContext';
import { SUPPORTED_CURRENCIES } from '@/utils/currency';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;
type SheetId = 'language' | 'currency' | 'theme' | null;

const LANGUAGE_OPTIONS: { value: AppPreferences['language']; label: string }[] = [
  { value: 'pt-BR', label: 'Português' },
  { value: 'en',   label: 'English'   },
];

const THEME_OPTIONS: { value: AppPreferences['theme']; label: string; disabled: boolean }[] = [
  { value: 'light', label: 'Light', disabled: false },
  { value: 'dark',  label: 'Dark',  disabled: true  },
];

// ---------- PrefItem ----------

type PrefItemProps = {
  icon: IconComponent;
  title: string;
  value: string;
  onPress: () => void;
  accessibilityLabel: string;
  isLast?: boolean;
};

function PrefItem({ icon: Icon, title, value, onPress, accessibilityLabel, isLast }: PrefItemProps) {
  return (
    <TouchableOpacity
      style={[styles.item, !isLast && styles.itemBorder]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 4, bottom: 4 }}
    >
      <Icon size={22} color={colors.subcontent} weight="regular" />
      <View style={styles.itemCenter}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemValue} numberOfLines={1}>{value}</Text>
      </View>
      <CaretRight size={16} color={colors.muted} weight="regular" />
    </TouchableOpacity>
  );
}

// ---------- PreferencesScreen ----------

export function PreferencesScreen() {
  const router = useRouter();
  const { preferences, setPreference } = usePreferences();
  const [sheet, setSheet] = useState<SheetId>(null);

  const currentLanguageLabel =
    LANGUAGE_OPTIONS.find((o) => o.value === preferences.language)?.label ?? 'Português';

  const currentCurrency = SUPPORTED_CURRENCIES.find((c) => c.code === preferences.currency);
  const currentCurrencyLabel = currentCurrency
    ? `${currentCurrency.namePtBR.toUpperCase()} (${currentCurrency.symbol})`
    : preferences.currency;

  const currentThemeLabel =
    THEME_OPTIONS.find((o) => o.value === preferences.theme)?.label ?? 'Light';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.white} />

      <Header
        title="Preferências"
        variant="screen"
        theme="light"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <PrefItem
            icon={Translate as IconComponent}
            title="Idioma"
            value={currentLanguageLabel}
            onPress={() => setSheet('language')}
            accessibilityLabel={`Idioma: ${currentLanguageLabel}. Toque para alterar`}
          />
          <PrefItem
            icon={CurrencyCircleDollar as IconComponent}
            title="Moeda padrão"
            value={currentCurrencyLabel}
            onPress={() => setSheet('currency')}
            accessibilityLabel={`Moeda padrão: ${currentCurrencyLabel}. Toque para alterar`}
          />
          <PrefItem
            icon={Moon as IconComponent}
            title="Tema"
            value={currentThemeLabel}
            onPress={() => setSheet('theme')}
            accessibilityLabel={`Tema: ${currentThemeLabel}. Toque para alterar`}
            isLast
          />
        </View>
      </ScrollView>

      {/* Language Sheet */}
      <BottomSheet visible={sheet === 'language'} onClose={() => setSheet(null)}>
        <View style={styles.sheetWrapper}>
          <Text style={styles.sheetTitle}>Idioma</Text>
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.value === preferences.language;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.sheetRow, isActive && styles.sheetRowActive]}
                onPress={() => { setPreference('language', option.value); setSheet(null); }}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[styles.sheetRowLabel, isActive && styles.sheetRowLabelActive]}>
                  {option.label}
                </Text>
                {isActive && <Check size={18} color={colors.success} weight="bold" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>

      {/* Currency Sheet */}
      <BottomSheet visible={sheet === 'currency'} onClose={() => setSheet(null)}>
        <View style={styles.sheetWrapper}>
          <Text style={styles.sheetTitle}>Moeda padrão</Text>
          {SUPPORTED_CURRENCIES.map((currency) => {
            const isActive = currency.code === preferences.currency;
            return (
              <TouchableOpacity
                key={currency.code}
                style={[styles.sheetRow, isActive && styles.sheetRowActive]}
                onPress={() => { setPreference('currency', currency.code); setSheet(null); }}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityLabel={`${currency.namePtBR}, ${currency.code}, ${currency.symbol}`}
                accessibilityState={{ selected: isActive }}
              >
                <Text style={[styles.sheetRowLabel, isActive && styles.sheetRowLabelActive]}>
                  {currency.namePtBR}
                </Text>
                {isActive && <Check size={18} color={colors.success} weight="bold" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>

      {/* Theme Sheet */}
      <BottomSheet visible={sheet === 'theme'} onClose={() => setSheet(null)}>
        <View style={styles.sheetWrapper}>
          <Text style={styles.sheetTitle}>Tema</Text>
          {THEME_OPTIONS.map((option) => {
            const isActive = option.value === preferences.theme;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.sheetRow, isActive && styles.sheetRowActive, option.disabled && styles.sheetRowDisabled]}
                onPress={() => {
                  if (option.disabled) return;
                  setPreference('theme', option.value);
                  setSheet(null);
                }}
                activeOpacity={option.disabled ? 1 : 0.7}
                accessibilityRole="radio"
                accessibilityLabel={option.label}
                accessibilityState={{ selected: isActive, disabled: option.disabled }}
              >
                <Text style={[
                  styles.sheetRowLabel,
                  isActive && styles.sheetRowLabelActive,
                  option.disabled && styles.sheetRowLabelDisabled,
                ]}>
                  {option.label}
                </Text>
                {option.disabled && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>Em breve</Text>
                  </View>
                )}
                {isActive && !option.disabled && (
                  <Check size={18} color={colors.success} weight="bold" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.xl,
  },

  // List section card
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
  },

  // Preference item row
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemCenter: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: fs.md,
    fontWeight: fw.semibold,
    color: colors.content,
  },
  itemValue: {
    fontSize: fs.sm,
    color: colors.subcontent,
  },

  // Bottom sheet content
  sheetWrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
  },
  sheetTitle: {
    fontSize: fs.lg,
    fontWeight: fw.semibold,
    color: colors.content,
    marginBottom: spacing.md,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderRadius: radius.sm,
    minHeight: 44,
  },
  sheetRowActive: {
    backgroundColor: colors.successLight,
  },
  sheetRowDisabled: {
    opacity: 0.5,
  },
  sheetRowLabel: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
  },
  sheetRowLabelActive: {
    fontWeight: fw.semibold,
    color: colors.success,
  },
  sheetRowLabelDisabled: {
    color: colors.muted,
  },

  // "Em breve" badge
  badge: {
    backgroundColor: colors.infoLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeLabel: {
    fontSize: fs.xxs,
    fontWeight: fw.semibold,
    color: colors.info,
  },
});
