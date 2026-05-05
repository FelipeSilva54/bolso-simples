import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

type TabProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function Tab({ label, active, onPress, accessibilityLabel }: TabProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={styles.container}
    >
      <Text style={[styles.label, active && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    minHeight: 44,
  },
  label: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
  },
  labelActive: {
    fontWeight: fw.bold,
    color: colors.content,
  },
});