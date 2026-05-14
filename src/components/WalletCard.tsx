import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { DotsThreeVertical } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';

type WalletCardProps = {
  name: string;
  balance: number;
  color: string;          // Cor de fundo — vem da paleta walletColors
  hideBalance?: boolean;  // Quando true, exibe "••••••" no lugar do valor
  onOptionsPress: () => void;
  onPress: () => void;
};

export function WalletCard({
  name,
  balance,
  color,
  hideBalance = false,
  onOptionsPress,
  onPress,
}: WalletCardProps) {
  const { preferences } = usePreferences();
  const formattedBalance = formatCurrency(balance, preferences.currency);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: color },
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Carteira ${name}, saldo ${hideBalance ? 'oculto' : formattedBalance}`}
    >
      {/* Linha superior: nome + botão de opções */}
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>

        <TouchableOpacity
            onPress={(e) => {
                e.stopPropagation();
                onOptionsPress();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.optionsButton}
            accessibilityLabel="Opções da carteira"
            accessibilityRole="button"
            >
            <DotsThreeVertical size={20} color={colors.white} weight="bold" />
        </TouchableOpacity>
      </View>

      {/* Linha inferior: label + valor */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Saldo da carteira:</Text>
        <Text style={styles.balanceValue}>
          {hideBalance ? '••••••' : formattedBalance}
        </Text>
      </View>

      {/* Detalhe decorativo — dois círculos sobrepostos no canto inferior direito */}
      <View style={styles.decorContainer} pointerEvents="none">
        <View style={styles.decorCircleBack} />
        <View style={styles.decorCircleFront} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,     // 8px
    padding: 20,                 // 20px — sem token entre spacing.lg (16) e spacing.xl (24)
    overflow: 'hidden',          // Corta os círculos decorativos nas bordas do card
    minHeight: 180,
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: fs.md,             // 16px
    fontWeight: fw.semibold,
    color: colors.white,
    flex: 1,
    marginRight: spacing.sm,
  },
  optionsButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,     // 4px — canto suavemente arredondado
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceContainer: {
    gap: spacing.xs,             // 4px entre label e valor
  },
  balanceLabel: {
    fontSize: fs.md,             // 14px
    fontWeight: fw.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceValue: {
    fontSize: fs.xxxl,           // 30px
    fontWeight: fw.medium,
    color: colors.white,
  },
  // Os círculos ficam em position absolute para não afetar o layout do conteúdo
  decorContainer: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 160,
    height: 160,
  },
  decorCircleBack: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: 2,
    right: 15,
  },
  decorCircleFront: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: 0,
    right: 0,
  },
});