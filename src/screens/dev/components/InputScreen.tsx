import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function DemoInput({
  placeholder = 'Digite algo...',
  variant = 'outline',
  state = 'default',
  value,
  leftIcon,
  rightIcon,
  disabled = false,
}: {
  placeholder?: string;
  variant?: 'outline' | 'underlined' | 'rounded';
  state?: 'default' | 'focused' | 'error' | 'disabled';
  value?: string;
  leftIcon?: string;
  rightIcon?: string;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const isError = state === 'error';
  const isFocused = state === 'focused' || focused;
  const isDisabled = state === 'disabled' || disabled;

  const borderColor = isError
    ? colors.danger
    : isFocused
    ? colors.primary
    : colors.border;

  const containerStyle: object[] = [
    styles.inputContainer,
    variant === 'rounded' && { borderRadius: 24 },
    variant === 'outline' && { borderWidth: 1, borderRadius: 8, borderColor },
    variant === 'underlined' && {
      borderBottomWidth: 1,
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderRadius: 0,
      borderColor,
    },
    isDisabled && { backgroundColor: colors.mutedLight, opacity: 0.6 },
  ];

  return (
    <View>
      <View style={containerStyle}>
        {leftIcon ? <Text style={styles.icon}>{leftIcon}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          value={value}
          editable={!isDisabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightIcon ? <Text style={styles.icon}>{rightIcon}</Text> : null}
      </View>
      {isError && (
        <Text style={styles.errorText}>Campo obrigatório</Text>
      )}
    </View>
  );
}

export function InputScreen() {
  return (
    <ScreenWrapper>
      <Section title="Variante: Outline">
        <Label text="Default" />
        <DemoInput variant="outline" />
        <Label text="Com valor" />
        <DemoInput variant="outline" value="Felipe Silva" />
        <Label text="Focused" />
        <DemoInput variant="outline" state="focused" placeholder="Clique para focar..." />
        <Label text="Error" />
        <DemoInput variant="outline" state="error" value="texto inválido" />
        <Label text="Disabled" />
        <DemoInput variant="outline" state="disabled" placeholder="Desabilitado" />
      </Section>

      <Section title="Variante: Underlined">
        <Label text="Default" />
        <DemoInput variant="underlined" />
        <Label text="Focused" />
        <DemoInput variant="underlined" state="focused" />
        <Label text="Error" />
        <DemoInput variant="underlined" state="error" value="inválido" />
        <Label text="Disabled" />
        <DemoInput variant="underlined" state="disabled" />
      </Section>

      <Section title="Variante: Rounded">
        <Label text="Default" />
        <DemoInput variant="rounded" />
        <Label text="Error" />
        <DemoInput variant="rounded" state="error" />
      </Section>

      <Section title="Com Ícones">
        <Label text="Ícone à esquerda" />
        <DemoInput variant="outline" leftIcon="🔍" placeholder="Pesquisar..." />
        <Label text="Ícone à direita" />
        <DemoInput variant="outline" rightIcon="👁️" placeholder="Senha..." />
        <Label text="Ícones dos dois lados" />
        <DemoInput variant="outline" leftIcon="📧" rightIcon="✓" placeholder="E-mail..." />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    gap: 8,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 10,
  },
  icon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
  },
});
