import React, { useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import {
  CalendarBlank,
  CalendarDot,
  CalendarCheck,
  ListBullets,
  Funnel,
  Check,
} from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { BottomSheet } from '@/components/BottomSheet';
import { PeriodMode } from '@/types/period';
import { useLanguage } from '@/store/LanguageContext';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

type Option = {
  mode: PeriodMode;
  label: string;
  icon: IconComponent;
};

type PeriodPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  currentMode: PeriodMode;
  onSelectMode: (mode: PeriodMode) => void;
};

export function PeriodPickerSheet({
  visible,
  onClose,
  currentMode,
  onSelectMode,
}: PeriodPickerSheetProps) {
  const { t } = useLanguage();

  const options = useMemo<Option[]>(() => [
    { mode: 'monthly', label: t('period.monthly'), icon: CalendarBlank as IconComponent },
    { mode: 'daily', label: t('period.daily'), icon: CalendarDot as IconComponent },
    { mode: 'yearly', label: t('period.yearly'), icon: CalendarCheck as IconComponent },
    { mode: 'all', label: t('period.all'), icon: ListBullets as IconComponent },
    { mode: 'custom', label: t('period.custom'), icon: Funnel as IconComponent },
  ], [t]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.wrapper}>
        <AppText style={styles.title}>{t('period.title')}</AppText>
        {options.map((option) => {
          const isActive = option.mode === currentMode;
          const Icon = option.icon;
          return (
            <TouchableOpacity
              key={option.mode}
              style={[styles.row, isActive && styles.rowActive]}
              onPress={() => onSelectMode(option.mode)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected: isActive }}
            >
              <Icon
                size={22}
                color={isActive ? colors.success : colors.primary}
                weight="regular"
              />
              <AppText style={[styles.rowLabel, isActive && styles.rowLabelActive]}>
                {option.label}
              </AppText>
              {isActive && <Check size={18} color={colors.success} weight="bold" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  title: {
    fontSize: fs.lg,
    fontWeight: fw.semibold,
    color: colors.content,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    borderRadius: radius.sm,
  },
  rowActive: {
    backgroundColor: colors.successLight,
  },
  rowLabel: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
  },
  rowLabelActive: {
    fontWeight: fw.semibold,
    color: colors.success, 
  },
});
