import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Check } from 'phosphor-react-native';
import * as Phosphor from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import { Toast } from '@/components/Toast';
import { useAuth } from '@/store/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { CategoryType } from '@/types/category';

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
  const { user } = useAuth();
  const { addCategory } = useCategories();

  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success');
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isValid = name.trim().length > 0 && selectedIcon !== null && selectedColor !== null;

  function showToast(message: string, variant: 'success' | 'error') {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(null);
    setTimeout(() => {
      setToastMessage(message);
      setToastVariant(variant);
      toastTimerRef.current = setTimeout(() => setToastMessage(null), 2500);
    }, 50);
  }

  async function handleSave() {
    if (!isValid || !user) return;
    setSaving(true);
    try {
      await addCategory({
        name: name.trim(),
        icon: selectedIcon!,
        color: selectedColor!,
        type,
      });
      showToast('Categoria criada!', 'success');
      setTimeout(() => router.back(), 1000);
    } catch {
      showToast('Erro ao salvar categoria', 'error');
      setSaving(false);
    }
  }

  const PreviewIcon = selectedIcon ? getIconComponent(selectedIcon) : null;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" backgroundColor={colors.white} />

      <Header
        title="Adicionar categoria"
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
        {/* Nome */}
        <View style={styles.field}>
          <TextInput
            label="Nome"
            value={name}
            onChangeText={setName}
            placeholder="Ex: Alimentação"
            accessibilityLabel="Nome da categoria"
            autoCorrect={false}
          />
        </View>

        {/* Tipo */}
        <View style={styles.field}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              onPress={() => setType('expense')}
              accessibilityLabel="Tipo Despesa"
              accessibilityRole="button"
              accessibilityState={{ selected: type === 'expense' }}
              style={[styles.typePill, type === 'expense' && styles.typePillActive]}
            >
              <Text style={[styles.typePillText, type === 'expense' && styles.typePillTextActive]}>
                Despesa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType('income')}
              accessibilityLabel="Tipo Receita"
              accessibilityRole="button"
              accessibilityState={{ selected: type === 'income' }}
              style={[styles.typePill, type === 'income' && styles.typePillActive]}
            >
              <Text style={[styles.typePillText, type === 'income' && styles.typePillTextActive]}>
                Receita
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ícone */}
        <View style={styles.field}>
          <Text style={styles.label}>Ícone</Text>
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
                      style={[styles.iconCell, { backgroundColor: bgColor }]}
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
          <Text style={styles.label}>Cor</Text>
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

        {/* Preview */}
        <View style={styles.previewContainer}>
          <View style={[styles.previewCircle, { backgroundColor: selectedColor ?? colors.border }]}>
            {PreviewIcon && (
              <PreviewIcon size={22} color={colors.white} weight="fill" />
            )}
          </View>
          <Text style={styles.previewName} numberOfLines={1}>
            {name.trim().length > 0 ? name.trim() : 'Nome da categoria'}
          </Text>
        </View>

        {/* Botão */}
        <View style={styles.saveButton}>
          <Button
            variant="primary"
            onPress={handleSave}
            disabled={!isValid}
            loading={saving}
          >
            Salvar categoria
          </Button>
        </View>
      </ScrollView>

      <Toast message={toastMessage} variant={toastVariant} />
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

  // Tipo
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typePill: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typePillText: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.subcontent,
  },
  typePillTextActive: {
    color: colors.white,
  },

  // Ícones
  iconGrid: {
    height: 160,
  },
  iconRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  iconCell: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.md,
  },
  previewCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  previewName: {
    flex: 1,
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
  },

  // Botão
  saveButton: {
    marginTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
});
