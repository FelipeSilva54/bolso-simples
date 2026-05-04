import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

export function TextScreen() {
  return (
    <ScreenWrapper>
      <Section title="Tamanhos">
        <Label text="xs — 10px" /><Text style={styles.xs}>The quick brown fox</Text>
        <Label text="sm — 12px" /><Text style={styles.sm}>The quick brown fox</Text>
        <Label text="md — 14px (padrão)" /><Text style={styles.md}>The quick brown fox</Text>
        <Label text="lg — 16px" /><Text style={styles.lg}>The quick brown fox</Text>
        <Label text="xl — 18px" /><Text style={styles.xl}>The quick brown fox</Text>
        <Label text="2xl — 20px" /><Text style={styles['2xl']}>The quick brown fox</Text>
        <Label text="3xl — 24px" /><Text style={styles['3xl']}>The quick brown fox</Text>
        <Label text="4xl — 30px" /><Text style={styles['4xl']}>The quick brown fox</Text>
      </Section>

      <Section title="Pesos">
        <Label text="thin (100)" /><Text style={[styles.md, { fontWeight: '100' }]}>Texto thin</Text>
        <Label text="light (300)" /><Text style={[styles.md, { fontWeight: '300' }]}>Texto light</Text>
        <Label text="normal (400)" /><Text style={[styles.md, { fontWeight: '400' }]}>Texto normal</Text>
        <Label text="medium (500)" /><Text style={[styles.md, { fontWeight: '500' }]}>Texto medium</Text>
        <Label text="semibold (600)" /><Text style={[styles.md, { fontWeight: '600' }]}>Texto semibold</Text>
        <Label text="bold (700)" /><Text style={[styles.md, { fontWeight: '700' }]}>Texto bold</Text>
        <Label text="extrabold (800)" /><Text style={[styles.md, { fontWeight: '800' }]}>Texto extrabold</Text>
      </Section>

      <Section title="Cores">
        <Label text="primary" /><Text style={[styles.md, { color: colors.primary }]}>Texto primary</Text>
        <Label text="success" /><Text style={[styles.md, { color: colors.success }]}>Texto success</Text>
        <Label text="warning" /><Text style={[styles.md, { color: colors.warning }]}>Texto warning</Text>
        <Label text="danger" /><Text style={[styles.md, { color: colors.danger }]}>Texto danger</Text>
        <Label text="muted" /><Text style={[styles.md, { color: colors.textMuted }]}>Texto muted</Text>
        <Label text="secondary" /><Text style={[styles.md, { color: colors.secondary }]}>Texto secondary</Text>
      </Section>

      <Section title="Decorações">
        <Label text="italic" /><Text style={[styles.md, { fontStyle: 'italic' }]}>Texto em itálico</Text>
        <Label text="underline" /><Text style={[styles.md, { textDecorationLine: 'underline' }]}>Texto sublinhado</Text>
        <Label text="line-through" /><Text style={[styles.md, { textDecorationLine: 'line-through' }]}>Texto riscado</Text>
        <Label text="uppercase" /><Text style={[styles.md, { textTransform: 'uppercase' }]}>Texto maiúsculo</Text>
      </Section>

      <Section title="Alinhamento">
        <Label text="left" /><Text style={[styles.md, { textAlign: 'left' }]}>Alinhado à esquerda</Text>
        <Label text="center" /><Text style={[styles.md, { textAlign: 'center' }]}>Centralizado</Text>
        <Label text="right" /><Text style={[styles.md, { textAlign: 'right' }]}>Alinhado à direita</Text>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  xs: { fontSize: 10, color: colors.text },
  sm: { fontSize: 12, color: colors.text },
  md: { fontSize: 14, color: colors.text },
  lg: { fontSize: 16, color: colors.text },
  xl: { fontSize: 18, color: colors.text },
  '2xl': { fontSize: 20, color: colors.text },
  '3xl': { fontSize: 24, color: colors.text },
  '4xl': { fontSize: 30, color: colors.text },
});
