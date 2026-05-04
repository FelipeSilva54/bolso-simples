import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, Row, ScreenWrapper, Section } from './_shared';

function ImagePlaceholder({
  width,
  height,
  borderRadius = 0,
  label,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  label?: string;
}) {
  return (
    <View
      style={[
        styles.placeholder,
        { width: width as number, height, borderRadius },
      ]}
    >
      <Text style={styles.icon}>🖼️</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

export function ImageScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tamanhos">
        <Label text="Thumbnail (40×40)" />
        <ImagePlaceholder width={40} height={40} borderRadius={6} />
        <Label text="Ícone de categoria (48×48)" />
        <ImagePlaceholder width={48} height={48} borderRadius={10} />
        <Label text="Avatar (80×80)" />
        <ImagePlaceholder width={80} height={80} borderRadius={40} />
        <Label text="Banner (100%×160)" />
        <ImagePlaceholder width="100%" height={160} borderRadius={12} label="Banner" />
      </Section>

      <Section title="Border radius">
        <Row>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <ImagePlaceholder width={60} height={60} borderRadius={0} />
            <Text style={styles.note}>none</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <ImagePlaceholder width={60} height={60} borderRadius={8} />
            <Text style={styles.note}>sm</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <ImagePlaceholder width={60} height={60} borderRadius={16} />
            <Text style={styles.note}>lg</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 6 }}>
            <ImagePlaceholder width={60} height={60} borderRadius={30} />
            <Text style={styles.note}>circle</Text>
          </View>
        </Row>
      </Section>

      <Section title="Com fallback (sem imagem)">
        <Row>
          <View style={styles.fallback}>
            <Text style={styles.fallbackText}>FS</Text>
          </View>
          <View style={styles.fallbackIcon}>
            <Text style={{ fontSize: 24 }}>👤</Text>
          </View>
        </Row>
      </Section>

      <Section title="Contexto real — categorias">
        <Row wrap>
          {['🍔', '🚗', '🏠', '💊', '📚', '🎮', '💰', '💳'].map((e, i) => (
            <View key={i} style={styles.categoryImg}>
              <Text style={{ fontSize: 22 }}>{e}</Text>
            </View>
          ))}
        </Row>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.mutedLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
  },
  note: {
    fontSize: 11,
    color: colors.textMuted,
  },
  fallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  fallbackIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mutedLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryImg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
});
