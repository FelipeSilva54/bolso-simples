import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

type MenuItem = { label: string; icon?: string; destructive?: boolean; disabled?: boolean };

function DropdownMenu({
  trigger,
  items,
}: {
  trigger: React.ReactNode;
  items: MenuItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <TouchableOpacity onPress={() => setOpen(true)}>{trigger}</TouchableOpacity>

      <Modal transparent visible={open} onRequestClose={() => setOpen(false)} animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {items.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.item, i < items.length - 1 && styles.itemBorder]}
                disabled={item.disabled}
                onPress={() => setOpen(false)}
              >
                {item.icon && <Text style={styles.icon}>{item.icon}</Text>}
                <Text
                  style={[
                    styles.label,
                    item.destructive && { color: colors.danger },
                    item.disabled && { color: colors.muted },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function TriggerBtn({ label }: { label: string }) {
  return (
    <View style={styles.triggerBtn}>
      <Text style={styles.triggerText}>{label} ▾</Text>
    </View>
  );
}

export function MenuScreen() {
  return (
    <ScreenWrapper>
      <Section title="Menu de ações (toque no botão)">
        <Label text="Ações de transação" />
        <DropdownMenu
          trigger={<TriggerBtn label="Opções" />}
          items={[
            { label: 'Marcar como pago', icon: '✅' },
            { label: 'Editar', icon: '✏️' },
            { label: 'Duplicar', icon: '📋' },
            { label: 'Excluir', icon: '🗑️', destructive: true },
          ]}
        />

        <Label text="Filtros de visualização" />
        <DropdownMenu
          trigger={<TriggerBtn label="Filtrar" />}
          items={[
            { label: 'Todos' },
            { label: 'Receitas' },
            { label: 'Despesas' },
            { label: 'Pendentes' },
          ]}
        />

        <Label text="Com item desabilitado" />
        <DropdownMenu
          trigger={<TriggerBtn label="Mais" />}
          items={[
            { label: 'Exportar PDF', icon: '📄' },
            { label: 'Exportar CSV', icon: '📊', disabled: true },
            { label: 'Compartilhar', icon: '🔗', disabled: true },
          ]}
        />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 200,
    paddingLeft: 40,
  },
  menu: {
    backgroundColor: colors.card,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    minWidth: 180,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: {
    fontSize: 16,
    width: 22,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.text,
  },
  triggerBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
