import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { X, ArrowsClockwise, Check } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type BadgeVariant = 'danger' | 'success' | 'info';

type StatusBadgeProps = {
  variant: BadgeVariant;
  label: string;
};

// Mapa de cores por variante — fundo e conteúdo (ícone + texto)
const variantConfig: Record<BadgeVariant, { background: string; color: string }> = {
  danger:  { background: colors.dangerLight,  color: colors.danger  },
  success: { background: colors.successLight, color: colors.success },
  info:    { background: colors.infoLight,    color: colors.info    },
};

// Mapa de ícones por variante — todos 12x12 conforme especificado
function BadgeIcon({ variant, color }: { variant: BadgeVariant; color: string }) {
  const props = { size: 12, color, weight: 'bold' } as const;

  if (variant === 'danger')  return <X {...props} />;
  if (variant === 'info')    return <ArrowsClockwise {...props} />;
  return <Check {...props} />;
}

export function StatusBadge({ variant, label }: StatusBadgeProps) {
  const { background, color } = variantConfig[variant];

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <BadgeIcon variant={variant} color={color} />
      <AppText style={[styles.label, { color }]}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end', // Não estica — ocupa só o espaço do conteúdo
    borderRadius: radius.xs,         // 2px
    gap: 6,                          // Não existe token de 6px — valor pontual aprovado
    paddingHorizontal: spacing.sm,   // 8px
    paddingVertical: spacing.xs,     // 4px
  },
  label: {
    fontSize: fs.xs,        // 12px
    fontWeight: fw.medium,
    letterSpacing: 0.6,     // Leve tracking em caixa alta melhora legibilidade
  },
});