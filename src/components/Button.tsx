import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type Variant = 'primary' | 'soft' | 'danger' | 'dangerLight';
type Size = 'lg' | 'sm';

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  selected?: boolean;
  accessibilityLabel?: string;
  children: React.ReactNode;
};

const textColorMap: Record<Variant, string> = {
  primary: colors.white,
  soft: colors.content,
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
  accessibilityLabel,
  children,
}: ButtonProps) {
  const isSelectedOutlined = variant === 'soft' && selected;
  const textColor = isSelectedOutlined ? colors.white : textColorMap[variant];

  const selectAnim = useRef(
    new Animated.Value(variant === 'soft' && selected ? 1 : 0)
  ).current;

  useEffect(() => {
    if (variant !== 'soft') return;
    Animated.timing(selectAnim, {
      toValue: selected ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [selected, variant, selectAnim]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        isSelectedOutlined && styles.softSelected,
        disabled && styles.disabled,
      ]}
    >
      {variant === 'soft' && (
        <Animated.View
          style={[styles.selectedOverlay, { opacity: selectAnim }]}
          pointerEvents="none"
        />
      )}
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
  soft: { backgroundColor: colors.background },
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
  softSelected: {
    borderColor: 'transparent',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.success,
    borderRadius: radius.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  iconWrapper: {
    marginRight: spacing.sm,
  },
  text: {
    fontWeight: fw.medium,
  },
});
