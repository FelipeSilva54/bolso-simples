import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AppText from '@/components/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check } from 'phosphor-react-native';
import * as Phosphor from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/store/ToastContext';
import { useCategories } from '@/hooks/useCategories';
import { CategoryType } from '@/types/category';
import { useLanguage } from '@/store/LanguageContext';

const ICONS = [
  'ShoppingCart', 'Car', 'Heart', 'House', 'Briefcase', 'GraduationCap',
  'GameController', 'MusicNote', 'Airplane', 'Coffee', 'Pizza', 'Hamburger',
  'ShoppingBag', 'TShirt', 'Scissors', 'Wrench', 'Syringe', 'Pill',
  'BankNote', 'CreditCard', 'PiggyBank', 'ChartLine', 'Receipt', 'Wallet',
  'Phone', 'Desktop', 'Wifi', 'Camera', 'BookOpen', 'Newspaper',
  'Dog', 'Cat', 'Plant', 'Tree', 'Sun', 'Moon',
  'Barbell', 'Bike', 'Soccer', 'Basketball', 'Trophy', 'Medal',
  'Gift', 'Star', 'Smiley', 'Lightning', 'Fire', 'Drop',
];

const CATEGORY_COLORS = [
  '#DC2626', '#EA580C', '#D97706', '#65A30D',
  '#16A34A', '#0891B2', '#2563EB', '#7C3AED',
  '#C026D3', '#DB2777', '#64748B', '#374151',
  '#B45309', '#15803D', '#1D4ED8', '#6D28D9',
];

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

function getIconComponent(name: string): IconComponent {
  const Icon = (Phosphor as unknown as Record<string, unknown>)[name];
  return (Icon ?? Phosphor.Tag) as unknown as IconComponent;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const iconRows = chunk(ICONS, 6);
const colorRows = chunk(CATEGORY_COLORS, 8);

export function AddEditCategoryScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const { user } = useAuth();
  const { categories, addCategory, updateCategory } = useCategories();

  const isEditing = !!categoryId;
  const existingCategory = isEditing ? categories.find((c) => c.id === categoryId) : undefined;

  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (existingCategory) {
      setName(existingCategory.name);
      setType(existingCategory.type);
      setSelectedIcon(existingCategory.icon);
      setSelectedColor(existingCategory.color);
    }
  }, [existingCategory?.id]);

  const isValid = name.trim().length > 0 && selectedIcon !== null && selectedColor !== null;

  async function handleSave() {
    if (!isValid || !user) return;
    setSaving(true);
    try {
      if (isEditing && categoryId) {
        await updateCategory(categoryId, {
          name: name.trim(),
          icon: selectedIcon!,
          color: selectedColor!,
          type,
        });
        showToast(t('category.updated'));
      } else {
        await addCategory({
          name: name.trim(),
          icon: selectedIcon!,
          color: selectedColor!,
          type,
        });
        showToast(t('category.added'));
      }
      router.back();
    } catch {
      showToast(t('category.saveError'), 'error');
      setSaving(false);
    }
  }

  const PreviewIcon = selectedIcon ? getIconComponent(selectedIcon) : null;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.white} />

      <Header
        title={isEditing ? t('category.editTitle') : t('category.addTitle')}
        variant="screen"
        theme="light"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Preview — topo, centralizado */}
        <View style={styles.previewContainer}>
          <View style={[styles.previewCircle, { backgroundColor: selectedColor ?? colors.border }]}>
            {PreviewIcon && (
              <PreviewIcon size={28} color={colors.white} weight="fill" />
            )}
          </View>
          <AppText style={styles.previewName} numberOfLines={1}>
            {name.trim().length > 0 ? name.trim() : t('category.namePreview')}
          </AppText>
        </View>

        {/* Nome */}
        <View style={styles.field}>
          <TextInput
            label={t('category.nameInputLabel')}
            value={name}
            onChangeText={setName}
            placeholder={t('category.nameInputPlaceholder')}
            accessibilityLabel={t('category.nameInputA11y')}
            autoCorrect={false}
          />
        </View>

        {/* Tipo */}
        <View style={styles.field}>
          <AppText style={styles.label}>{t('category.typeLabel')}</AppText>
          <View style={styles.typeRow}>
            {(['expense', 'income'] as CategoryType[]).map((catType) => {
              const isChecked = type === catType;
              const label = catType === 'expense' ? t('category.expenseLabel') : t('category.incomeLabel');
              return (
                <TouchableOpacity
                  key={catType}
                  onPress={() => setType(catType)}
                  accessibilityLabel={label}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isChecked }}
                  style={styles.radioOption}
                >
                  <View style={styles.radioOuter}>
                    {isChecked && <View style={styles.radioInner} />}
                  </View>
                  <AppText style={styles.radioLabel}>{label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Ícone */}
        <View style={styles.field}>
          <AppText style={styles.label}>{t('category.iconLabel')}</AppText>
          <ScrollView
            style={styles.iconGrid}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {iconRows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.iconRow}>
                {row.map((iconName) => {
                  const IconComp = getIconComponent(iconName);
                  const isSelected = selectedIcon === iconName;
                  const bgColor = isSelected ? (selectedColor ?? colors.primary) : colors.offwhite;
                  return (
                    <TouchableOpacity
                      key={iconName}
                      onPress={() => setSelectedIcon(iconName)}
                      accessibilityLabel={`Ícone ${iconName}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
                      style={[
                        styles.iconCell,
                        { backgroundColor: bgColor },
                        isSelected && styles.iconCellSelected,
                      ]}
                    >
                      <IconComp
                        size={24}
                        color={isSelected ? colors.white : colors.subcontent}
                        weight="regular"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Cor */}
        <View style={styles.field}>
          <AppText style={styles.label}>{t('category.colorLabel')}</AppText>
          {colorRows.map((row, rowIdx) => (
            <View key={rowIdx} style={[styles.colorRow, rowIdx < colorRows.length - 1 && styles.colorRowGap]}>
              {row.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    accessibilityLabel={`Cor ${color}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                    style={styles.colorCellWrapper}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: color },
                        isSelected && styles.colorCircleSelected,
                      ]}
                    >
                      {isSelected && (
                        <Check size={16} color={colors.white} weight="bold" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="primary"
          onPress={handleSave}
          disabled={!isValid}
          loading={saving}
        >
          {t('category.saveButton')}
        </Button>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },

  field: {
    marginTop: spacing.xl,
  },
  label: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
    marginBottom: spacing.sm,
  },

  // Tipo — radio buttons
  typeRow: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    paddingVertical: spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
  },

  // Ícones
  iconGrid: {
    maxHeight: 200,
  },
  iconRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.sm,
  },
  iconCell: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
  },
  iconCellSelected: {
    borderRadius: radius.full,
  },

  // Cores
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorRowGap: {
    marginBottom: spacing.sm,
  },
  colorCellWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: colors.primary,
  },

  // Preview
  previewContainer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  previewCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewName: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
    textAlign: 'center',
  },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
