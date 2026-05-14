import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type BalanceDisplayVariant = 'total' | 'wallet';

type BalanceDisplayProps = {
  variant: BalanceDisplayVariant;
  subtitle: string;
  balance: number;
  hideBalance: boolean;
  onTodayPress?: () => void;
};

export function BalanceDisplay({
  variant,
  subtitle,
  balance,
  hideBalance,
  onTodayPress,
}: BalanceDisplayProps) {
  const formattedBalance = balance.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const isWallet = variant === 'wallet';

  return (
    <View style={[styles.container, isWallet ? styles.walletPadding : styles.totalPadding]}>

      {/* Linha superior: subtitle apenas */}
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {/* Linha do valor + botão Hoje */}
      <View style={styles.balanceRow}>
        <Text style={styles.balanceValue}>
          {hideBalance ? '••••••' : formattedBalance}
        </Text>

        {isWallet && onTodayPress != null && (
          <TouchableOpacity
            onPress={onTodayPress}
            style={styles.todayButton}
            accessibilityLabel="Ir para o mês atual"
            accessibilityRole="button"
          >
            <Text style={styles.todayText}>Hoje</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

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
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  todayText: {
    fontSize: fs.sm,
    fontWeight: fw.medium,
    color: colors.primary,
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