import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function DemoModal({
  visible,
  onClose,
  title,
  children,
  size = 'md',
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}) {
  const widths = { sm: '70%', md: '90%', lg: '95%', full: '100%' };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { width: widths[size] as any }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>{children}</View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onClose}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function ModalScreen() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <ScreenWrapper>
      <Section title="Tamanhos">
        <Label text="Small (70%)" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActiveModal('sm')}>
          <Text style={styles.triggerText}>Abrir Modal Small</Text>
        </TouchableOpacity>

        <Label text="Medium (90%)" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActiveModal('md')}>
          <Text style={styles.triggerText}>Abrir Modal Medium</Text>
        </TouchableOpacity>

        <Label text="Large (95%)" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActiveModal('lg')}>
          <Text style={styles.triggerText}>Abrir Modal Large</Text>
        </TouchableOpacity>
      </Section>

      <Section title="Casos de uso">
        <Label text="Adicionar carteira" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActiveModal('wallet')}>
          <Text style={styles.triggerText}>Abrir — Nova Carteira</Text>
        </TouchableOpacity>
      </Section>

      <DemoModal visible={activeModal === 'sm'} onClose={() => setActiveModal(null)} title="Modal Small" size="sm">
        <Text style={styles.bodyText}>Conteúdo do modal pequeno.</Text>
      </DemoModal>

      <DemoModal visible={activeModal === 'md'} onClose={() => setActiveModal(null)} title="Modal Medium" size="md">
        <Text style={styles.bodyText}>Conteúdo do modal médio com mais espaço para formulários e informações.</Text>
      </DemoModal>

      <DemoModal visible={activeModal === 'lg'} onClose={() => setActiveModal(null)} title="Modal Large" size="lg">
        <Text style={styles.bodyText}>Modal grande para formulários completos ou listas.</Text>
      </DemoModal>

      <DemoModal visible={activeModal === 'wallet'} onClose={() => setActiveModal(null)} title="Nova Carteira">
        <Text style={styles.labelText}>Nome</Text>
        <View style={styles.mockInput}><Text style={{ color: colors.muted }}>Ex: Conta Corrente</Text></View>
        <Text style={[styles.labelText, { marginTop: 12 }]}>Cor</Text>
        <View style={styles.colorRow}>
          {['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'].map(c => (
            <View key={c} style={[styles.colorDot, { backgroundColor: c }]} />
          ))}
        </View>
      </DemoModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    fontSize: 16,
    color: colors.textMuted,
    padding: 4,
  },
  body: {
    padding: 20,
    minHeight: 80,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
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
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
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
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  mockInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
});
