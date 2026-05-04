import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

type AlertColor = 'info' | 'success' | 'warning' | 'error';
type AlertVariant = 'solid' | 'outline' | 'accent';

const ALERT_COLORS: Record<AlertColor, { bg: string; border: string; text: string; icon: string; accent: string }> = {
  info: { bg: colors.infoLight, border: colors.info, text: colors.primaryDark, icon: 'ℹ️', accent: colors.info },
  success: { bg: colors.successLight, border: colors.success, text: '#065F46', icon: '✅', accent: colors.success },
  warning: { bg: colors.warningLight, border: colors.warning, text: '#92400E', icon: '⚠️', accent: colors.warning },
  error: { bg: colors.dangerLight, border: colors.danger, text: '#991B1B', icon: '❌', accent: colors.danger },
};

function Alert({
  title,
  description,
  color = 'info',
  variant = 'solid',
}: {
  title: string;
  description?: string;
  color?: AlertColor;
  variant?: AlertVariant;
}) {
  const c = ALERT_COLORS[color];

  return (
    <View
      style={[
        styles.alert,
        variant === 'solid' && { backgroundColor: c.bg, borderColor: c.border, borderWidth: 1 },
        variant === 'outline' && { backgroundColor: 'transparent', borderColor: c.border, borderWidth: 1.5 },
        variant === 'accent' && {
          backgroundColor: c.bg,
          borderLeftWidth: 4,
          borderLeftColor: c.accent,
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0,
        },
      ]}
    >
      <Text style={styles.icon}>{c.icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
        {description ? <Text style={[styles.description, { color: c.text }]}>{description}</Text> : null}
      </View>
    </View>
  );
}

export function AlertScreen() {
  return (
    <ScreenWrapper>
      <Section title="Variante: Solid">
        <Label text="Info" />
        <Alert title="Informação" description="Isso é uma mensagem informativa." color="info" variant="solid" />
        <Label text="Success" />
        <Alert title="Sucesso!" description="Transação salva com sucesso." color="success" variant="solid" />
        <Label text="Warning" />
        <Alert title="Atenção" description="Seu saldo está negativo." color="warning" variant="solid" />
        <Label text="Error" />
        <Alert title="Erro" description="Não foi possível salvar a transação." color="error" variant="solid" />
      </Section>

      <Section title="Variante: Outline">
        <Label text="Info" />
        <Alert title="Informação" color="info" variant="outline" />
        <Label text="Success" />
        <Alert title="Operação realizada" color="success" variant="outline" />
        <Label text="Warning" />
        <Alert title="Atenção necessária" color="warning" variant="outline" />
        <Label text="Error" />
        <Alert title="Falha na operação" color="error" variant="outline" />
      </Section>

      <Section title="Variante: Accent">
        <Label text="Info" />
        <Alert title="Dica" description="Você pode ocultar saldos tocando no ícone de olho." color="info" variant="accent" />
        <Label text="Success" />
        <Alert title="Tudo certo!" description="Seus dados estão atualizados." color="success" variant="accent" />
        <Label text="Warning" />
        <Alert title="Verificar" description="Há despesas não pagas este mês." color="warning" variant="accent" />
        <Label text="Error" />
        <Alert title="Sem conexão" description="Verifique sua internet e tente novamente." color="error" variant="accent" />
      </Section>

      <Section title="Sem descrição">
        <Label text="Só título" />
        <Alert title="Salvo com sucesso" color="success" variant="solid" />
        <Alert title="Transação excluída" color="error" variant="accent" />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  alert: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  icon: {
    fontSize: 16,
    marginTop: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.85,
  },
});
