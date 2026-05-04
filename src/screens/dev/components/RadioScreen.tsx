import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function RadioItem({
  label,
  selected = false,
  disabled = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.row}
      disabled={disabled}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        style={[
          styles.outer,
          { borderColor: selected ? colors.primary : '#9CA3AF', opacity: disabled ? 0.4 : 1 },
        ]}
      >
        {selected && <View style={styles.inner} />}
      </View>
      <Text style={[styles.label, disabled && { color: colors.muted }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function RadioGroup({ options }: { options: string[] }) {
  const [selected, setSelected] = useState(options[0]);
  return (
    <>
      {options.map((o) => (
        <RadioItem key={o} label={o} selected={selected === o} onPress={() => setSelected(o)} />
      ))}
    </>
  );
}

export function RadioScreen() {
  return (
    <ScreenWrapper>
      <Section title="Estados">
        <Label text="Não selecionado" />
        <RadioItem label="Opção não selecionada" />
        <Label text="Selecionado" />
        <RadioItem label="Opção selecionada" selected />
        <Label text="Disabled não selecionado" />
        <RadioItem label="Desabilitado" disabled />
        <Label text="Disabled selecionado" />
        <RadioItem label="Desabilitado selecionado" selected disabled />
      </Section>

      <Section title="Grupo — tipo de transação">
        <RadioGroup options={['Receita', 'Despesa']} />
      </Section>

      <Section title="Grupo — tipo de pagamento">
        <RadioGroup options={['À vista', 'Parcelado', 'Recorrente']} />
      </Section>

      <Section title="Grupo — status">
        <RadioGroup options={['Pago', 'Não pago']} />
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
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 14,
    color: colors.text,
  },
});
