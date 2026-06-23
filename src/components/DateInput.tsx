import React, { useRef, useState } from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CalendarBlank } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { useLanguage } from '@/store/LanguageContext';

type DateInputProps = {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
};

function formatDateLabel(
  date: Date,
  labels: { today: string; yesterday: string; tomorrow: string },
): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diff === 0) return labels.today;
  if (diff === -1) return labels.yesterday;
  if (diff === 1) return labels.tomorrow;

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
  const { t } = useLanguage();
  const [showPicker, setShowPicker] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const dateLabels = {
    today: t('date.today'),
    yesterday: t('date.yesterday'),
    tomorrow: t('date.tomorrow'),
  };

  const hasError = error != null && error.length > 0;

  const handlePress = () => {
    if (disabled) return;
    Animated.timing(focusAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    setShowPicker(true);
  };

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    Animated.timing(focusAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    setShowPicker(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>

      {label != null && (
        <AppText style={styles.label}>{label}</AppText>
      )}

      <View style={styles.inputWrapper}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label ?? t('date.selectDate')}
          style={styles.input}
        >
          <AppText style={styles.valueText}>
            {formatDateLabel(value, dateLabels)}
          </AppText>
          <CalendarBlank size={24} color={colors.content} weight="regular" />
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