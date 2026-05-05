import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants';

type AvatarIconProps = {
  icon: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
  iconColor: string;   // Cor de fundo do círculo — vem da categoria
  size?: number;       // Tamanho do círculo — padrão 36px conforme DESIGN.md
};

export function AvatarIcon({ icon: IconComponent, iconColor, size = 36 }: AvatarIconProps) {
  // O ícone ocupa metade do tamanho do círculo — proporção visual equilibrada
  const iconSize = size / 2;

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2, // Sempre metade do tamanho — garante círculo perfeito
          backgroundColor: iconColor,
        },
      ]}
    >
      <IconComponent size={iconSize} color={colors.white} weight="regular" />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0, // Não encolhe dentro de layouts flex
  },
});