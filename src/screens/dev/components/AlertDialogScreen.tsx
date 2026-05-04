import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function AlertDialog({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  confirmColor = colors.danger,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  confirmColor?: string;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: confirmColor }]}
              onPress={() => { onConfirm(); onClose(); }}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function AlertDialogScreen() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ScreenWrapper>
      <Section title="Confirmação de exclusão">
        <Label text="Excluir carteira" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('deleteWallet')}>
          <Text style={styles.triggerText}>🗑️  Excluir Carteira</Text>
        </TouchableOpacity>

        <Label text="Excluir transação" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('deleteTransaction')}>
          <Text style={styles.triggerText}>🗑️  Excluir Transação</Text>
        </TouchableOpacity>
      </Section>

      <Section title="Outras confirmações">
        <Label text="Logout" />
        <TouchableOpacity style={[styles.trigger, { backgroundColor: colors.dangerLight }]} onPress={() => setActive('logout')}>
          <Text style={[styles.triggerText, { color: '#991B1B' }]}>Sair da conta</Text>
        </TouchableOpacity>
      </Section>

      <AlertDialog
        visible={active === 'deleteWallet'}
        onClose={() => setActive(null)}
        onConfirm={() => {}}
        title="Excluir carteira?"
        description="Todas as transações desta carteira serão excluídas permanentemente. Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
      />
      <AlertDialog
        visible={active === 'deleteTransaction'}
        onClose={() => setActive(null)}
        onConfirm={() => {}}
        title="Excluir transação?"
        description="Esta transação será removida e o saldo da carteira será recalculado."
        confirmLabel="Excluir"
      />
      <AlertDialog
        visible={active === 'logout'}
        onClose={() => setActive(null)}
        onConfirm={() => {}}
        title="Sair da conta?"
        description="Você precisará fazer login novamente para acessar suas informações."
        confirmLabel="Sair"
        confirmColor="#6B7280"
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  dialog: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  trigger: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
