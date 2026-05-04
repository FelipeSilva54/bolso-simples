import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

type Action = { label: string; icon?: string; destructive?: boolean; disabled?: boolean };

function ActionSheet({
  visible,
  onClose,
  title,
  actions,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  actions: Action[];
}) {
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {title && (
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
          {actions.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.action, i < actions.length - 1 && styles.actionBorder]}
              disabled={a.disabled}
              onPress={onClose}
            >
              {a.icon && <Text style={styles.actionIcon}>{a.icon}</Text>}
              <Text
                style={[
                  styles.actionLabel,
                  a.destructive && { color: colors.danger },
                  a.disabled && { color: colors.muted },
                ]}
              >
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.action, styles.cancelAction]} onPress={onClose}>
            <Text style={[styles.actionLabel, { fontWeight: '700' }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function ActionSheetScreen() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ScreenWrapper>
      <Section title="Ações de transação">
        <Label text="Toque para abrir" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('transaction')}>
          <Text style={styles.triggerText}>Ações da transação</Text>
        </TouchableOpacity>
      </Section>

      <Section title="Ações de carteira">
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('wallet')}>
          <Text style={styles.triggerText}>Ações da carteira</Text>
        </TouchableOpacity>
      </Section>

      <ActionSheet
        visible={active === 'transaction'}
        onClose={() => setActive(null)}
        title="Alimentação — R$ 45,90"
        actions={[
          { label: 'Marcar como pago', icon: '✅' },
          { label: 'Editar transação', icon: '✏️' },
          { label: 'Duplicar', icon: '📋' },
          { label: 'Excluir transação', icon: '🗑️', destructive: true },
        ]}
      />

      <ActionSheet
        visible={active === 'wallet'}
        onClose={() => setActive(null)}
        title="Conta Corrente"
        actions={[
          { label: 'Editar carteira', icon: '✏️' },
          { label: 'Transferir para outra carteira', icon: '↔️', disabled: true },
          { label: 'Excluir carteira', icon: '🗑️', destructive: true },
        ]}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    paddingHorizontal: 16,
  },
  titleRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  actionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  actionLabel: {
    fontSize: 16,
    color: colors.text,
  },
  cancelAction: {
    marginTop: 8,
    backgroundColor: colors.mutedLight,
    borderRadius: 12,
    justifyContent: 'center',
    paddingVertical: 16,
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
