import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  AccessibilityRole,
} from 'react-native';
import { colors, spacing } from '@/constants';

// Dimensões do toggle definidas em constantes locais para fácil manutenção.
// Seguindo a regra do projeto: sem valores numéricos hardcoded no StyleSheet.
const TOGGLE_WIDTH = 51;
const TOGGLE_HEIGHT = 31;
const THUMB_SIZE = 27; // O círculo interno ("polegar")
const THUMB_OFFSET = 2; // Distância da borda quando está em off

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel: string; // Obrigatório: segue a regra de acessibilidade do DESIGN.md
};

export function Toggle({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: ToggleProps) {
  // useRef guarda o valor da animação sem re-renderizar o componente.
  // Iniciamos em 0 (off) ou 1 (on) dependendo do estado inicial.
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;

  // Sempre que `value` muda externamente, disparamos a animação.
  // spring dá um leve "quique" natural, mais tátil que timing puro.
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 1 : 0,
      useNativeDriver: true, // Roda na thread nativa: melhor performance
      bounciness: 4,
    }).start();
  }, [value]);

  // Interpolamos o valor 0–1 da animação para pixels reais.
  // Quando off (0): thumb fica a 2px da borda esquerda.
  // Quando on (1): thumb vai até a borda direita com 2px de margem.
  const thumbTranslation = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_OFFSET, TOGGLE_WIDTH - THUMB_SIZE - THUMB_OFFSET],
  });

  // Cor de fundo também anima: cinza (off) → verde (on).
  // Usamos colors.border e colors.success do nosso design system.
  const backgroundColor = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.success],
  });

  function handlePress() {
    if (!disabled) {
      onValueChange(!value);
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      // Acessibilidade: informa leitores de tela que é um switch e o estado atual
      accessibilityRole={'switch' as AccessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      // Garante área mínima de toque de 44x44px (regra do DESIGN.md)
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.pressable, disabled && styles.disabled]}
    >
      {/* Fundo animado */}
      <Animated.View style={[styles.track, { backgroundColor }]}>
        {/* Polegar animado */}
        <Animated.View
          style={[
            styles.thumb,
            { transform: [{ translateX: thumbTranslation }] },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    // Sem padding aqui; o hitSlop cuida do toque mínimo sem afetar o visual
  },
  track: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    borderRadius: TOGGLE_HEIGHT / 2, // Pílula perfeita
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.white,
    // Sombra sutil para o thumb parecer elevado sobre o track
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: spacing.xs / 2 },
    shadowOpacity: 0.15,
    shadowRadius: spacing.xs,
    elevation: 2, // Android
  },
  disabled: {
    opacity: 0.4,
  },
});