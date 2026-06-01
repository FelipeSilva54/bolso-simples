import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Rect } from 'react-native-svg';
import { DotsThreeVertical } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';
import { useWalletSparkline } from '@/hooks/useWalletSparkline';

// Dimensões do SVG do sparkline
const SPARK_W = 120;
const SPARK_H = 46;

// Área de desenho com padding interno generoso para não cortar a curva
const CHART = { x1: 16, x2: 104, y1: 7, y2: 36 };

// Largura dos fades laterais
const FADE_W = 28;

function dataToPoints(data: number[]): { x: number; y: number }[] {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const midY = (CHART.y1 + CHART.y2) / 2;

  return data.map((v, i) => ({
    x: CHART.x1 + (i / (data.length - 1)) * (CHART.x2 - CHART.x1),
    y: range === 0
      ? midY
      : CHART.y2 - ((v - min) / range) * (CHART.y2 - CHART.y1),
  }));
}

// Catmull-Rom → Bézier cúbico para curvas suaves e orgânicas
function buildSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  if (pts.length === 2) {
    return `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)} L ${pts[1].x.toFixed(1)},${pts[1].y.toFixed(1)}`;
  }

  const t = 0.35;
  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) * t;
    const cp1y = p1.y + (p2.y - p0.y) * t;
    const cp2x = p2.x - (p3.x - p1.x) * t;
    const cp2y = p2.y - (p3.y - p1.y) * t;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }

  return d;
}


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
  walletId,
  initialBalance,
  onOptionsPress,
  onPress,
}: WalletCardProps) {
  const { preferences } = usePreferences();
  const formattedBalance = formatCurrency(balance, preferences.currency);
  const gradId = useRef(`sg_${Math.random().toString(36).slice(2)}`).current;
  const { data: sparkData } = useWalletSparkline(walletId, initialBalance);

  const pts = sparkData.length >= 2 ? dataToPoints(sparkData) : null;

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
      {/* Sparkline — renderizado antes do conteúdo para ficar atrás do texto */}
      <View style={styles.sparklineContainer} pointerEvents="none">
        {pts && (
          <Svg width={SPARK_W} height={SPARK_H}>
            <Defs>
              <LinearGradient id={`fadeL_${gradId}`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor={color} stopOpacity="1" />
                <Stop offset="100%" stopColor={color} stopOpacity="0" />
              </LinearGradient>
              <LinearGradient id={`fadeR_${gradId}`} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor={color} stopOpacity="0" />
                <Stop offset="100%" stopColor={color} stopOpacity="1" />
              </LinearGradient>
            </Defs>

            {/* Linha principal */}
            <Path
              d={buildSmoothPath(pts)}
              fill="none"
              stroke={colors.white}
              strokeOpacity={0.85}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Fades laterais — entrada e saída suaves */}
            <Rect x={0} y={0} width={FADE_W} height={SPARK_H} fill={`url(#fadeL_${gradId})`} />
            <Rect x={SPARK_W - FADE_W} y={0} width={FADE_W} height={SPARK_H} fill={`url(#fadeR_${gradId})`} />
          </Svg>
        )}
      </View>

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
  sparklineContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: SPARK_W,
    height: SPARK_H,
  },
});
