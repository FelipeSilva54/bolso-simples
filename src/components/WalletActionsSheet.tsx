import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
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
        <AppText style={styles.title} numberOfLines={1}>
          {walletName}
        </AppText>

        <TouchableOpacity
          style={styles.row}
          onPress={onEdit}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Editar carteira"
        >
          <PencilSimple size={22} color={colors.content} weight="regular" />
          <AppText style={styles.rowLabel}>Editar carteira</AppText>
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
          <AppText style={[styles.rowLabel, styles.rowLabelDanger]}>Excluir carteira</AppText>
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
    fontWeight: fw.medium,
    color: colors.content,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderRadius: radius.sm,
  },
  rowLabel: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
  },
  rowLabelDanger: {
    color: colors.danger,
  },
  separator: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
});
