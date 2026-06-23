import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { Money, CreditCard, ArrowsClockwise } from 'phosphor-react-native';
import { fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { useLanguage } from '@/store/LanguageContext';

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

const variantColors: Record<PaymentType, { background: string; color: string }> = {
  cash:        { background: CASH_BG,        color: CASH_COLOR        },
  installment: { background: INSTALLMENT_BG, color: INSTALLMENT_COLOR },
  recurring:   { background: RECURRING_BG,   color: RECURRING_COLOR   },
};

const variantTranslationKey: Record<PaymentType, string> = {
  cash:        'transaction.paymentTypeCash',
  installment: 'transaction.paymentTypeInstallment',
  recurring:   'transaction.paymentTypeRecurring',
};

function BadgeIcon({ variant, color }: { variant: PaymentType; color: string }) {
  const props = { size: 16, color, weight: 'bold' } as const;

  if (variant === 'cash')        return <Money {...props} />;
  if (variant === 'installment') return <CreditCard {...props} />;
  return <ArrowsClockwise {...props} />;
}

export function PaymentTypeBadge({ variant }: PaymentTypeBadgeProps) {
  const { t } = useLanguage();
  const { background, color } = variantColors[variant];
  const label = t(variantTranslationKey[variant]).toUpperCase();

  return (
    <View
      style={[styles.container, { backgroundColor: background }]}
      accessibilityLabel={label}
    >
      <BadgeIcon variant={variant} color={color} />
      <AppText style={[styles.label, { color }]}>{label}</AppText>
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
