import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

export function HeadingScreen() {
  return (
    <ScreenWrapper>
      <Section title="Hierarquia">
        <Label text="h1 — 36px / extrabold" />
        <Text style={styles.h1}>Bolso Simples</Text>

        <Label text="h2 — 30px / bold" />
        <Text style={styles.h2}>Minhas Carteiras</Text>

        <Label text="h3 — 24px / bold" />
        <Text style={styles.h3}>Conta Corrente</Text>

        <Label text="h4 — 20px / semibold" />
        <Text style={styles.h4}>Transações do Mês</Text>

        <Label text="h5 — 18px / semibold" />
        <Text style={styles.h5}>Outubro de 2025</Text>

        <Label text="h6 — 16px / semibold" />
        <Text style={styles.h6}>Detalhes</Text>
      </Section>

      <Section title="Cores">
        <Label text="default (gray-900)" />
        <Text style={styles.h3}>Título padrão</Text>
        <Label text="primary" />
        <Text style={[styles.h3, { color: colors.primary }]}>Título primary</Text>
        <Label text="muted" />
        <Text style={[styles.h3, { color: colors.textMuted }]}>Título muted</Text>
        <Label text="danger" />
        <Text style={[styles.h3, { color: colors.danger }]}>Título danger</Text>
      </Section>

      <Section title="Exemplo de página">
        <Text style={styles.h2}>Bem-vindo de volta</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          Confira suas finanças do mês
        </Text>
        <Text style={styles.h4}>Resumo — Outubro</Text>
        <Text style={styles.h6}>Receitas</Text>
        <Text style={styles.h5}>R$ 5.200,00</Text>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 36, fontWeight: '800', color: colors.text, lineHeight: 44 },
  h2: { fontSize: 30, fontWeight: '700', color: colors.text, lineHeight: 38 },
  h3: { fontSize: 24, fontWeight: '700', color: colors.text, lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600', color: colors.text, lineHeight: 28 },
  h5: { fontSize: 18, fontWeight: '600', color: colors.text, lineHeight: 26 },
  h6: { fontSize: 16, fontWeight: '600', color: colors.text, lineHeight: 24 },
  body: { fontSize: 14, color: colors.text, lineHeight: 22 },
});
