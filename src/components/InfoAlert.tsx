import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type InfoAlertProps = {
  children: React.ReactNode; // Aceita texto simples ou Text com trechos em bold
};

export function InfoAlert({ children }: InfoAlertProps) {
  return (
    <View style={styles.container}>
      {/* Ícone alinhado ao topo para não centralizar quando o texto tem múltiplas linhas */}
      <Info
        size={16}
        color={colors.info}
        weight="regular"
        style={styles.icon}
      />
      <Text style={styles.text}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Ícone gruda no topo quando texto quebra em mais de uma linha
    backgroundColor: colors.infoLight,
    borderRadius: radius.sm,         // 4px
    paddingHorizontal: spacing.lg,   // 16px
    paddingVertical: spacing.md,     // 12px
    gap: spacing.sm,                 // 8px
  },
  icon: {
    marginTop: 1, // Alinha opticamente o ícone com a primeira linha do texto
  },
  text: {
    flex: 1, // Ocupa o espaço restante e quebra linha corretamente
    fontSize: fs.sm,           // 14px
    fontWeight: fw.regular,
    color: colors.info,
    lineHeight: 20,
  },
});