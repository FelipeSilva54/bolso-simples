import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
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
import { usePreferences } from '@/store/PreferencesContext';
import { useLanguage, Language } from '@/store/LanguageContext';
import { SUPPORTED_CURRENCIES } from '@/utils/currency';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;
type SheetId = 'language' | 'currency' | 'theme' | null;

const LANGUAGE_OPTIONS: { value: Language }[] = [
  { value: 'pt' },
  { value: 'en' },
];

const THEME_OPTIONS: { value: 'light' | 'dark'; label: string; disabled: boolean }[] = [
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
        <AppText style={styles.itemTitle}>{title}</AppText>
        <AppText style={styles.itemValue} numberOfLines={1}>{value}</AppText>
      </View>
      <CaretRight size={16} color={colors.muted} weight="regular" />
    </TouchableOpacity>
  );
}

// ---------- PreferencesScreen ----------

export function PreferencesScreen() {
  const router = useRouter();
  const { preferences, setPreference } = usePreferences();
  const { language, setLanguage, t } = useLanguage();
  const [sheet, setSheet] = useState<SheetId>(null);

  const langLabel = (value: Language) =>
    value === 'pt' ? t('preferences.langPt') : t('preferences.langEn');

  const currentLanguageLabel = langLabel(language);

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
        title={t('preferences.title')}
        variant="screen"
        theme="light"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <PrefItem
            icon={Translate as IconComponent}
            title={t('preferences.language')}
            value={currentLanguageLabel}
            onPress={() => setSheet('language')}
            accessibilityLabel={`${t('preferences.language')}: ${currentLanguageLabel}. ${t('preferences.tapToChange')}`}
          />
          <PrefItem
            icon={CurrencyCircleDollar as IconComponent}
            title={t('preferences.currency')}
            value={currentCurrencyLabel}
            onPress={() => setSheet('currency')}
            accessibilityLabel={`${t('preferences.currency')}: ${currentCurrencyLabel}. ${t('preferences.tapToChange')}`}
          />
          <PrefItem
            icon={Moon as IconComponent}
            title={t('preferences.theme')}
            value={currentThemeLabel}
            onPress={() => setSheet('theme')}
            accessibilityLabel={`${t('preferences.theme')}: ${currentThemeLabel}. ${t('preferences.tapToChange')}`}
            isLast
          />
        </View>
      </ScrollView>

      {/* Language Sheet */}
      <BottomSheet visible={sheet === 'language'} onClose={() => setSheet(null)}>
        <View style={styles.sheetWrapper}>
          <AppText style={styles.sheetTitle}>{t('preferences.language')}</AppText>
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.value === language;
            const label = langLabel(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.sheetRow, isActive && styles.sheetRowActive]}
                onPress={() => { setLanguage(option.value); setSheet(null); }}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityLabel={label}
                accessibilityState={{ selected: isActive }}
              >
                <AppText style={[styles.sheetRowLabel, isActive && styles.sheetRowLabelActive]}>
                  {label}
                </AppText>
                {isActive && <Check size={18} color={colors.success} weight="bold" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>

      {/* Currency Sheet */}
      <BottomSheet visible={sheet === 'currency'} onClose={() => setSheet(null)}>
        <View style={styles.sheetWrapper}>
          <AppText style={styles.sheetTitle}>{t('preferences.currency')}</AppText>
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
                <AppText style={[styles.sheetRowLabel, isActive && styles.sheetRowLabelActive]}>
                  {currency.namePtBR}
                </AppText>
                {isActive && <Check size={18} color={colors.success} weight="bold" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>

      {/* Theme Sheet */}
      <BottomSheet visible={sheet === 'theme'} onClose={() => setSheet(null)}>
        <View style={styles.sheetWrapper}>
          <AppText style={styles.sheetTitle}>{t('preferences.theme')}</AppText>
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
                <AppText style={[
                  styles.sheetRowLabel,
                  isActive && styles.sheetRowLabelActive,
                  option.disabled && styles.sheetRowLabelDisabled,
                ]}>
                  {option.label}
                </AppText>
                {option.disabled && (
                  <View style={styles.badge}>
                    <AppText style={styles.badgeLabel}>{t('preferences.comingSoon')}</AppText>
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
