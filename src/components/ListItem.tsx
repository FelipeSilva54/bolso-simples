import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { CaretRight } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

type ListItemProps = {
  icon: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function ListItem({
  icon: IconComponent,
  label,
  onPress,
  accessibilityLabel,
}: ListItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={styles.container}
    >
      <IconComponent size={24} color={colors.muted} weight="regular" />

      <Text style={styles.label} numberOfLines={1}>{label}</Text>

      <CaretRight size={16} color={colors.muted} weight="regular" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: spacing.lg,   // 16px
    backgroundColor: colors.white,
    gap: spacing.lg,                 // 16px entre ícone e texto
  },
  label: {
    flex: 1,                         // Empurra o chevron para a direita
    fontSize: fs.md,                 // 16px
    fontWeight: fw.medium,
    color: colors.content,
  },
});