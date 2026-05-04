import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function SwitchDemo({
  value = false,
  disabled = false,
  onChange,
}: {
  value?: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const bg = disabled ? colors.border : value ? colors.primary : '#D1D5DB';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onChange?.(!value)}
      style={[styles.track, { backgroundColor: bg, opacity: disabled ? 0.5 : 1 }]}
    >
      <View
        style={[
          styles.thumb,
          { transform: [{ translateX: value ? 20 : 2 }] },
        ]}
      />
    </TouchableOpacity>
  );
}

function SwitchRow({ label, initialValue = false, disabled = false }: { label: string; initialValue?: boolean; disabled?: boolean }) {
  const [value, setValue] = useState(initialValue);
  return (
    <View style={styles.row}>
      <Text style={[styles.label, disabled && { color: colors.muted }]}>{label}</Text>
      <SwitchDemo value={value} disabled={disabled} onChange={setValue} />
    </View>
  );
}

export function SwitchScreen() {
  return (
    <ScreenWrapper>
      <Section title="Estados">
        <Label text="Off" />
        <SwitchDemo value={false} />
        <Label text="On" />
        <SwitchDemo value={true} />
        <Label text="Disabled off" />
        <SwitchDemo value={false} disabled />
        <Label text="Disabled on" />
        <SwitchDemo value={true} disabled />
      </Section>

      <Section title="Com label (interativo)">
        <SwitchRow label="Ocultar saldo" initialValue={false} />
        <SwitchRow label="Notificações" initialValue={true} />
        <SwitchRow label="Tema escuro" initialValue={false} />
        <SwitchRow label="Sincronização automática" initialValue={true} disabled />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: colors.text,
  },
});
