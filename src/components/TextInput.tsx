import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

type TextInputProps = RNTextInputProps & {
  label?: string;
  helperText?: string;   // Texto de apoio abaixo do input — boolean implícito pela presença
  disabled?: boolean;
};

export function TextInput({
  label,
  helperText,
  disabled = false,
  value,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  // Define a espessura e cor da linha com base no estado atual
  const isFilled = value != null && value.length > 0;
  const borderColor = focused ? colors.content : colors.border;
  const borderWidth = focused ? 2 : 1;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>

      {/* Label — só renderiza se foi passada */}
      {label != null && (
        <Text style={styles.label}>{label}</Text>
      )}

      {/* Campo de texto com linha inferior */}
      <RNTextInput
        {...rest}
        value={value}
        editable={!disabled}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          {
            borderBottomColor: borderColor,
            borderBottomWidth: borderWidth,
            // Texto preenchido usa content; placeholder é controlado por placeholderTextColor
            color: isFilled ? colors.content : colors.muted,
          },
        ]}
      />

      {/* Helper text — só renderiza se foi passado */}
      {helperText != null && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: fs.md,           // 16px
    fontWeight: fw.regular,
    color: colors.content,
    marginBottom: 6,           // 6px — não existe token para esse valor
  },
  input: {
    fontSize: fs.md,           // 16px
    fontWeight: fw.regular,
    paddingVertical: spacing.sm, // 8px
    paddingHorizontal: 0,        // Sem padding horizontal — linha vai de ponta a ponta
  },
  helperText: {
    fontSize: fs.sm,           // 12px — texto de apoio menor que o input
    fontWeight: fw.regular,
    color: colors.muted,
    marginTop: 6,              // 6px — mesma distância da label ao input
    textAlign: 'left',
  },
});