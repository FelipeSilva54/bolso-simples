import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { CaretRight, Check } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { BottomSheet } from '@/components/BottomSheet';
import { TextInput } from '@/components/TextInput';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectInputProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  accessibilityLabel?: string;
  sheetTitle?: string;
  sheetHeight?: number;
};

export function SelectInput({
  label,
  placeholder = 'Selecione uma opção',
  options,
  value,
  onChange,
  helperText,
  error,
  disabled = false,
  searchable = false,
  accessibilityLabel,
  sheetTitle,
  sheetHeight,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  const hasError = error != null && error.length > 0;
  const borderColor = hasError ? colors.danger : focused ? colors.content : colors.border;
  const borderWidth = hasError || focused ? 2 : 1;

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleOpen = () => {
    if (disabled) return;
    setFocused(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFocused(false);
    setSearch('');
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    handleClose();
  };

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>

      {label != null && (
        <Text style={styles.label}>{label}</Text>
      )}

      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label ?? 'Selecionar opção'}
        style={[
          styles.input,
          {
            borderBottomColor: borderColor,
            borderBottomWidth: borderWidth,
          },
        ]}
      >
        <Text style={[styles.valueText, !selectedOption && styles.placeholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <CaretRight size={16} color={colors.muted} weight="regular" />
      </TouchableOpacity>

      {(hasError || helperText != null) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error ?? helperText}
        </Text>
      )}

      <BottomSheet visible={open} onClose={handleClose}>
        <View style={[styles.sheet, { maxHeight: sheetHeight ?? 420 }]}>

          {sheetTitle != null && (
            <Text style={styles.sheetTitle}>{sheetTitle}</Text>
          )}

          {searchable && (
            <View style={styles.searchWrapper}>
              <TextInput
                placeholder="Buscar..."
                value={search}
                onChangeText={setSearch}
                accessibilityLabel="Buscar opção"
              />
            </View>
          )}

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.listFlex}
            renderItem={({ item }) => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={item.label}
                  style={styles.option}
                >
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Check size={18} color={colors.success} weight="bold" />
                  )}
                </TouchableOpacity>
              );
            }}
          />

        </View>
      </BottomSheet>

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
    marginBottom: 6,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
  },
  valueText: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
    flex: 1,
  },
  placeholder: {
    color: colors.muted,
  },
  helperText: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.muted,
    marginTop: 6,
    textAlign: 'left',
  },
  errorText: {
    color: colors.danger,
  },
  sheet: {
    paddingHorizontal: spacing.lg,
  },
  sheetTitle: {
    fontSize: fs.lg,
    fontWeight: fw.semibold,
    color: colors.content,
    marginBottom: spacing.md,
  },
  searchWrapper: {
    marginBottom: spacing.sm,
  },
  list: {
    flexGrow: 0,
  },
  listFlex: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionLabel: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
    flex: 1,
  },
  optionLabelSelected: {
    fontWeight: fw.semibold,
    color: colors.success,
  },
});