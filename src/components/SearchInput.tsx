import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MagnifyingGlass, XCircle } from 'phosphor-react-native';
import { colors, fontSize as fs, spacing, radius } from '@/constants';

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  accessibilityLabel?: string;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onClear,
  accessibilityLabel,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const borderColor = focused ? colors.content : colors.border;

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      <MagnifyingGlass size={18} color={colors.muted} weight="regular" />

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={accessibilityLabel}
        style={styles.input}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Limpar busca"
        >
          <XCircle size={18} color={colors.muted} weight="fill" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.sm,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fs.md,
    color: colors.content,
    backgroundColor: 'transparent',
    padding: 0,
  },
});
