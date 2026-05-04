import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, ScreenWrapper, Section, Label } from './_shared';

const TRANSACTIONS = [
  { category: '🍔', desc: 'Alimentação', date: '01/10', value: '-R$ 45,90', status: 'Pago', statusColor: colors.success },
  { category: '🚗', desc: 'Transporte', date: '02/10', value: '-R$ 12,50', status: 'Pago', statusColor: colors.success },
  { category: '🏠', desc: 'Aluguel', date: '05/10', value: '-R$ 800,00', status: 'Não pago', statusColor: colors.warning },
  { category: '💰', desc: 'Salário', date: '05/10', value: '+R$ 3.500,00', status: 'Recebido', statusColor: colors.success },
  { category: '📚', desc: 'Educação', date: '10/10', value: '-R$ 199,90', status: 'Pago', statusColor: colors.success },
  { category: '💊', desc: 'Saúde', date: '15/10', value: '-R$ 85,00', status: 'Não pago', statusColor: colors.danger },
];

function TableRow({ category, desc, date, value, status, statusColor, isHeader = false }: {
  category?: string;
  desc: string;
  date: string;
  value: string;
  status: string;
  statusColor?: string;
  isHeader?: boolean;
}) {
  return (
    <View style={[styles.row, isHeader && styles.headerRow]}>
      <View style={styles.colCategory}>
        {!isHeader && category ? <Text>{category}</Text> : <Text style={styles.headerText}>{desc.slice(0, 4)}</Text>}
      </View>
      <View style={styles.colDesc}>
        <Text style={[styles.cell, isHeader && styles.headerText]} numberOfLines={1}>{desc}</Text>
      </View>
      <View style={styles.colDate}>
        <Text style={[styles.cell, isHeader && styles.headerText]}>{date}</Text>
      </View>
      <View style={styles.colValue}>
        <Text
          style={[
            styles.cell,
            styles.valueCell,
            isHeader && styles.headerText,
            !isHeader && { color: value.startsWith('+') ? colors.success : colors.danger },
          ]}
        >
          {value}
        </Text>
      </View>
      <View style={styles.colStatus}>
        {isHeader ? (
          <Text style={styles.headerText}>{status}</Text>
        ) : (
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export function TableScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tabela de transações">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <TableRow
              isHeader
              desc="Descrição"
              date="Data"
              value="Valor"
              status="Status"
            />
            {TRANSACTIONS.map((t, i) => (
              <View key={i}>
                <TableRow {...t} />
                {i < TRANSACTIONS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </ScrollView>
      </Section>

      <Section title="Resumo mensal">
        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Receitas</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>R$ 3.500,00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Despesas</Text>
            <Text style={[styles.summaryValue, { color: colors.danger }]}>R$ 1.143,30</Text>
          </View>
          <View style={styles.divider} />
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={[styles.summaryLabel, { fontWeight: '700' }]}>Saldo do Mês</Text>
            <Text style={[styles.summaryValue, { fontWeight: '700', color: colors.success }]}>R$ 2.356,70</Text>
          </View>
        </View>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  headerRow: {
    backgroundColor: colors.mutedLight,
    borderRadius: 6,
    marginBottom: 4,
  },
  cell: {
    fontSize: 13,
    color: colors.text,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  valueCell: {
    fontWeight: '600',
    textAlign: 'right',
  },
  colCategory: { width: 36, alignItems: 'center' },
  colDesc: { width: 120, paddingHorizontal: 4 },
  colDate: { width: 60, alignItems: 'center' },
  colValue: { width: 96, alignItems: 'flex-end' },
  colStatus: { width: 90, alignItems: 'center' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  summaryTable: {
    gap: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryTotal: {
    backgroundColor: colors.mutedLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
