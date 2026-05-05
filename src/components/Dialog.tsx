import React from 'react';
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

type DialogProps = {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function Dialog({
  visible,
  title,
  description,
  confirmLabel = 'Excluir',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>

          <View style={styles.iconCircle}>
            <Trash size={24} color={colors.danger} weight="regular" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <Button variant="outlined" onPress={onCancel}>
                {cancelLabel}
              </Button>
            </View>
            <View style={styles.actionButton}>
              <Button variant="danger" onPress={onConfirm}>
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
    borderRadius: radius.md,        // 8px
    padding: spacing.xl,            // 24px
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,       // 16px entre ícone e conteúdo
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,                // 12px entre título e descrição
    marginBottom: spacing.xl,       // 20px entre conteúdo e botões
  },
  title: {
    fontSize: fs.lg,                // 18px
    fontWeight: fw.bold,
    color: colors.content,
    textAlign: 'center',
  },
  description: {
    fontSize: fs.sm,                // 14px
    fontWeight: fw.regular,
    color: colors.subcontent,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,                // 8px entre botões
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
});