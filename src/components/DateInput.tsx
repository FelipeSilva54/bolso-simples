import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarBlank } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

type DateInputProps = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
};

// Retorna "Ontem", "Hoje", "Amanhã" ou dd/mm/aaaa
function formatDateLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return 'Hoje';
  if (diff === -1) return 'Ontem';
  if (diff === 1) return 'Amanhã';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function DateInput({
  label,
  value,
  onChange,
  helperText,
  error,
  disabled = false,
  accessibilityLabel,
}: DateInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [focused, setFocused] = useState(false);

  const hasError = error != null && error.length > 0;
  const borderColor = hasError ? colors.danger : focused ? colors.content : colors.border;
  const borderWidth = hasError || focused ? 2 : 1;

  const handlePress = () => {
    if (disabled) return;
    setFocused(true);
    setShowPicker(true);
  };

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    setFocused(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>

      {label != null && (
        <Text style={styles.label}>{label}</Text>
      )}

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label ?? 'Selecionar data'}
        style={[
          styles.input,
          {
            borderBottomColor: borderColor,
            borderBottomWidth: borderWidth,
          },
        ]}
      >
        <Text style={styles.valueText}>
          {formatDateLabel(value)}
        </Text>
        <CalendarBlank size={20} color={colors.muted} weight="regular" />
      </TouchableOpacity>

      {(hasError || helperText != null) && (
        <Text style={[styles.helperText, hasError && styles.errorText]}>
          {error ?? helperText}
        </Text>
      )}

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'android' ? 'default' : 'spinner'}
          onChange={handleChange}
          locale="pt-BR"
        />
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
    marginBottom: 6,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
  },
  valueText: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
    flex: 1,
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
});