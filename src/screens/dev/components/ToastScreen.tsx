import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const TOAST_CONFIG: Record<ToastType, { bg: string; icon: string }> = {
  success: { bg: colors.success, icon: '✅' },
  error: { bg: colors.danger, icon: '❌' },
  warning: { bg: colors.warning, icon: '⚠️' },
  info: { bg: colors.primary, icon: 'ℹ️' },
};

function Toast({ message, type, visible }: { message: string; type: ToastType; visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const cfg = TOAST_CONFIG[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  return (
    <Animated.View style={[styles.toast, { backgroundColor: cfg.bg, opacity, transform: [{ translateY }] }]}>
      <Text style={styles.icon}>{cfg.icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

function ToastDemo({ message, type, label }: { message: string; type: ToastType; label: string }) {
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 2500);
  };

  return (
    <View>
      <Label text={label} />
      <TouchableOpacity style={styles.trigger} onPress={show}>
        <Text style={styles.triggerText}>Mostrar toast {type}</Text>
      </TouchableOpacity>
      <Toast message={message} type={type} visible={visible} />
    </View>
  );
}

export function ToastScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tipos (toque para exibir)">
        <ToastDemo type="success" message="Transação salva com sucesso!" label="Success" />
        <ToastDemo type="error" message="Erro ao salvar. Tente novamente." label="Error" />
        <ToastDemo type="warning" message="Saldo da carteira está negativo." label="Warning" />
        <ToastDemo type="info" message="Sincronização concluída." label="Info" />
      </Section>

      <Section title="Preview estático">
        <View style={styles.previewList}>
          {(['success', 'error', 'warning', 'info'] as ToastType[]).map((t) => (
            <View key={t} style={[styles.previewToast, { backgroundColor: TOAST_CONFIG[t].bg }]}>
              <Text style={styles.icon}>{TOAST_CONFIG[t].icon}</Text>
              <Text style={styles.message}>Mensagem de {t}</Text>
            </View>
          ))}
        </View>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  icon: {
    fontSize: 16,
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
  },
  trigger: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  previewList: {
    gap: 8,
  },
  previewToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
});
