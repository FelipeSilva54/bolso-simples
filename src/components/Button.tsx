import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type Variant = 'primary' | 'outlined' | 'danger' | 'dangerLight';
type Size = 'lg' | 'sm';

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  selected?: boolean;
  children: React.ReactNode;
};

const textColorMap: Record<Variant, string> = {
  primary: colors.white,
  outlined: colors.content,
  danger: colors.white,
  dangerLight: colors.danger,
};

export function Button({
  variant = 'primary',
  size = 'lg',
  onPress,
  disabled = false,
  loading = false,
  leftIcon,
  selected = false,
  children,
}: ButtonProps) {
  const isSelectedOutlined = variant === 'outlined' && selected;
  const textColor = isSelectedOutlined ? colors.white : textColorMap[variant];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        isSelectedOutlined && styles.outlinedSelected,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {leftIcon != null && <View style={styles.iconWrapper}>{leftIcon}</View>}
          <Text style={[styles.text, textSizeStyles[size], { color: textColor }]}>
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.primary },
  outlined: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.danger },
  dangerLight: { backgroundColor: colors.dangerLight },
});

const sizeStyles = StyleSheet.create({
  lg: { height: 48, paddingHorizontal: spacing.xl, borderRadius: radius.sm },
  sm: { height: 40, paddingHorizontal: spacing.md, borderRadius: radius.sm },
});

const textSizeStyles = StyleSheet.create({
  lg: { fontSize: fs.lg },
  sm: { fontSize: fs.md },
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedSelected: {
    backgroundColor: colors.success,
    borderWidth: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  iconWrapper: {
    marginRight: spacing.sm,
  },
  text: {
    fontWeight: fw.semibold,
  },
});
