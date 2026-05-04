import React, { useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, ScreenWrapper, Section } from './_shared';

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.header}
        activeOpacity={0.7}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.headerText}>{title}</Text>
        <Text style={[styles.chevron, open && styles.chevronOpen]}>▾</Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

export function AccordionScreen() {
  return (
    <ScreenWrapper>
      <Section title="Accordions (toque para expandir)">
        <AccordionItem title="O que é o Bolso Simples?" defaultOpen>
          <Text style={styles.bodyText}>
            O Bolso Simples é um app de controle financeiro pessoal simples, rápido e gratuito. Sem anúncios, sem integração bancária.
          </Text>
        </AccordionItem>
        <AccordionItem title="Como criar uma carteira?">
          <Text style={styles.bodyText}>
            Na tela inicial, toque em "+ Adicionar carteira", informe o nome e escolha uma cor.
          </Text>
        </AccordionItem>
        <AccordionItem title="O que é uma receita não recebida?">
          <Text style={styles.bodyText}>
            Uma receita marcada como "Não recebida" não soma ao saldo da carteira. Serve para registrar valores futuros como freelances ainda não pagos.
          </Text>
        </AccordionItem>
        <AccordionItem title="Meus dados ficam salvos offline?">
          <Text style={styles.bodyText}>
            Os dados são sincronizados com o Firebase. Em modo anônimo, os dados ficam vinculados ao dispositivo via UID anônimo.
          </Text>
        </AccordionItem>
      </Section>

      <Section title="Com múltiplos abertos">
        <AccordionItem title="Tipo: Receita" defaultOpen>
          <Text style={styles.bodyText}>Dinheiro que entra na carteira. Ex: salário, freela.</Text>
        </AccordionItem>
        <AccordionItem title="Tipo: Despesa" defaultOpen>
          <Text style={styles.bodyText}>Dinheiro que sai da carteira. Ex: aluguel, mercado.</Text>
        </AccordionItem>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.card,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  chevron: {
    fontSize: 16,
    color: colors.textMuted,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    padding: 16,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bodyText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
