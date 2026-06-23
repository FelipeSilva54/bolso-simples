import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import AppText from '@/components/AppText';
import { CheckCircleIcon } from 'phosphor-react-native';
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
        <View style={styles.content}>
          {variant === 'default' && (
            <CheckCircleIcon weight="fill" color={colors.successLight} size={fs.xl} style={styles.icon} />
          )}
          <AppText style={styles.text}>{message ?? ''}</AppText>
        </View>
      </Animated.View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.xxl,
    right: spacing.xxl,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.white,
    textAlign: 'left',
  },
});
