import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeSlash } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type BalanceDisplayVariant = 'total' | 'wallet';

type BalanceDisplayProps = {
  variant: BalanceDisplayVariant;
  subtitle: string;           // "Seu balanço total é:" ou "Saldo da carteira:"
  balance: number;
  hideBalance: boolean;       // Controlado externamente — estado global da tela
  onToggleVisibility: () => void;
  onTodayPress?: () => void;  // Só usado na variante "wallet"
};

export function BalanceDisplay({
  variant,
  subtitle,
  balance,
  hideBalance,
  onToggleVisibility,
  onTodayPress,
}: BalanceDisplayProps) {
  const formattedBalance = balance.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const isWallet = variant === 'wallet';

  return (
    <View style={[styles.container, isWallet ? styles.walletPadding : styles.totalPadding]}>

      {/* Linha superior: subtitle + botão Hoje (só na variante wallet) */}
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>{subtitle}</Text>

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

      {/* Linha do valor + ícone de visibilidade */}
      <View style={styles.balanceRow}>
        <Text style={styles.balanceValue}>
          {hideBalance ? '••••••' : formattedBalance}
        </Text>

        <TouchableOpacity
          onPress={onToggleVisibility}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={hideBalance ? 'Mostrar saldo' : 'Ocultar saldo'}
          accessibilityRole="button"
        >
          {hideBalance
            ? <EyeSlash size={22} color={colors.white} weight="regular" />
            : <Eye size={22} color={colors.white} weight="regular" />
          }
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    gap: spacing.xs,               // 4px entre linha de subtitle e linha de valor
  },
  totalPadding: {
    paddingHorizontal: 20,
    paddingVertical: spacing.xl,   // 24px
  },
  walletPadding: {
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,   // 16px
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: fs.lg,               // 18px
    fontWeight: fw.regular,
    color: colors.offwhite,
  },
  todayButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md, // 12px
    paddingVertical: spacing.xs,   // 4px
    borderRadius: radius.full,     // Pílula
  },
  todayText: {
    fontSize: fs.sm,               // 14px
    fontWeight: fw.medium,
    color: colors.primary,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,               // 8px entre valor e ícone de olho
  },
  balanceValue: {
    fontSize: fs.display,          // 36px
    fontWeight: fw.medium,
    color: colors.white,
  },
});