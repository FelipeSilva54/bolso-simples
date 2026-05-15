import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Money, CreditCard, ArrowsClockwise } from 'phosphor-react-native';
import { fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type PaymentType = 'cash' | 'installment' | 'recurring';

type PaymentTypeBadgeProps = {
  variant: PaymentType;
};

const CASH_BG = '#E8F5E9';
const CASH_COLOR = '#2E7D32';
const INSTALLMENT_BG = '#E3F2FD';
const INSTALLMENT_COLOR = '#1565C0';
const RECURRING_BG = '#EDE7F6';
const RECURRING_COLOR = '#4527A0';

const variantConfig: Record<PaymentType, { background: string; color: string; label: string }> = {
  cash:        { background: CASH_BG,        color: CASH_COLOR,        label: 'À VISTA'    },
  installment: { background: INSTALLMENT_BG, color: INSTALLMENT_COLOR, label: 'PARCELADO'  },
  recurring:   { background: RECURRING_BG,   color: RECURRING_COLOR,   label: 'RECORRENTE' },
};

function BadgeIcon({ variant, color }: { variant: PaymentType; color: string }) {
  const props = { size: 16, color, weight: 'bold' } as const;

  if (variant === 'cash')        return <Money {...props} />;
  if (variant === 'installment') return <CreditCard {...props} />;
  return <ArrowsClockwise {...props} />;
}

export function PaymentTypeBadge({ variant }: PaymentTypeBadgeProps) {
  const { background, color, label } = variantConfig[variant];

  return (
    <View
      style={[styles.container, { backgroundColor: background }]}
      accessibilityLabel={label}
    >
      <BadgeIcon variant={variant} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.xs,
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: fs.xs,
    fontWeight: fw.semibold,
    letterSpacing: 0.5,
  },
});
