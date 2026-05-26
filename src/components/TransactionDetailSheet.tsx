import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trash, PencilSimple } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { BottomSheet } from '@/components/BottomSheet';
import { AvatarIcon } from '@/components/AvatarIcon';
import { StatusBadge } from '@/components/StatusBadge';
import { PaymentTypeBadge } from '@/components/PaymentTypeBadge';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { InfoAlert } from '@/components/InfoAlert';
import { Dialog } from '@/components/Dialog';
import { formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';
import { formatDate } from '@/utils/date';
import { useLanguage } from '@/store/LanguageContext';

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
    installmentIndex?: number;
    installmentTotal?: number;
  } | null;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onStatusChange: (id: string, newStatus: TxStatus) => void;
};

function toggledStatus(type: 'expense' | 'income', current: TxStatus): TxStatus {
  if (type === 'expense') return current === 'paid' ? 'unpaid' : 'paid';
  return current === 'received' ? 'unreceived' : 'received';
}


export function TransactionDetailSheet({
  visible,
  onClose,
  transaction,
  onDelete,
  onEdit,
  onStatusChange,
}: TransactionDetailSheetProps) {
  const { preferences } = usePreferences();
  const { t } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function statusToggleLabel(type: 'expense' | 'income'): string {
    return type === 'expense' ? t('transaction.alreadyPaid') : t('transaction.alreadyReceived');
  }

  function statusBadge(status: TxStatus) {
    if (status === 'paid') return <StatusBadge variant="success" label={t('transaction.detailBadgePaid')} />;
    if (status === 'unpaid') return <StatusBadge variant="danger" label={t('transaction.detailBadgeNotPaid')} />;
    if (status === 'received') return <StatusBadge variant="success" label={t('transaction.detailBadgeReceived')} />;
    return <StatusBadge variant="danger" label={t('transaction.detailBadgeNotReceived')} />;
  }

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {transaction == null ? null : (
        <View style={styles.wrapper}>

          <View style={styles.content}>

            {/* 1. Avatar + valor */}
            <View style={styles.avatarRow}>
              <AvatarIcon icon={transaction.icon} iconColor={transaction.iconColor} size={56} />
              <Text
                style={[
                  styles.amount,
                  { color: transaction.type === 'expense' ? colors.danger : colors.success },
                ]}
                numberOfLines={1}
              >
                {formatCurrency(
                  transaction.type === 'expense' ? -transaction.amount : transaction.amount,
                  preferences.currency,
                )}
              </Text>
            </View>

            {/* 2. Título + observação */}
            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={1}>
                {transaction.installmentTotal != null &&
                transaction.installmentTotal > 1 &&
                transaction.installmentIndex != null
                  ? `${transaction.title} ${transaction.installmentIndex}/${transaction.installmentTotal}`
                  : transaction.title}
              </Text>
              {transaction.description?.trim() ? (
                <Text style={styles.description}>
                  {transaction.description.trim()}
                </Text>
              ) : null}
            </View>

            {/* 3. Divider */}
            <View style={styles.divider} />

            {/* 4. Linhas de informação */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('transaction.detailAddedOn')}</Text>
                <Text style={styles.infoValue}>{formatDate(transaction.date)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('transaction.detailPaymentType')}</Text>
                {transaction.isRecurring
                  ? <PaymentTypeBadge variant="recurring" />
                  : transaction.installmentTotal != null && transaction.installmentTotal > 1
                  ? <PaymentTypeBadge variant="installment" />
                  : <PaymentTypeBadge variant="cash" />
                }
              </View>

              <View style={[styles.infoRow, styles.infoRowLast]}>
                <Text style={styles.infoLabel}>{t('transaction.detailStatus')}</Text>
                {statusBadge(transaction.status)}
              </View>
            </View>

            {/* 5. Toggle dentro de box */}
            <View style={styles.toggleBox}>
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

          </View>

          {/* Footer — InfoAlert + botões */}
          <View style={styles.footer}>
            <InfoAlert>
              {t('transaction.detailInfoPrefix')}
              <Text style={styles.infoTextBold}>{t('transaction.detailInfoBold1')}</Text>
              {t('transaction.detailInfoMiddle')}
              <Text style={styles.infoTextBold}>{t('transaction.detailInfoBold2')}</Text>
              {t('transaction.detailInfoSuffix')}
            </InfoAlert>

            <View style={styles.actions}>
              <View style={styles.actionItem}>
                <Button
                  variant="dangerLight"
                  size="sm"
                  leftIcon={<Trash size={18} color={colors.danger} weight="fill" />}
                  onPress={() => setShowDeleteDialog(true)}
                >
                  {t('transaction.detailDeleteButton')}
                </Button>
              </View>
              <View style={styles.actionItem}>
                <Button
                  variant="outlined"
                  size="sm"
                  leftIcon={<PencilSimple size={18} color={colors.content} weight="fill" />}
                  onPress={() => onEdit(transaction.id)}
                >
                  {t('transaction.detailEditButton')}
                </Button>
              </View>
            </View>
          </View>

        </View>
      )}

      {transaction != null && (
        <Dialog
          visible={showDeleteDialog}
          variant="delete"
          title={t('transaction.detailDeleteTitle')}
          description={t('transaction.detailDeleteDescription')}
          confirmLabel={t('transaction.detailDeleteButton')}
          cancelLabel={t('common.cancel')}
          onCancel={() => setShowDeleteDialog(false)}
          onConfirm={() => {
            onDelete(transaction.id);
            setShowDeleteDialog(false);
          }}
        />
      )}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },

  // Avatar + valor
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: fs.xl,
    fontWeight: fw.bold,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },

  // Título + descrição
  titleSection: {
    gap: spacing.xs,
  },
  title: {
    fontSize: fs.xl,
    fontWeight: fw.bold,
    color: colors.content,
  },
  description: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },

  // Info rows
  infoSection: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  infoRowLast: {},
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

  // Toggle box
  toggleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  toggleLabel: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
  },

  // Footer
  footer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionItem: {
    flex: 1,
  },

  // Bold text dentro do InfoAlert
  infoTextBold: {
    fontWeight: fw.bold,
  },
});