import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, XCircle } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

type HeaderVariant = 'home' | 'screen' | 'search';
type HeaderTheme = 'dark' | 'light';

type HeaderProps = {
  title: string;
  variant?: HeaderVariant;   // 'home' título à esquerda | 'screen' centralizado | 'search' campo de busca
  theme?: HeaderTheme;       // 'dark' fundo primary | 'light' fundo white
  showBackButton?: boolean;  // Exibe seta de voltar à esquerda
  onBackPress?: () => void;
  rightIcon?: React.ComponentType<{ size?: number; color?: string; weight?: string }>;
  onRightPress?: () => void;
  // Search variant — obrigatórios quando variant === 'search'
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchClose?: () => void;
};

export function Header({
  title,
  variant = 'screen',
  theme = 'dark',
  showBackButton = false,
  onBackPress,
  rightIcon: RightIcon,
  onRightPress,
  searchValue,
  onSearchChange,
  onSearchClose,
}: HeaderProps) {
  const isDark = theme === 'dark';
  const isHome = variant === 'home';
  const isSearch = variant === 'search';

  const contentColor = isDark ? colors.white : colors.content;
  const backgroundColor = isDark ? colors.primary : colors.white;

  if (isSearch) {
    return (
      <View style={[styles.container, { backgroundColor }]}>

        {/* Lado esquerdo — voltar */}
        <View style={styles.side}>
          {showBackButton && (
            <TouchableOpacity
              onPress={onBackPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <ArrowLeft size={24} color={contentColor} weight="regular" />
            </TouchableOpacity>
          )}
        </View>

        {/* Campo de busca expandido */}
        <TextInput
          value={searchValue}
          onChangeText={onSearchChange}
          autoFocus
          placeholder="Buscar categoria"
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.6)' : colors.muted}
          selectionColor={isDark ? colors.white : colors.primary}
          style={[styles.searchInput, { color: contentColor }]}
          accessibilityLabel="Campo de busca"
        />

        {/* Lado direito — limpar busca / fechar */}
        <View style={[styles.side, styles.sideRight]}>
          <TouchableOpacity
            onPress={onSearchClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Fechar busca"
          >
            <XCircle size={24} color={contentColor} weight="regular" />
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>

      {/* Lado esquerdo — seta de voltar ou espaço reservado */}
      <View style={styles.side}>
        {showBackButton && (
          <TouchableOpacity
            onPress={onBackPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={24} color={contentColor} weight="regular" />
          </TouchableOpacity>
        )}
      </View>

      {/* Título — alinhado à esquerda no home, centralizado no screen */}
      <Text
        style={[
          styles.title,
          { color: contentColor },
          isHome ? styles.titleLeft : styles.titleCenter,
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {/* Lado direito — ícone de ação ou espaço reservado */}
      <View style={[styles.side, styles.sideRight]}>
        {RightIcon != null && (
          <TouchableOpacity
            onPress={onRightPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Ação do header"
          >
            <RightIcon size={24} color={contentColor} weight="regular" />
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,         // 20px — sem token entre spacing.lg (16) e spacing.xl (24)
    paddingVertical: spacing.lg,   // 16px
  },
  // Ambos os lados têm largura fixa para o título centralizar corretamente no variant screen
  side: {
    alignItems: 'flex-start',
  },
  sideRight: {
    alignItems: 'flex-end',
    width: spacing.xl, // Largura suficiente para o ícone de ação, mantendo o título centralizado
  },
  title: {
    flex: 1,
    fontSize: fs.lg,               // 18px
    fontWeight: fw.semibold,
  },
  // Home: título encosta no ícone esquerdo com gap de 16px
  titleLeft: {
    textAlign: 'left',
    marginLeft: 0,        // 16px de distância do ícone esquerdo
  },
  // Screen: título fica centralizado entre os dois lados
  titleCenter: {
    textAlign: 'center',
  },
  // Search: campo ocupa o espaço entre os ícones, sem padding nativo
  searchInput: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.regular,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
  },
});
