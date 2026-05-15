import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Trash } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';

type DialogProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  requireConfirmation?: boolean;
  confirmationLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function Dialog({
  visible,
  title,
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  requireConfirmation = false,
  confirmationLabel = 'Entendo as consequências desta ação',
  loading = false,
  onConfirm,
  onCancel,
}: DialogProps) {
  const [checked, setChecked] = useState(false);

  function handleCancel() {
    setChecked(false);
    onCancel();
  }

  function handleConfirm() {
    setChecked(false);
    onConfirm();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.backdrop} onPress={handleCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>

          <View style={styles.iconCircle}>
            <Trash size={32} color={colors.danger} weight="regular" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          {requireConfirmation && (
            <View style={styles.checkboxRow}>
              <Checkbox
                value={checked}
                onValueChange={setChecked}
                label={confirmationLabel}
                accessibilityLabel={confirmationLabel}
              />
            </View>
          )}

          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <Button variant="outlined" size="sm" onPress={handleCancel}>
                {cancelLabel}
              </Button>
            </View>
            <View style={styles.actionButton}>
              <Button
                variant="danger"
                size="sm"
                disabled={(requireConfirmation && !checked) || loading}
                loading={loading}
                onPress={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </View>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 36,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fs.xl,
    fontWeight: fw.semibold,
    color: colors.content,
    textAlign: 'center',
  },
  description: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
    textAlign: 'center',
    lineHeight: 24,
  },
  checkboxRow: {
    marginBottom: spacing.xl,
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
});