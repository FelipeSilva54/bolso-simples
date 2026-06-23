import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AppText from '@/components/AppText';
import { CaretRight, Check } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { BottomSheet } from '@/components/BottomSheet';
import { AvatarIcon } from '@/components/AvatarIcon';
import { SearchInput } from '@/components/SearchInput';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export type SelectOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
  iconColor?: string;
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
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const focusAnim = useRef(new Animated.Value(0)).current;

  const hasError = error != null && error.length > 0;

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleOpen = () => {
    if (disabled) return;
    Animated.timing(focusAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    setOpen(true);
  };

  const handleClose = () => {
    Animated.timing(focusAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    setOpen(false);
    setSearch('');
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    handleClose();
  };

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>

      {label != null && (
        <AppText style={styles.label}>{label}</AppText>
      )}

      <View style={styles.inputWrapper}>
        <TouchableOpacity
          onPress={handleOpen}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label ?? 'Selecionar opção'}
          style={styles.input}
        >
          {selectedOption?.icon != null && selectedOption.iconColor != null && (
            <AvatarIcon icon={selectedOption.icon} iconColor={selectedOption.iconColor} size={24} />
          )}
          <AppText style={[styles.valueText, !selectedOption && styles.placeholder]}>
            {selectedOption ? selectedOption.label : placeholder}
          </AppText>
          <CaretRight size={20} color={colors.content} weight="regular" />
        </TouchableOpacity>

        <View style={styles.borderBase} />
        {!hasError && (
          <Animated.View style={[styles.borderActive, styles.borderFocus, { opacity: focusAnim }]} />
        )}
        {hasError && <View style={[styles.borderActive, styles.borderError]} />}
      </View>

      {(hasError || helperText != null) && (
        <AppText style={[styles.helperText, hasError && styles.errorText]}>
          {error ?? helperText}
        </AppText>
      )}

      <BottomSheet visible={open} onClose={handleClose} height={SCREEN_HEIGHT * 0.85}>
        {sheetTitle != null && (
          <AppText style={styles.sheetTitle}>{sheetTitle}</AppText>
        )}

        {searchable && (
          <View style={styles.searchWrapper}>
            <SearchInput
              value={search}
              onChangeText={setSearch}
              onClear={() => setSearch('')}
              accessibilityLabel="Buscar opção"
            />
          </View>
        )}

        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          style={styles.listFlex}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            searchable ? (
              <AppText style={styles.emptyText}>Nenhuma categoria encontrada</AppText>
            ) : null
          }
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
                {item.icon != null && item.iconColor != null && (
                  <AvatarIcon icon={item.icon} iconColor={item.iconColor} size={36} />
                )}
                <AppText style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {item.label}
                </AppText>
                {isSelected && (
                  <Check size={18} color={colors.success} weight="bold" />
                )}
              </TouchableOpacity>
            );
          }}
        />
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
    marginBottom: 4,
  },
  inputWrapper: {
    width: '100%',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: 0,
    gap: spacing.md,
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
  sheetTitle: {
    fontSize: fs.lg,
    fontWeight: fw.semibold,
    color: colors.content,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  searchWrapper: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  list: {
    flexGrow: 0,
  },
  listFlex: {
    flexGrow: 0,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
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
  emptyText: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});