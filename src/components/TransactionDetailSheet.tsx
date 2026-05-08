import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trash, PencilSimple } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { BottomSheet } from '@/components/BottomSheet';
import { AvatarIcon } from '@/components/AvatarIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { InfoAlert } from '@/components/InfoAlert';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';

type TxStatus = 'paid' | 'unpaid' | 'received' | 'unreceived';

type TransactionDetailSheetProps = {
  visible: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    title: string;
    description?: string;
    amount: number;
    type: 'expense' | 'income';
    status: TxStatus;
    date: Date;
    isRecurring: boolean;
    icon: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
    iconColor: string;
  } | null;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, newStatus: TxStatus) => void;
};

function toggledStatus(type: 'expense' | 'income', current: TxStatus): TxStatus {
  if (type === 'expense') return current === 'paid' ? 'unpaid' : 'paid';
  return current === 'received' ? 'unreceived' : 'received';
}

function statusToggleLabel(type: 'expense' | 'income'): string {
  return type === 'expense' ? 'Já paguei' : 'Já recebi';
}

function statusBadge(status: TxStatus) {
  if (status === 'paid') return <StatusBadge variant="success" label="PAGO" />;
  if (status === 'unpaid') return <StatusBadge variant="danger" label="NÃO PAGO" />;
  if (status === 'received') return <StatusBadge variant="success" label="RECEBIDO" />;
  return <StatusBadge variant="danger" label="NÃO RECEBIDO" />;
}

export function TransactionDetailSheet({
  visible,
  onClose,
  transaction,
  onDelete,
  onEdit,
  onStatusChange,
}: TransactionDetailSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {transaction == null ? null : (
        <View style={styles.content}>

          {/* 1. Header */}
          <View style={styles.header} accessibilityLabel={`Transação: ${transaction.title}`}>
            <AvatarIcon icon={transaction.icon} iconColor={transaction.iconColor} size={36} />
            <Text style={styles.title} numberOfLines={1}>
              {transaction.title}
            </Text>
            <Text
              style={[
                styles.amount,
                { color: transaction.type === 'expense' ? colors.danger : colors.success },
              ]}
              numberOfLines={1}
            >
              {formatCurrency(
                transaction.type === 'expense' ? -transaction.amount : transaction.amount,
              )}
            </Text>
          </View>

          {/* 2. Descrição */}
          <View style={styles.descriptionSection}>
            <Text style={styles.infoLabel}>Descrição do item</Text>
            <Text style={styles.descriptionValue}>
              {transaction.description?.trim() || '—'}
            </Text>
          </View>

          {/* 3. Linhas de informação */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adicionada em:</Text>
              <Text style={styles.infoValue}>{formatDate(transaction.date)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tipo de pagamento:</Text>
              {transaction.isRecurring
                ? <StatusBadge variant="info" label="RECORRENTE" />
                : <StatusBadge variant="success" label="À VISTA" />
              }
            </View>

            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Status:</Text>
              {statusBadge(transaction.status)}
            </View>
          </View>

          {/* 4. Botões de ação */}
          <View style={styles.actions}>
            <View style={styles.actionItem}>
              <Button
                variant="dangerLight"
                size="sm"
                leftIcon={<Trash size={18} color={colors.danger} weight="fill" />}
                onPress={() => onDelete(transaction.id)}
              >
                Excluir
              </Button>
            </View>
            <View style={styles.actionItem}>
              <Button
                variant="outlined"
                size="sm"
                leftIcon={<PencilSimple size={18} color={colors.content} weight="fill" />}
                onPress={() => onEdit(transaction.id)}
              >
                Editar
              </Button>
            </View>
          </View>

          {/* 5. Toggle de status */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              {statusToggleLabel(transaction.type)}
            </Text>
            <Toggle
              value={
                transaction.type === 'expense'
                  ? transaction.status === 'paid'
                  : transaction.status === 'received'
              }
              onValueChange={() =>
                onStatusChange(
                  transaction.id,
                  toggledStatus(transaction.type, transaction.status),
                )
              }
              accessibilityLabel={statusToggleLabel(transaction.type)}
            />
          </View>

          {/* 6. Info alert */}
          <InfoAlert>
            {'Despesas '}
            <Text style={styles.infoTextBold}>não pagas</Text>
            {' e receitas '}
            <Text style={styles.infoTextBold}>não recebidas</Text>
            {' não são consideradas no saldo do mês.'}
          </InfoAlert>

        </View>
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.semibold,
    color: colors.content,
  },
  amount: {
    fontSize: fs.lg,
    fontWeight: fw.bold,
    flexShrink: 0,
  },

  // Descrição
  descriptionSection: {
    gap: spacing.xs,
    paddingBottom: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  descriptionValue: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
    lineHeight: fs.sm * 1.5,
  },

  // Info rows
  infoSection: {
    marginTop: -spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
    flex: 1,
  },
  infoValue: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
    textAlign: 'right',
    flexShrink: 1,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionItem: {
    flex: 1,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
  },

  // Bold text dentro do InfoAlert
  infoTextBold: {
    fontWeight: fw.bold,
  },
});