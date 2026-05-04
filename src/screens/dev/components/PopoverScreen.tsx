import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Popover({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <TouchableOpacity onPress={() => setOpen(!open)}>{trigger}</TouchableOpacity>
      {open && (
        <View style={styles.popover}>
          <View style={styles.arrow} />
          <View style={styles.content}>{children}</View>
        </View>
      )}
    </View>
  );
}

function TriggerBtn({ label }: { label: string }) {
  return (
    <View style={styles.triggerBtn}>
      <Text style={styles.triggerText}>{label}</Text>
    </View>
  );
}

export function PopoverScreen() {
  return (
    <ScreenWrapper>
      <Section title="Popovers (toque para abrir/fechar)">
        <Label text="Informação adicional" />
        <Popover trigger={<TriggerBtn label="ℹ️ Saiba mais" />}>
          <Text style={styles.title}>Saldo calculado</Text>
          <Text style={styles.body}>
            O saldo é calculado como receitas recebidas menos despesas pagas.
          </Text>
        </Popover>

        <Label text="Legenda de status" />
        <Popover trigger={<TriggerBtn label="Status" />}>
          <View style={styles.statusItem}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={styles.body}>Pago / Recebido</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.dot, { backgroundColor: colors.warning }]} />
            <Text style={styles.body}>Pendente</Text>
          </View>
        </Popover>

        <Label text="Ajuda de campo" />
        <Popover trigger={<TriggerBtn label="? Tipo de pagamento" />}>
          <Text style={styles.title}>Tipos de pagamento</Text>
          <Text style={styles.body}>• À vista: pago de uma vez{'\n'}• Parcelado: dividido em X vezes{'\n'}• Recorrente: se repete todo mês</Text>
        </Popover>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  popover: {
    position: 'absolute',
    top: '100%',
    left: 0,
    zIndex: 100,
    marginTop: 8,
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.border,
    marginLeft: 16,
  },
  content: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  body: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  triggerBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
