import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PencilSimple, Trash } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { BottomSheet } from '@/components/BottomSheet';

type WalletActionsSheetProps = {
  walletId: string;
  walletName: string;
  isVisible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function WalletActionsSheet({
  walletName,
  isVisible,
  onClose,
  onEdit,
  onDelete,
}: WalletActionsSheetProps) {
  return (
    <BottomSheet visible={isVisible} onClose={onClose}>
      <View style={styles.wrapper}>
        <Text style={styles.title} numberOfLines={1}>
          {walletName}
        </Text>

        <TouchableOpacity
          style={styles.row}
          onPress={onEdit}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Editar carteira"
        >
          <PencilSimple size={22} color={colors.content} weight="regular" />
          <Text style={styles.rowLabel}>Editar carteira</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.row}
          onPress={onDelete}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Excluir carteira"
        >
          <Trash size={22} color={colors.danger} weight="regular" />
          <Text style={[styles.rowLabel, styles.rowLabelDanger]}>Excluir carteira</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
  },
  title: {
    fontSize: fs.lg,
    fontWeight: fw.semibold,
    color: colors.content,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderRadius: radius.sm,
  },
  rowLabel: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
  },
  rowLabelDanger: {
    color: colors.danger,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
});
