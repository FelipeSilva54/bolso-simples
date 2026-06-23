import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { StatusBadge } from '@/components/StatusBadge';
import { AvatarIcon } from '@/components/AvatarIcon';
type BadgeVariant = 'danger' | 'success' | 'info';

type TransactionItemProps = {
  id: string;
  icon: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
  iconColor: string;    // Cor de fundo do círculo do avatar
  title: string;
  description?: string;
  amount: number;       // Valor da transação — positivo ou negativo
  badgeVariant: BadgeVariant;
  badgeLabel: string;
  installmentIndex?: number;
  installmentTotal?: number;
  onPress: (id: string) => void;
};

export const TransactionItem = React.memo(function TransactionItem({
  id,
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
  const isNegative = amount < 0;
  const formattedAmount = `${isNegative ? '-' : '+'}R$ ${Math.abs(amount)
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

  const displayTitle =
    installmentTotal != null && installmentTotal > 1 && installmentIndex != null
      ? `${title} ${installmentIndex}/${installmentTotal}`
      : title;

  const handlePress = useCallback(() => onPress(id), [onPress, id]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${displayTitle}, ${formattedAmount}`}
      style={styles.container}
    >
      <AvatarIcon icon={IconComponent} iconColor={iconColor} size={36} />

      {/* Título e descrição — flex: 1 para não colidir com o lado direito */}
      <View style={styles.info}>
        <AppText style={styles.title} numberOfLines={1}>{displayTitle}</AppText>
        {description != null && (
          <AppText style={styles.description} numberOfLines={1}>{description}</AppText>
        )}
      </View>

      {/* Valor e badge — alinhados à direita */}
      <View style={styles.right}>
        <AppText style={[styles.amount, isNegative ? styles.negative : styles.positive]}>
          {formattedAmount}
        </AppText>
        <StatusBadge variant={badgeVariant} label={badgeLabel} />
      </View>
    </TouchableOpacity>
  );
});

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
