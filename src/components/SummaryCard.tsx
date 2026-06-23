import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';
import { useLanguage } from '@/store/LanguageContext';

type SummaryCardProps = {
  income: number;
  expense: number;
  balance: number;
  hideBalance: boolean;
  onIncomePress?: () => void;
  onExpensePress?: () => void;
};

export const SummaryCard = React.memo(function SummaryCard({
  income,
  expense,
  balance,
  hideBalance,
  onIncomePress,
  onExpensePress,
}: SummaryCardProps) {
  const { preferences } = usePreferences();
  const { t } = useLanguage();
  const displayIncome = hideBalance ? '••••••' : formatCurrency(income, preferences.currency);
  const displayExpense = hideBalance ? '••••••' : formatCurrency(expense, preferences.currency);
  const displayBalance = hideBalance ? '••••••' : formatCurrency(balance, preferences.currency);

  const IncomeWrapper = onIncomePress ? TouchableOpacity : View;
  const ExpenseWrapper = onExpensePress ? TouchableOpacity : View;

  return (
    <View style={styles.container}>
      <IncomeWrapper
        style={styles.column}
        onPress={onIncomePress}
        activeOpacity={0.7}
        accessibilityRole={onIncomePress ? 'button' : undefined}
        accessibilityLabel={`${t('common.income')}: ${displayIncome}`}
      >
        <AppText style={[styles.value, styles.incomeColor]} numberOfLines={1}>
          {displayIncome}
        </AppText>
        <AppText style={styles.label} numberOfLines={1}>
          {t('common.income')}
        </AppText>
      </IncomeWrapper>

      <View style={styles.divider} />

      <ExpenseWrapper
        style={styles.column}
        onPress={onExpensePress}
        activeOpacity={0.7}
        accessibilityRole={onExpensePress ? 'button' : undefined}
        accessibilityLabel={`${t('common.expense')}: ${displayExpense}`}
      >
        <AppText style={[styles.value, styles.expenseColor]} numberOfLines={1}>
          {displayExpense}
        </AppText>
        <AppText style={styles.label} numberOfLines={1}>
          {t('common.expense')}
        </AppText>
      </ExpenseWrapper>

      <View style={styles.divider} />

      <View style={styles.column}>
        <AppText style={[styles.value, styles.balanceColor]} numberOfLines={1}>
          {displayBalance}
        </AppText>
        <AppText style={styles.label} numberOfLines={1}>
          {t('common.balance')}
        </AppText>
      </View>
    </View>
  );
});

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
    backgroundColor: colors.offwhite,
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
