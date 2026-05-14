import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { formatCurrency } from '@/utils/currency';

type SummaryCardProps = {
  income: number;
  expense: number;
  balance: number;
  hideBalance: boolean;
  onIncomePress: () => void;
  onExpensePress: () => void;
};

export function SummaryCard({
  income,
  expense,
  balance,
  hideBalance,
  onIncomePress,
  onExpensePress,
}: SummaryCardProps) {
  const displayIncome = hideBalance ? '••••••' : formatCurrency(income);
  const displayExpense = hideBalance ? '••••••' : formatCurrency(expense);
  const displayBalance = hideBalance ? '••••••' : formatCurrency(balance);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.column}
        onPress={onIncomePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Receitas: ${hideBalance ? 'oculto' : formatCurrency(income)}`}
      >
        <Text style={[styles.value, styles.incomeColor]} numberOfLines={1}>
          {displayIncome}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          Receitas
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.column}
        onPress={onExpensePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Despesas: ${hideBalance ? 'oculto' : formatCurrency(expense)}`}
      >
        <Text style={[styles.value, styles.expenseColor]} numberOfLines={1}>
          {displayExpense}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          Despesas
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <View style={styles.column}>
        <Text style={[styles.value, styles.balanceColor]} numberOfLines={1}>
          {displayBalance}
        </Text>
        <Text style={styles.label} numberOfLines={1}>
          Saldo
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    minHeight: 44,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  value: {
    fontSize: fs.md,
    fontWeight: fw.semibold,
  },
  label: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.subcontent,
  },
  incomeColor: {
    color: colors.success,
  },
  expenseColor: {
    color: colors.danger,
  },
  balanceColor: {
    color: colors.content,
  },
});
