import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Card({
  children,
  elevated = false,
  outlined = false,
}: {
  children: React.ReactNode;
  elevated?: boolean;
  outlined?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        elevated && styles.elevated,
        outlined && styles.outlined,
      ]}
    >
      {children}
    </View>
  );
}

export function CardScreen() {
  return (
    <ScreenWrapper>
      <Section title="Variantes">
        <Label text="Default (flat)" />
        <Card>
          <Text style={styles.title}>Carteira Principal</Text>
          <Text style={styles.subtitle}>R$ 3.250,00</Text>
        </Card>

        <Label text="Outlined" />
        <Card outlined>
          <Text style={styles.title}>Poupança</Text>
          <Text style={styles.subtitle}>R$ 12.800,00</Text>
        </Card>

        <Label text="Elevated" />
        <Card elevated>
          <Text style={styles.title}>Investimentos</Text>
          <Text style={styles.subtitle}>R$ 45.000,00</Text>
        </Card>
      </Section>

      <Section title="Card de carteira (contexto real)">
        <View style={[styles.card, styles.walletCard]}>
          <View style={styles.walletHeader}>
            <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.walletName}>Conta Corrente</Text>
          </View>
          <Text style={styles.walletBalance}>R$ 3.250,00</Text>
          <View style={styles.walletFooter}>
            <View>
              <Text style={styles.walletMeta}>Receitas</Text>
              <Text style={[styles.walletMetaValue, { color: colors.success }]}>+R$ 5.200</Text>
            </View>
            <View>
              <Text style={styles.walletMeta}>Despesas</Text>
              <Text style={[styles.walletMetaValue, { color: colors.danger }]}>-R$ 1.950</Text>
            </View>
          </View>
        </View>
      </Section>

      <Section title="Card de transação">
        <Card outlined>
          <View style={styles.transactionRow}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.primaryLight }]}>
              <Text>🍔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.transactionTitle}>Alimentação</Text>
              <Text style={styles.transactionDate}>01/10/2025</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.transactionAmount, { color: colors.danger }]}>-R$ 45,90</Text>
              <Text style={[styles.transactionStatus, { color: colors.success }]}>Pago</Text>
            </View>
          </View>
        </Card>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  walletCard: {
    borderRadius: 16,
    gap: 8,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  walletName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  walletFooter: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  walletMeta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  walletMetaValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  transactionStatus: {
    fontSize: 11,
    fontWeight: '500',
  },
});
