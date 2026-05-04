import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function FormField({
  label,
  helper,
  error,
  required = false,
  value,
  placeholder,
}: {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  value?: string;
  placeholder?: string;
}) {
  const hasError = !!error;

  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <TextInput
        style={[styles.input, hasError && { borderColor: colors.danger }]}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={value}
      />
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

export function FormControlScreen() {
  return (
    <ScreenWrapper>
      <Section title="Com label">
        <FormField label="Nome" placeholder="Digite seu nome" />
      </Section>

      <Section title="Com label + obrigatório">
        <FormField label="E-mail" required placeholder="seu@email.com" />
      </Section>

      <Section title="Com helper text">
        <FormField
          label="Valor"
          helper="Use ponto para casas decimais: 1500.00"
          placeholder="0,00"
        />
      </Section>

      <Section title="Com erro">
        <FormField
          label="Valor"
          required
          error="Valor deve ser maior que zero"
          value="0"
        />
      </Section>

      <Section title="Formulário completo — Nova transação">
        <FormField label="Descrição" required placeholder="Ex: Aluguel outubro" />
        <FormField
          label="Valor"
          required
          helper="Sempre positivo — o tipo define entrada ou saída"
          placeholder="0,00"
        />
        <FormField label="Data" required value="01/10/2025" />
        <FormField
          label="Observação"
          helper="Opcional"
          placeholder="Detalhes adicionais..."
        />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  required: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.card,
  },
  helper: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  error: {
    fontSize: 11,
    color: colors.danger,
    lineHeight: 16,
  },
});
