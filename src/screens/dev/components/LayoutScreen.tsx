import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Box({ children, bg = colors.primaryLight, p = 8, br = 6 }: {
  children: React.ReactNode;
  bg?: string;
  p?: number;
  br?: number;
}) {
  return (
    <View style={{ backgroundColor: bg, padding: p, borderRadius: br }}>
      {children}
    </View>
  );
}

function Cell({ label }: { label: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.cellText}>{label}</Text>
    </View>
  );
}

export function LayoutScreen() {
  return (
    <ScreenWrapper>
      <Section title="Box — container básico">
        <Label text="Box simples" />
        <Box>
          <Text style={styles.text}>Conteúdo dentro do Box</Text>
        </Box>

        <Label text="Box com cor personalizada" />
        <Box bg={colors.successLight}>
          <Text style={[styles.text, { color: '#065F46' }]}>Box verde</Text>
        </Box>
      </Section>

      <Section title="HStack — horizontal">
        <Label text="gap=8" />
        <View style={[styles.hstack, { gap: 8 }]}>
          <Cell label="A" /><Cell label="B" /><Cell label="C" />
        </View>

        <Label text="gap=16, alinhado ao centro" />
        <View style={[styles.hstack, { gap: 16, alignItems: 'center' }]}>
          <Cell label="Pequeno" />
          <View style={[styles.cell, { height: 48 }]}><Text style={styles.cellText}>Alto</Text></View>
          <Cell label="Pequeno" />
        </View>

        <Label text="space-between" />
        <View style={[styles.hstack, { justifyContent: 'space-between' }]}>
          <Cell label="Esquerda" /><Cell label="Centro" /><Cell label="Direita" />
        </View>
      </Section>

      <Section title="VStack — vertical">
        <Label text="gap=8" />
        <View style={{ gap: 8 }}>
          <Cell label="Item 1" /><Cell label="Item 2" /><Cell label="Item 3" />
        </View>
      </Section>

      <Section title="Center — centralizado">
        <Label text="Conteúdo centralizado" />
        <View style={styles.center}>
          <View style={styles.cell}><Text style={styles.cellText}>Centro</Text></View>
        </View>
      </Section>

      <Section title="Grid — colunas">
        <Label text="2 colunas" />
        <View style={styles.grid2}>
          {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => (
            <Cell key={l} label={l} />
          ))}
        </View>

        <Label text="3 colunas" />
        <View style={styles.grid3}>
          {['A', 'B', 'C', 'D', 'E', 'F'].map((l) => (
            <Cell key={l} label={l} />
          ))}
        </View>
      </Section>

      <Section title="View — genérico">
        <Label text="View como container" />
        <View style={styles.viewDemo}>
          <Text style={styles.text}>View simples com borderRadius e background</Text>
        </View>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: colors.text,
  },
  cell: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  hstack: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mutedLight,
    borderRadius: 8,
    height: 80,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  grid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  viewDemo: {
    backgroundColor: colors.mutedLight,
    borderRadius: 10,
    padding: 16,
  },
});
