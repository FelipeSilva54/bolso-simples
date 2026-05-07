import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Plus } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type FABProps = {
  onPress: () => void;
  label?: string;           // Opcional — sem label renderiza só o ícone "+"
  disabled?: boolean;
  accessibilityLabel: string; // Obrigatório — regra de acessibilidade do DESIGN.md
  style?: ViewStyle;          // Permite passar position: absolute + bottom/right de fora
};

export function FAB({
  onPress,
  label,
  disabled = false,
  accessibilityLabel,
  style,
}: FABProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={[
        styles.base,
        // Muda o shape dependendo de ter label ou não
        label != null ? styles.withLabel : styles.iconOnly,
        disabled && styles.disabled,
        // O style externo vem por último para sobrescrever — é aqui que entra
        // o position: absolute, bottom e right definidos pela tela
        style,
      ]}
    >
      <Plus size={20} color={colors.white} weight="regular" />

      {/* Texto só renderiza se label foi passado */}
      {label != null && (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: spacing.xxxxl,          // 48px
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    gap: spacing.xs,               // 4px entre ícone e texto

    // Sombra padrão de FAB
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: spacing.sm },
    shadowOpacity: 0.3,
    shadowRadius: spacing.md,
    elevation: 6, // Android
  },

  // Modo só ícone: quadrado 48x48
  iconOnly: {
    width: spacing.xxxl,
  },

  // Modo com label: cresce horizontalmente
  withLabel: {
    paddingHorizontal: spacing.lg, // 16px
  },

  label: {
    fontSize: fs.md,               // 16px
    fontWeight: fw.regular,
    color: colors.white,
  },

  disabled: {
    opacity: 0.5,
  },
});