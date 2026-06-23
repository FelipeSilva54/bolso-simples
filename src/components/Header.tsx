import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { ArrowLeft, XCircle } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

type HeaderVariant = 'home' | 'screen' | 'search';
type HeaderTheme = 'dark' | 'light';

type IconProp = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

type HeaderProps = {
  title: string;
  variant?: HeaderVariant;
  theme?: HeaderTheme;
  showBackButton?: boolean;
  onBackPress?: () => void;
  secondaryRightIcon?: IconProp;
  onSecondaryRightPress?: () => void;
  secondaryRightIconLabel?: string;
  rightIcon?: IconProp;
  onRightPress?: () => void;
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
  secondaryRightIcon: SecondaryRightIcon,
  onSecondaryRightPress,
  secondaryRightIconLabel = 'Ação secundária do header',
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

      <AppText
        style={[
          styles.title,
          { color: contentColor },
          isHome ? styles.titleHome : styles.titleScreen,
        ]}
        numberOfLines={1}
      >
        {title}
      </AppText>

      <View style={[styles.side, styles.sideRight]}>
        {SecondaryRightIcon != null && (
          <TouchableOpacity
            onPress={onSecondaryRightPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={secondaryRightIconLabel}
          >
            <SecondaryRightIcon size={24} color={contentColor} weight="regular" />
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: spacing.lg,
  },
  side: {
    alignItems: 'flex-start',
  },
  sideRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xl,
  },
  title: {
    flex: 1,
    fontSize: fs.lg,
    fontWeight: fw.semibold,
  },
  titleHome: {
    textAlign: 'left',
    marginLeft: 0,
  },
  titleScreen: {
    textAlign: 'left',
    marginLeft: spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.regular,
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
  },
});