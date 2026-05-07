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
  helperText?: string;
  error?: string;      // Mensagem de erro — presença ativa o estado de erro
  disabled?: boolean;
};

export function TextInput({
  label,
  helperText,
  error,
  disabled = false,
  value,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const isFilled = value != null && value.length > 0;
  const hasError = error != null && error.length > 0;

  // Erro sempre vence — linha vermelha independente de foco
  const borderColor = hasError ? colors.danger : focused ? colors.content : colors.border;
  const borderWidth = hasError || focused ? 2 : 1;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>

      {label != null && (
        <Text style={styles.label}>{label}</Text>
      )}

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
            color: isFilled ? colors.content : colors.muted,
          },
        ]}
      />

      {/* Erro tem prioridade sobre helperText quando os dois forem passados */}
      {(hasError || helperText != null) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error ?? helperText}
        </Text>
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
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
    marginBottom: 6,           // 6px — não existe token para esse valor
  },
  input: {
    fontSize: fs.lg,
    fontWeight: fw.regular,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  helperText: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.muted,
    marginTop: 6,              // 6px — mesma distância da label ao input
    textAlign: 'left',
  },
  errorText: {
    color: colors.danger,
  },
});