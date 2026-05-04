import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

const OPTIONS = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Salário', 'Freelance'];

function Select({
  placeholder = 'Selecione uma opção',
  state = 'default',
  options = OPTIONS,
}: {
  placeholder?: string;
  state?: 'default' | 'open' | 'error' | 'disabled';
  options?: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const isError = state === 'error';
  const isDisabled = state === 'disabled';

  const borderColor = isError ? colors.danger : open ? colors.primary : colors.border;

  return (
    <View>
      <TouchableOpacity
        style={[styles.select, { borderColor, opacity: isDisabled ? 0.6 : 1 }]}
        disabled={isDisabled}
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.value, !selected && { color: colors.muted }]}>
          {selected ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>
      {isError && <Text style={styles.error}>Selecione uma categoria</Text>}

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {options.map((o) => (
              <TouchableOpacity
                key={o}
                style={[styles.option, selected === o && styles.optionSelected]}
                onPress={() => { setSelected(o); setOpen(false); }}
              >
                <Text style={[styles.optionText, selected === o && { color: colors.primary, fontWeight: '600' }]}>{o}</Text>
                {selected === o && <Text style={{ color: colors.primary }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export function SelectScreen() {
  return (
    <ScreenWrapper>
      <Section title="Estados">
        <Label text="Default (sem seleção)" />
        <Select />
        <Label text="Error" />
        <Select state="error" />
        <Label text="Disabled" />
        <Select state="disabled" />
      </Section>

      <Section title="Casos de uso">
        <Label text="Categoria de transação" />
        <Select placeholder="Selecione a categoria" options={OPTIONS} />
        <Label text="Mês" />
        <Select placeholder="Selecione o mês" options={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']} />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.card,
  },
  value: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  chevron: {
    fontSize: 16,
    color: colors.textMuted,
  },
  error: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  optionSelected: {
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    fontSize: 15,
    color: colors.text,
  },
});
