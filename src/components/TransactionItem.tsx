import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';
import { StatusBadge } from '@/components/StatusBadge';
import { AvatarIcon } from '@/components/AvatarIcon';
type BadgeVariant = 'danger' | 'success' | 'info';

type TransactionItemProps = {
  icon: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
  iconColor: string;    // Cor de fundo do círculo do avatar
  title: string;
  description?: string;
  amount: number;       // Valor da transação — positivo ou negativo
  badgeVariant: BadgeVariant;
  badgeLabel: string;
  installmentIndex?: number;
  installmentTotal?: number;
  onPress: () => void;
};

export function TransactionItem({
  icon: IconComponent,
  iconColor,
  title,
  description,
  amount,
  badgeVariant,
  badgeLabel,
  installmentIndex,
  installmentTotal,
  onPress,
}: TransactionItemProps) {
  const { preferences } = usePreferences();
  const isNegative = amount < 0;
  const formattedAmount = `${isNegative ? '-' : '+'}${formatCurrency(Math.abs(amount), preferences.currency)}`;

  const displayTitle =
    installmentTotal != null && installmentTotal > 1 && installmentIndex != null
      ? `${title} ${installmentIndex}/${installmentTotal}`
      : title;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${displayTitle}, ${formattedAmount}`}
      style={styles.container}
    >
      <AvatarIcon icon={IconComponent} iconColor={iconColor} size={36} />

      {/* Título e descrição — flex: 1 para não colidir com o lado direito */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{displayTitle}</Text>
        {description != null && (
          <Text style={styles.description} numberOfLines={1}>{description}</Text>
        )}
      </View>

      {/* Valor e badge — alinhados à direita */}
      <View style={styles.right}>
        <Text style={[styles.amount, isNegative ? styles.negative : styles.positive]}>
          {formattedAmount}
        </Text>
        <StatusBadge variant={badgeVariant} label={badgeLabel} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,   // 12px
    paddingHorizontal: 20,         // 20px — não existe token entre spacing.lg (16) e spacing.xl (24)
    backgroundColor: colors.white,
    gap: spacing.lg,               // 16px entre avatar e bloco de info
  },
  info: {
    flex: 1,                       // Ocupa o espaço disponível e empurra o bloco direito
    gap: spacing.xs,               // 4px entre título e descrição
  },
  title: {
    fontSize: fs.md,               // 16px
    fontWeight: fw.medium,
    color: colors.content,
  },
  description: {
    fontSize: fs.sm,               // 14px
    fontWeight: fw.regular,
    color: colors.subcontent,
  },
  right: {
    alignItems: 'flex-end',        // Badge e valor alinhados à direita
    gap: spacing.xs,               // 4px entre valor e badge
    flexShrink: 0,                 // Não encolhe — valor e badge sempre visíveis
  },
  amount: {
    fontSize: fs.md,               // 16px
    fontWeight: fw.semibold,
  },
  negative: {
    color: colors.danger,
  },
  positive: {
    color: colors.success,
  },
});