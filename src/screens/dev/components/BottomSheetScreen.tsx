import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snap = '50%',
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snap?: '25%' | '50%' | '75%' | '90%';
}) {
  const heights = { '25%': 220, '50%': 400, '75%': 580, '90%': 700 };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { height: heights[snap] }]}>
          <View style={styles.handle} />
          {title && (
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          <ScrollView contentContainerStyle={styles.content}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function BottomSheetScreen() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ScreenWrapper>
      <Section title="Snap points">
        <Label text="25% da tela" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('25')}>
          <Text style={styles.triggerText}>Abrir — 25%</Text>
        </TouchableOpacity>

        <Label text="50% da tela (padrão)" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('50')}>
          <Text style={styles.triggerText}>Abrir — 50%</Text>
        </TouchableOpacity>

        <Label text="75% da tela" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('75')}>
          <Text style={styles.triggerText}>Abrir — 75%</Text>
        </TouchableOpacity>

        <Label text="90% da tela" />
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('90')}>
          <Text style={styles.triggerText}>Abrir — 90%</Text>
        </TouchableOpacity>
      </Section>

      <Section title="Caso de uso: filtro de categorias">
        <TouchableOpacity style={styles.trigger} onPress={() => setActive('filter')}>
          <Text style={styles.triggerText}>Filtrar por categoria</Text>
        </TouchableOpacity>
      </Section>

      <BottomSheet visible={active === '25'} onClose={() => setActive(null)} title="Bottom Sheet 25%" snap="25%">
        <Text style={styles.bodyText}>Conteúdo compacto.</Text>
      </BottomSheet>

      <BottomSheet visible={active === '50'} onClose={() => setActive(null)} title="Bottom Sheet 50%" snap="50%">
        <Text style={styles.bodyText}>Conteúdo médio. Bom para formulários simples e listas curtas.</Text>
      </BottomSheet>

      <BottomSheet visible={active === '75'} onClose={() => setActive(null)} title="Bottom Sheet 75%" snap="75%">
        <Text style={styles.bodyText}>Conteúdo grande. Ideal para listas longas ou formulários completos.</Text>
      </BottomSheet>

      <BottomSheet visible={active === '90'} onClose={() => setActive(null)} title="Bottom Sheet 90%" snap="90%">
        <Text style={styles.bodyText}>Quase tela cheia. Para conteúdo denso.</Text>
      </BottomSheet>

      <BottomSheet visible={active === 'filter'} onClose={() => setActive(null)} title="Filtrar categorias" snap="75%">
        {['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Salário', 'Freelance', 'Investimentos', 'Outros'].map((c) => (
          <TouchableOpacity key={c} style={styles.filterItem} onPress={() => setActive(null)}>
            <Text style={styles.filterText}>{c}</Text>
            <Text style={{ color: colors.border }}>○</Text>
          </TouchableOpacity>
        ))}
      </BottomSheet>
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
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
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
  },
  content: {
    padding: 20,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
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
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterText: {
    fontSize: 15,
    color: colors.text,
  },
});
