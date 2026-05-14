import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Portal } from '@/components/PortalProvider';
import { colors, fontSize as fs, fontWeight as fw, radius, spacing } from '@/constants';

type ToastVariant = 'default' | 'success' | 'error';

type ToastProps = {
  message: string | null;
  variant?: ToastVariant;
};

let _id = 0;

const bgColorMap: Record<ToastVariant, string> = {
  default: colors.primary,
  success: colors.success,
  error: colors.danger,
};

export function Toast({ message, variant = 'default' }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const portalId = useRef(`toast-${_id++}`).current;
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (!message) return;
    opacity.stopAnimation();
    opacity.setValue(0);
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [message, opacity]);

  return (
    <Portal id={portalId}>
      <Animated.View
        pointerEvents="none"
        style={[styles.container, { opacity, bottom: bottom + spacing.xxl, backgroundColor: bgColorMap[variant] }]}
      >
        <Text style={styles.text}>{message ?? ''}</Text>
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.xxl,
    right: spacing.xxl,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  text: {
    fontSize: fs.sm,
    fontWeight: fw.medium,
    color: colors.white,
    textAlign: 'center',
  },
});
