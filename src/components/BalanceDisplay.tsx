import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { CalendarDots } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';

type BalanceDisplayVariant = 'total' | 'wallet';

type BalanceDisplayProps = {
  variant: BalanceDisplayVariant;
  subtitle: string;
  balance: number;
  hideBalance: boolean;
  onTodayPress?: () => void;
};

export const BalanceDisplay = React.memo(function BalanceDisplay({
  variant,
  subtitle,
  balance,
  hideBalance,
  onTodayPress,
}: BalanceDisplayProps) {
  const { preferences } = usePreferences();
  const formattedBalance = formatCurrency(balance, preferences.currency);

  const isWallet = variant === 'wallet';

  return (
    <View style={[styles.container, isWallet ? styles.walletPadding : styles.totalPadding]}>

      {/* Linha superior: subtitle apenas */}
      <View style={styles.subtitleRow}>
        <AppText style={styles.subtitle}>{subtitle}</AppText>
      </View>

      {/* Linha do valor + botão Hoje */}
      <View style={styles.balanceRow}>
        <AppText style={styles.balanceValue}>
          {hideBalance ? '••••••' : formattedBalance}
        </AppText>

        {isWallet && onTodayPress != null && (
          <TouchableOpacity
            onPress={onTodayPress}
            style={styles.todayButton}
            accessibilityLabel="Ir para o mês atual"
            accessibilityRole="button"
          >
            <CalendarDots size={16} color={colors.primary} weight="fill" />
            <AppText style={styles.todayText}>Hoje</AppText>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    gap: spacing.xs,
  },
  totalPadding: {
    paddingHorizontal: 20,
    paddingVertical: spacing.xxl,
  },
  walletPadding: {
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.offwhite,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  todayText: {
    fontSize: fs.sm,
    fontWeight: fw.medium,
    color: colors.primary,
    lineHeight: fs.sm * 1.2,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  balanceValue: {
    fontSize: fs.display,
    fontWeight: fw.medium,
    color: colors.white,
    flex: 1,
  },
});