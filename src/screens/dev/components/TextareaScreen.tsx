import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Textarea({
  placeholder = 'Digite uma observação...',
  state = 'default',
  value,
  rows = 4,
}: {
  placeholder?: string;
  state?: 'default' | 'focused' | 'error' | 'disabled';
  value?: string;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const isError = state === 'error';
  const isFocused = state === 'focused' || focused;
  const isDisabled = state === 'disabled';

  const borderColor = isError ? colors.danger : isFocused ? colors.primary : colors.border;

  return (
    <View>
      <TextInput
        style={[
          styles.textarea,
          { borderColor, height: rows * 24, opacity: isDisabled ? 0.6 : 1 },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={value}
        editable={!isDisabled}
        multiline
        textAlignVertical="top"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {isError && <Text style={styles.error}>Campo obrigatório</Text>}
    </View>
  );
}

export function TextareaScreen() {
  return (
    <ScreenWrapper>
      <Section title="Estados">
        <Label text="Default" />
        <Textarea />
        <Label text="Com valor" />
        <Textarea value="Pagamento via PIX para João. Referente ao aluguel de outubro de 2025." />
        <Label text="Focused" />
        <Textarea state="focused" placeholder="Escreva uma observação..." />
        <Label text="Error" />
        <Textarea state="error" value="texto inválido aqui" />
        <Label text="Disabled" />
        <Textarea state="disabled" placeholder="Não editável" />
      </Section>

      <Section title="Tamanhos (linhas)">
        <Label text="2 linhas" />
        <Textarea rows={2} placeholder="Textarea pequeno..." />
        <Label text="4 linhas (padrão)" />
        <Textarea rows={4} placeholder="Textarea padrão..." />
        <Label text="6 linhas" />
        <Textarea rows={6} placeholder="Textarea grande..." />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.card,
  },
  error: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
  },
});
