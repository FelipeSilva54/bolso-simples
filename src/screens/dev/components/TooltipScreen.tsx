import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Tooltip({
  children,
  content,
  placement = 'top',
}: {
  children: React.ReactNode;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        onLongPress={() => setVisible(!visible)}
      >
        {children}
      </TouchableOpacity>
      {visible && (
        <View
          style={[
            styles.tooltip,
            placement === 'top' && styles.top,
            placement === 'bottom' && styles.bottom,
            placement === 'left' && styles.left,
            placement === 'right' && styles.right,
          ]}
        >
          <Text style={styles.tooltipText}>{content}</Text>
        </View>
      )}
    </View>
  );
}

function IconBtn({ emoji }: { emoji: string }) {
  return (
    <View style={styles.iconBtn}>
      <Text style={{ fontSize: 20 }}>{emoji}</Text>
    </View>
  );
}

export function TooltipScreen() {
  return (
    <ScreenWrapper>
      <Section title="Posicionamento (toque para ver)">
        <Label text="Acima (top)" />
        <Tooltip content="Ocultar valores" placement="top">
          <IconBtn emoji="👁️" />
        </Tooltip>

        <Label text="Abaixo (bottom)" />
        <Tooltip content="Adicionar transação" placement="bottom">
          <IconBtn emoji="➕" />
        </Tooltip>

        <Label text="Esquerda" />
        <Tooltip content="Voltar" placement="left">
          <IconBtn emoji="←" />
        </Tooltip>

        <Label text="Direita" />
        <Tooltip content="Mais opções" placement="right">
          <IconBtn emoji="⋮" />
        </Tooltip>
      </Section>

      <Section title="Preview estático">
        <View style={styles.previewContainer}>
          <View style={styles.previewTooltip}>
            <Text style={styles.tooltipText}>Saldo total de todas as carteiras</Text>
          </View>
          <View style={styles.previewArrow} />
          <View style={styles.iconBtn}>
            <Text>ℹ️</Text>
          </View>
        </View>
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1F2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    zIndex: 100,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  top: {
    bottom: '110%',
    left: 0,
  },
  bottom: {
    top: '110%',
    left: 0,
  },
  left: {
    right: '110%',
    top: 0,
  },
  right: {
    left: '110%',
    top: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.mutedLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewContainer: {
    alignItems: 'center',
    gap: 4,
  },
  previewTooltip: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  previewArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1F2937',
  },
});
