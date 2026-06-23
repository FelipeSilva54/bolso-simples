import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import AppText from '@/components/AppText';
import { DotsThreeVertical } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';


type WalletCardProps = {
  name: string;
  balance: number;
  color: string;
  hideBalance?: boolean;
  walletId: string;
  initialBalance: number;
  onOptionsPress: () => void;
  onPress: () => void;
};

export const WalletCard = React.memo(function WalletCard({
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
        <AppText style={styles.name} numberOfLines={1}>{name}</AppText>

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
        <AppText style={styles.balanceLabel}>Saldo da carteira:</AppText>
        <AppText style={styles.balanceValue}>
          {hideBalance ? '••••••' : formattedBalance}
        </AppText>
      </View>

      <View style={styles.decorContainer} pointerEvents="none">
        <View style={styles.decorCircleBack} />
        <View style={styles.decorCircleFront} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    padding: 20,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
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
    fontSize: fs.md,
    fontWeight: fw.semibold,
    color: colors.white,
    flex: 1,
    marginRight: spacing.sm,
  },
  optionsButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceContainer: {
    gap: spacing.xs,
  },
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
    bottom: 3,
    right: 15,
  },
  decorCircleFront: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: 0,
    right: 0,
  },
  balanceLabel: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: 'rgba(255,255,255,0.8)',
  },
  balanceValue: {
    fontSize: fs.xxxl,
    fontWeight: fw.medium,
    color: colors.white,
  },
});
