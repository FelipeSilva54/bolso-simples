import React, { useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { PencilSimple } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

type TransactionType = 'expense' | 'income';

type TransactionTypeHeaderProps = {
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
  value: string;
  onValueChange: (value: string) => void;
};

const headerColors: Record<TransactionType, string> = {
  expense: '#C0392B',
  income: colors.success,
};

// Formata dígitos digitados para o padrão de moeda brasileiro
// Ex: digitar "1" → "R$ 0,01" | "125" → "R$ 1,25" | "1250" → "R$ 12,50"
function formatCurrency(input: string): string {
  const digits = input.replace(/\D/g, '');
  const number = parseInt(digits || '0', 10) / 100;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function TransactionTypeHeader({
  type,
  onTypeChange,
  value,
  onValueChange,
}: TransactionTypeHeaderProps) {
  const valueInputRef = useRef<TextInput>(null);

  const colorAnim = useRef(new Animated.Value(type === 'expense' ? 0 : 1)).current;
  const tabAnim = useRef(new Animated.Value(type === 'expense' ? 0 : 1)).current;

  function handleTypeChange(newType: TransactionType) {
    if (newType === type) return;
    onTypeChange(newType);

    const toValue = newType === 'expense' ? 0 : 1;

    Animated.spring(colorAnim, {
      toValue,
      useNativeDriver: false, // false — animando backgroundColor (propriedade de layout)
      bounciness: 0,
      speed: 16,
    }).start();

    Animated.spring(tabAnim, {
      toValue,
      useNativeDriver: true, // true — animando transform (propriedade nativa)
      bounciness: 4,
      speed: 20,
    }).start();
  }

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [headerColors.expense, headerColors.income],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>

      <TypeSelector
        type={type}
        tabAnim={tabAnim}
        onTypeChange={handleTypeChange}
      />

      <View style={{ height: spacing.xl }} />

      <Text style={styles.valueLabel}>Valor</Text>

      <TouchableOpacity
        style={styles.valueRow}
        activeOpacity={0.7}
        onPress={() => valueInputRef.current?.focus()}
        accessibilityLabel="Editar valor da transação"
      >
        <TextInput
          ref={valueInputRef}
          value={value}
          onChangeText={(text) => onValueChange(formatCurrency(text))}
          keyboardType="numeric"
          style={styles.valueInput}
          placeholderTextColor="rgba(255,255,255,0.6)"
          placeholder="R$ 0,00"
          selectionColor="rgba(255,255,255,0.8)"
        />
        <PencilSimple size={20} color={colors.white} weight="regular" />
      </TouchableOpacity>

    </Animated.View>
  );
}

function TypeSelector({
  type,
  tabAnim,
  onTypeChange,
}: {
  type: TransactionType;
  tabAnim: Animated.Value;
  onTypeChange: (type: TransactionType) => void;
}) {
  const [containerWidth, setContainerWidth] = useState(0);
  const tabWidth = containerWidth / 2;

  const indicatorX = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  return (
    <View
      style={styles.typeSelector}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.typeIndicator,
            { width: tabWidth, transform: [{ translateX: indicatorX }] },
          ]}
        />
      )}

      <Pressable
        style={styles.typeButton}
        onPress={() => onTypeChange('expense')}
        accessibilityRole="tab"
        accessibilityState={{ selected: type === 'expense' }}
        accessibilityLabel="Despesa"
      >
        <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
          Despesa
        </Text>
      </Pressable>

      <Pressable
        style={styles.typeButton}
        onPress={() => onTypeChange('income')}
        accessibilityRole="tab"
        accessibilityState={{ selected: type === 'income' }}
        accessibilityLabel="Receita"
      >
        <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
          Receita
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,   // 16px
  },
  typeSelector: {
    flexDirection: 'row',
    height: 44,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  typeIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderRadius: radius.full,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  typeText: {
    fontSize: fs.lg,               // 18px
    fontWeight: fw.medium,
    color: 'rgba(255,255,255,0.7)',
  },
  typeTextActive: {
    color: colors.content,
    fontWeight: fw.semibold,
  },
  valueLabel: {
    fontSize: fs.lg,               // 18px
    fontWeight: fw.regular,
    color: colors.white,
    marginBottom: spacing.xs,      // 4px
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,               // 8px entre valor e ícone
  },
  valueInput: {
    fontSize: fs.xxxl,             // 36px
    fontWeight: fw.medium,
    color: colors.white,
    padding: 0,                    // Remove padding nativo do Android
    flexShrink: 1,
  },
});