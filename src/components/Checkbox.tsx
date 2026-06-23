import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import AppText from '@/components/AppText';
import { Check } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type CheckboxProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  accessibilityLabel: string; // Obrigatório — regra de acessibilidade do DESIGN.md
};

const BOX_SIZE = 22; // Tamanho do quadrado visual

export function Checkbox({
  value,
  onValueChange,
  label,
  disabled = false,
  accessibilityLabel,
}: CheckboxProps) {
  // Anima a escala do ícone de check: começa em 0 (invisível) e vai a 1 (visível).
  // Isso dá um feedback visual tátil ao marcar — sem animação pareceria travado.
  const checkScale = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkScale, {
      toValue: value ? 1 : 0,
      useNativeDriver: true, // Roda na thread nativa — melhor performance
      bounciness: 6,
    }).start();
  }, [value]);

  function handlePress() {
    if (!disabled) {
      onValueChange(!value);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      // Área de toque generosa — regra do DESIGN.md (mínimo 44x44px)
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      // Acessibilidade: leitor de tela anuncia como checkbox com estado atual
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      style={[styles.container, disabled && styles.disabled]}
    >
      {/* Caixa do checkbox */}
      <View
        style={[
          styles.box,
          value ? styles.boxChecked : styles.boxUnchecked,
        ]}
      >
        {/* Ícone de check com animação de escala */}
        <Animated.View style={{ transform: [{ scale: checkScale }] }}>
          <Check
            size={14}
            color={colors.white}
            weight="bold"
          />
        </Animated.View>
      </View>

      {/* Label opcional ao lado — clicável junto com a caixa */}
      {label != null && (
        <AppText style={[styles.label, value && styles.labelChecked]}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start', // Não ocupa largura total — evita área de toque enorme
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxUnchecked: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  boxChecked: {
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  label: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
  },
  labelChecked: {
    // Label não muda visualmente quando marcado — clareza acima de estética
    // Mas mantemos o hook aqui caso queira adicionar cor ou strikethrough futuramente
    color: colors.content,
  },
  disabled: {
    opacity: 0.4,
  },
});