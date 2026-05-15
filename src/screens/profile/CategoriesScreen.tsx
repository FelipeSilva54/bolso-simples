import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Animated,
  Keyboard,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MagnifyingGlass, Tag } from 'phosphor-react-native';
import * as Phosphor from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { FAB } from '@/components/FAB';
import { AvatarIcon } from '@/components/AvatarIcon';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { useCategories } from '@/hooks/useCategories';
import { Category, CategoryType } from '@/types/category';
import { useLanguage } from '@/store/LanguageContext';

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

function getIconComponent(name: string | undefined): IconComponent {
  if (!name) return Tag as unknown as IconComponent;
  const Icon = (Phosphor as unknown as Record<string, unknown>)[name];
  return ((Icon ?? Tag) as unknown) as IconComponent;
}

// Remove acentos para busca case-insensitive resiliente a "acai" vs "açaí"
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export function CategoriesScreen() {
  const router = useRouter();
  const { categories, loading } = useCategories();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<CategoryType>('expense');
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Captura a altura real do teclado para posicionar o FAB.
  // No Android edge-to-edge o KeyboardAvoidingView atrapalha — preferimos
  // ler `endCoordinates.height` direto do evento e calcular o `bottom`.
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Anim das tabs — 0 = expense | 1 = income
  // tabAnim controla translateX do indicador (driver nativo)
  // colorAnim interpola a cor de fundo (não suporta driver nativo)
  const tabAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const tabWidth = tabContainerWidth / 2;

  const indicatorTranslate = tabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });
  const indicatorColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.danger, colors.success],
  });

  const handleTabChange = (next: CategoryType) => {
    if (next === activeTab) return;
    const toValue = next === 'expense' ? 0 : 1;

    // Dispara animações ANTES do setState — assim o feedback visual aparece
    // imediatamente, sem esperar o re-render da lista (que pode ter ~21 itens
    // com SVGs Phosphor pesados).
    Animated.spring(tabAnim, {
      toValue,
      useNativeDriver: true,
      bounciness: 4,
      speed: 20,
    }).start();

    Animated.spring(colorAnim, {
      toValue,
      useNativeDriver: false,
      bounciness: 0,
      speed: 16,
    }).start();

    // Defere a troca de lista para o próximo frame — não bloqueia o início
    // da animação. A pílula desliza enquanto a lista re-renderiza no fundo.
    requestAnimationFrame(() => setActiveTab(next));
  };

  const filteredCategories = useMemo(
    () => filterCategories(categories, activeTab, searchText),
    [categories, activeTab, searchText],
  );

  const handleSearchOpen = () => setSearchMode(true);

  const handleSearchClose = () => {
    setSearchText('');
    setSearchMode(false);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.white} />

      {searchMode ? (
        <Header
          title=""
          variant="search"
          theme="light"
          showBackButton
          onBackPress={handleSearchClose}
          searchValue={searchText}
          onSearchChange={setSearchText}
          onSearchClose={handleSearchClose}
        />
      ) : (
        <Header
          title={t('categories.title')}
          variant="screen"
          theme="light"
          showBackButton
          onBackPress={() => router.back()}
          rightIcon={MagnifyingGlass as IconComponent}
          onRightPress={handleSearchOpen}
        />
      )}

      <View style={styles.flex}>
        {/* Tab pill Despesa/Receita */}
        <View style={styles.tabWrapper}>
          <View
            style={styles.tabContainer}
            onLayout={(e) => setTabContainerWidth(e.nativeEvent.layout.width)}
          >
            {tabContainerWidth > 0 && (
              // Externa: posição (driver nativo). Interna: cor (não-native).
              // Separar evita o conflito "Style property X is not supported by native animated module".
              <Animated.View
                style={[
                  styles.tabIndicator,
                  {
                    width: tabWidth,
                    transform: [{ translateX: indicatorTranslate }],
                  },
                ]}
              >
                <Animated.View
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: indicatorColor,
                      borderRadius: radius.full,
                    },
                  ]}
                />
              </Animated.View>
            )}

            <Pressable
              onPress={() => handleTabChange('expense')}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === 'expense' }}
              accessibilityLabel={t('categories.expenseTab')}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'expense' && styles.tabLabelActive,
                ]}
              >
                {t('categories.expenseTab')}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handleTabChange('income')}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === 'income' }}
              accessibilityLabel={t('categories.incomeTab')}
              style={styles.tabItem}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === 'income' && styles.tabLabelActive,
                ]}
              >
                {t('categories.incomeTab')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Lista */}
        {loading ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <View key={i} style={[styles.row, i < 7 && styles.rowDivider]}>
                <Skeleton width={40} height={40} borderRadius={radius.full} />
                <Skeleton height={16} width="55%" borderRadius={radius.sm} />
              </View>
            ))}
          </View>
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            image={require('@/assets/images/MobilePay.png')}
            title={emptyTitle(activeTab, searchText, t)}
            subtitle={emptySubtitle(searchText, t)}
          />
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredCategories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => {
                  // TODO: navegar para tela de editar categoria
                }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={category.name}
                style={[
                  styles.row,
                  index < filteredCategories.length - 1 && styles.rowDivider,
                ]}
              >
                <AvatarIcon
                  icon={getIconComponent(category.icon)}
                  iconColor={category.color}
                  size={40}
                />
                <Text style={styles.rowLabel} numberOfLines={1}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <FAB
          label={t('categories.addButton')}
          accessibilityLabel={t('categories.addButton')}
          onPress={() => router.push('/(stack)/add-category')}
          style={{
            position: 'absolute',
            // Com teclado aberto: keyboardHeight no Android edge-to-edge não
            // inclui a nav bar, mas `bottom` é medido a partir do fundo da
            // window (que inclui a nav bar). Por isso somamos insets.bottom
            // para o FAB ficar realmente acima do teclado.
            // Sem teclado: só insets.bottom basta para escapar da bottom bar.
            bottom:
              keyboardHeight > 0
                ? keyboardHeight + spacing.xl
                : spacing.xl,
            right: spacing.lg,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

function filterCategories(
  list: Category[],
  type: CategoryType,
  search: string,
): Category[] {
  const byType = list.filter((c) => c.type === type);
  if (search.trim().length === 0) return byType;
  const needle = normalize(search.trim());
  return byType.filter((c) => normalize(c.name).includes(needle));
}

function emptyTitle(type: CategoryType, search: string, t: (key: string) => string): string {
  if (search.trim().length > 0) {
    return `${t('categories.emptyTitleSearchPrefix')}"${search.trim()}"`;
  }
  return type === 'expense' ? t('categories.emptyTitleExpense') : t('categories.emptyTitleIncome');
}

function emptySubtitle(search: string, t: (key: string) => string): string | undefined {
  if (search.trim().length > 0) return undefined;
  return t('categories.emptySubtitle');
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },

  // Tab pill
  tabWrapper: {
    paddingHorizontal: 20,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: colors.background,
    borderRadius: radius.full,
    position: 'relative',
    overflow: 'hidden',
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: radius.full,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabLabel: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.subcontent,
  },
  tabLabelActive: {
    color: colors.white,
    fontWeight: fw.semibold,
  },

  // Lista
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100, // espaço para o FAB não cobrir o último item
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: 20,
    gap: spacing.lg,
    backgroundColor: colors.white,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLabel: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
  },

  skeletonList: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
