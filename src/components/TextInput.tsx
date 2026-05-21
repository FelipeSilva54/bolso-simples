import React, { useRef, useState } from 'react';
import {
  Animated,
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
  const focusAnim = useRef(new Animated.Value(0)).current;

  const isFilled = value != null && value.length > 0;
  const hasError = error != null && error.length > 0;

  function handleFocus(e: Parameters<NonNullable<RNTextInputProps['onFocus']>>[0]) {
    setFocused(true);
    Animated.timing(focusAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    rest.onFocus?.(e);
  }

  function handleBlur(e: Parameters<NonNullable<RNTextInputProps['onBlur']>>[0]) {
    setFocused(false);
    Animated.timing(focusAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    rest.onBlur?.(e);
  }

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>

      {label != null && (
        <Text style={styles.label}>{label}</Text>
      )}

      <RNTextInput
        {...rest}
        value={value}
        editable={!disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={colors.muted}
        style={[styles.input, { color: isFilled ? colors.content : colors.muted }]}
      />

      {/* Base border (always visible) */}
      <View style={styles.borderBase} />
      {/* Focus indicator fades in/out (hidden when error overrides) */}
      {!hasError && (
        <Animated.View style={[styles.borderActive, styles.borderFocus, { opacity: focusAnim }]} />
      )}
      {/* Error indicator (instant, on top) */}
      {hasError && <View style={[styles.borderActive, styles.borderError]} />}

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
    fontSize: fs.md,
    fontWeight: fw.regular,
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
  },
  borderBase: {
    height: 1,
    backgroundColor: colors.border,
  },
  borderActive: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  borderFocus: {
    backgroundColor: colors.content,
  },
  borderError: {
    backgroundColor: colors.danger,
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
