import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { TransactionItem } from '@/components/TransactionItem';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

type BadgeVariant = 'danger' | 'success' | 'info';

type Transaction = {
  id: string;
  icon: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
  iconColor: string;
  title: string;
  description?: string;
  amount: number;
  badgeVariant: BadgeVariant;
  badgeLabel: string;
  installmentIndex?: number;
  installmentTotal?: number;
};

type TransactionGroupProps = {
  date: string;              // Ex: "Quinta, 25 de dezembro" — formatado antes de chegar aqui
  transactions: Transaction[];
  onTransactionPress: (id: string) => void;
};

export const TransactionGroup = React.memo(function TransactionGroup({
  date,
  transactions,
  onTransactionPress,
}: TransactionGroupProps) {
  return (
    <View style={styles.container}>

      {/* Header com a data do grupo */}
      <View style={styles.dateHeader}>
        <AppText style={styles.dateText}>{date}</AppText>
      </View>

      {/* Lista de transações do dia */}
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          id={transaction.id}
          icon={transaction.icon}
          iconColor={transaction.iconColor}
          title={transaction.title}
          description={transaction.description}
          amount={transaction.amount}
          badgeVariant={transaction.badgeVariant}
          badgeLabel={transaction.badgeLabel}
          installmentIndex={transaction.installmentIndex}
          installmentTotal={transaction.installmentTotal}
          onPress={onTransactionPress}
        />
      ))}

    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: spacing.xl,
  },
  dateHeader: {
    paddingHorizontal: 20,         // 20px — sem token entre spacing.lg (16) e spacing.xl (24)
    paddingVertical: spacing.md,   // 12px
  },
  dateText: {
    fontSize: fs.sm,               // 14px
    fontWeight: fw.regular,
    color: colors.subcontent,
    textAlign: 'left',
  },
});
