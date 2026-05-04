import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function PressableDemo({
  label,
  onPress,
  feedback = 'opacity',
}: {
  label: string;
  onPress?: () => void;
  feedback?: 'opacity' | 'highlight' | 'scale';
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={feedback === 'opacity' ? 0.5 : feedback === 'highlight' ? 0.9 : 1}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.pressable,
        pressed && feedback === 'highlight' && styles.pressed,
        pressed && feedback === 'scale' && { transform: [{ scale: 0.97 }] },
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PressableScreen() {
  const [count, setCount] = useState(0);

  return (
    <ScreenWrapper>
      <Section title="Feedbacks de toque">
        <Label text="Opacity (padrão)" />
        <PressableDemo label="Toque — feedback de opacidade" feedback="opacity" />

        <Label text="Highlight" />
        <PressableDemo label="Toque — feedback de highlight" feedback="highlight" />

        <Label text="Scale" />
        <PressableDemo label="Toque — feedback de escala" feedback="scale" />
      </Section>

      <Section title="Interativo (contador)">
        <PressableDemo
          label={`Toque aqui: ${count} ×`}
          onPress={() => setCount((c) => c + 1)}
        />
      </Section>

      <Section title="Pressable como card">
        <TouchableOpacity style={styles.card} activeOpacity={0.8}>
          <View style={styles.cardIcon}>
            <Text style={{ fontSize: 20 }}>💳</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Conta Corrente</Text>
            <Text style={styles.cardSub}>Toque para ver detalhes</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </Section>

      <Section title="Pressable como item de lista">
        {['Alimentação', 'Transporte', 'Lazer'].map((item) => (
          <TouchableOpacity key={item} style={styles.listItem} activeOpacity={0.6}>
            <Text style={styles.itemText}>{item}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryDark,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 20,
    color: colors.border,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemText: {
    fontSize: 14,
    color: colors.text,
  },
});
