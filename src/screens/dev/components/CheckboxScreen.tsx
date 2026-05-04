import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Checkbox({
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
}: {
  label: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const borderColor = disabled ? colors.border : checked || indeterminate ? colors.primary : '#9CA3AF';
  const bgColor = checked || indeterminate ? colors.primary : 'transparent';

  return (
    <TouchableOpacity
      style={styles.row}
      disabled={disabled}
      activeOpacity={0.7}
      onPress={() => onChange?.(!checked)}
    >
      <View
        style={[
          styles.box,
          { borderColor, backgroundColor: bgColor, opacity: disabled ? 0.4 : 1 },
        ]}
      >
        {indeterminate && !checked && (
          <View style={styles.dash} />
        )}
        {checked && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
      <Text style={[styles.label, disabled && { color: colors.muted }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function InteractiveCheckbox({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return <Checkbox label={label} checked={checked} onChange={setChecked} />;
}

export function CheckboxScreen() {
  return (
    <ScreenWrapper>
      <Section title="Estados">
        <Label text="Desmarcado" />
        <Checkbox label="Opção desmarcada" />
        <Label text="Marcado" />
        <Checkbox label="Opção marcada" checked />
        <Label text="Indeterminado" />
        <Checkbox label="Opção indeterminada" indeterminate />
        <Label text="Disabled desmarcado" />
        <Checkbox label="Desabilitado" disabled />
        <Label text="Disabled marcado" />
        <Checkbox label="Desabilitado marcado" checked disabled />
      </Section>

      <Section title="Interativo">
        <InteractiveCheckbox label="Marcar como pago" />
        <InteractiveCheckbox label="Notificações ativas" />
        <InteractiveCheckbox label="Ocultar saldo por padrão" />
      </Section>

      <Section title="Grupo — selecionar múltiplos">
        <Checkbox label="Alimentação" checked />
        <Checkbox label="Transporte" />
        <Checkbox label="Moradia" checked />
        <Checkbox label="Saúde" />
        <Checkbox label="Lazer" checked />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
  },
  dash: {
    width: 10,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  label: {
    fontSize: 14,
    color: colors.text,
  },
});
