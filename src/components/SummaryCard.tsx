import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { formatCurrency } from '@/utils/currency';

type SummaryCardVariant = 'income' | 'expense' | 'balance';

type SummaryCardProps = {
  label: string;
  value: number;
  variant: SummaryCardVariant;
  hideBalance: boolean;
  onPress?: () => void;
};

function valueColor(variant: SummaryCardVariant, value: number): string {
  if (variant === 'income') return colors.success;
  if (variant === 'expense') return colors.danger;
  // balance: green if positive or zero, red if negative
  return value < 0 ? colors.danger : colors.success;
}

export function SummaryCard({ label, value, variant, hideBalance, onPress }: SummaryCardProps) {
  const color = valueColor(variant, value);
  const formattedValue = hideBalance ? '••••••' : formatCurrency(value);

  const inner = (
    <View style={styles.card}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color }]} numberOfLines={1}>
        {formattedValue}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.wrapper}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${hideBalance ? 'oculto' : formatCurrency(value)}`}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return <View style={styles.wrapper}>{inner}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
  },
  label: {
    fontSize: fs.xs,
    fontWeight: fw.regular,
    color: colors.subcontent,
  },
  value: {
    fontSize: fs.sm,
    fontWeight: fw.semibold,
  },
});
