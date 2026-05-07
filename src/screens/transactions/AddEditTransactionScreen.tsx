import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { TransactionTypeHeader } from '@/components/TransactionTypeHeader';
import { TextInput } from '@/components/TextInput';
import { DateInput } from '@/components/DateInput';
import { SelectInput, SelectOption } from '@/components/SelectInput';
import { useAuth } from '@/store/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { addTransaction } from '@/services/transactions';
import { Category } from '@/types/category';
import { TransactionStatus } from '@/types/transaction';
import { parseCurrency, formatCurrency } from '@/utils/currency';

type TxType = 'expense' | 'income';
type PaymentType = 'cash' | 'installment' | 'recurring';

const RECURRENCE_OPTIONS = [
  { value: 'daily', label: 'Diária' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quinzenal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'bimonthly', label: 'Bimestral' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semiannually', label: 'Semestral' },
  { value: 'annually', label: 'Anual' },
] as const;

function statusFor(type: TxType, on: boolean): TransactionStatus {
  if (type === 'expense') return on ? 'paid' : 'unpaid';
  return on ? 'received' : 'unreceived';
}

export function AddEditTransactionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { walletId } = useLocalSearchParams<{ walletId: string }>();
  const { user } = useAuth();
  const { categories } = useCategories();

  const [type, setType] = useState<TxType>('expense');
  const [valueText, setValueText] = useState('');
  const [statusOn, setStatusOn] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [observation, setObservation] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('cash');
  const [installments, setInstallments] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    value?: string;
    category?: string;
    installments?: string;
    recurrence?: string;
  }>({});

  const [saving, setSaving] = useState(false);

  const numericValue = parseCurrency(valueText);
  const installmentsCount = parseInt(installments || '0', 10);
  const installmentValue = installmentsCount > 0 ? numericValue / installmentsCount : 0;
  const installmentsHelper =
    installmentsCount > 1 && numericValue > 0
      ? `${installmentsCount}x de ${formatCurrency(installmentValue)}`
      : undefined;

  function validate(): boolean {
    const next: typeof errors = {};

    if (numericValue <= 0) {
      next.value = 'Informe um valor maior que R$ 0,00';
    }
    if (category == null) {
      next.category = 'Selecione uma categoria';
    }
    if (paymentType === 'installment') {
      if (!Number.isInteger(installmentsCount) || installmentsCount < 2) {
        next.installments = 'Informe um número inteiro maior que 1';
      }
    }
    if (paymentType === 'recurring' && !recurrenceType) {
      next.recurrence = 'Selecione o tipo de recorrência';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    if (!user || !walletId || !category) return;

    setSaving(true);
    try {
      await addTransaction(user.uid, walletId, {
        type,
        title: category.name,
        description: observation,
        amount: numericValue,
        categoryId: category.id,
        status: statusFor(type, statusOn),
        isRecurring: paymentType === 'recurring',
        date,
      });
      router.back();
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível salvar a transação. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  // Categorias filtradas pelo tipo da transação atual
  const categoriesForType = categories.filter((c) => c.type === type);

  const categoryOptions: SelectOption[] = categoriesForType.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const recurrenceOptions: SelectOption[] = RECURRENCE_OPTIONS.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="light" />

      <Header
        title="Adicionar transação"
        variant="screen"
        theme="dark"
        showBackButton
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TransactionTypeHeader
            type={type}
            onTypeChange={(t) => {
              setType(t);
              // Reset toggle quando alterna entre despesa/receita — o significado muda
              setStatusOn(false);
              // Limpa categoria se ela não pertence ao novo tipo
              if (category != null && category.type !== t) {
                setCategory(null);
              }
            }}
            value={valueText}
            onValueChange={setValueText}
          />

          {errors.value != null && (
            <View style={styles.valueErrorWrapper}>
              <Text style={styles.errorText}>{errors.value}</Text>
            </View>
          )}

          <View style={styles.form}>
            {/* Categoria */}
            <SelectInput
              label="Categoria"
              placeholder="Selecionar categoria"
              sheetTitle="Selecionar categoria"
              options={categoryOptions}
              value={category?.id ?? null}
              onChange={(id) =>
                setCategory(categoriesForType.find((c) => c.id === id) ?? null)
              }
              error={errors.category}
              helperText={
                categoriesForType.length === 0
                  ? `Nenhuma categoria de ${type === 'expense' ? 'despesa' : 'receita'} cadastrada`
                  : undefined
              }
              disabled={categoriesForType.length === 0}
              accessibilityLabel="Selecionar categoria"
            />

            {/* Data */}
            <DateInput
              label="Data"
              value={date}
              onChange={setDate}
              accessibilityLabel="Selecionar data"
            />

            {/* Observação */}
            <TextInput
              label="Observação"
              value={observation}
              onChangeText={setObservation}
              placeholder="Ex: Carteira do Thiago"
              accessibilityLabel="Observação da transação"
            />

            {/* Toggle status */}
            <View style={styles.toggleRow}>
              <Toggle
                value={statusOn}
                onValueChange={setStatusOn}
                accessibilityLabel={type === 'expense' ? 'Já paguei' : 'Já recebi'}
              />
              <Text style={styles.toggleLabel}>
                {type === 'expense' ? 'Já paguei' : 'Já recebi'}
              </Text>
            </View>

            {/* Tipo de pagamento */}
            <View>
              <Text style={styles.sectionLabel}>Tipo de pagamento</Text>
              <View style={styles.paymentRow}>
                <View style={styles.paymentItem}>
                  <Button
                    variant="outlined"
                    size="sm"
                    selected={paymentType === 'cash'}
                    onPress={() => setPaymentType('cash')}
                  >
                    À vista
                  </Button>
                </View>
                <View style={styles.paymentItem}>
                  <Button
                    variant="outlined"
                    size="sm"
                    selected={paymentType === 'installment'}
                    onPress={() => setPaymentType('installment')}
                  >
                    Parcelado
                  </Button>
                </View>
                <View style={styles.paymentItem}>
                  <Button
                    variant="outlined"
                    size="sm"
                    selected={paymentType === 'recurring'}
                    onPress={() => setPaymentType('recurring')}
                  >
                    Recorrente
                  </Button>
                </View>
              </View>
            </View>

            {/* Parcelas */}
            {paymentType === 'installment' && (
              <TextInput
                label="Parcelas"
                value={installments}
                onChangeText={(t) => setInstallments(t.replace(/\D/g, ''))}
                keyboardType="numeric"
                placeholder="Ex: 3"
                accessibilityLabel="Número de parcelas"
                error={errors.installments}
                helperText={installmentsHelper}
              />
            )}

            {/* Recorrência */}
            {paymentType === 'recurring' && (
              <SelectInput
                label="Recorrência"
                placeholder="Selecionar"
                sheetTitle="Tipo de recorrência"
                options={recurrenceOptions}
                value={recurrenceType}
                onChange={setRecurrenceType}
                error={errors.recurrence}
                accessibilityLabel="Selecionar tipo de recorrência"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Botão fixo de salvar — paddingBottom dinâmico para evitar barra do Android */}
      <View
        style={[
          styles.footer,
          { paddingBottom: spacing.lg + insets.bottom },
        ]}
      >
        <Button variant="primary" onPress={handleSave} loading={saving}>
          Salvar valor
        </Button>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  flex: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  valueErrorWrapper: {
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    backgroundColor: colors.white,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: spacing.xl,
    gap: spacing.xl,
  },
  fieldWrapper: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: fs.sm,
    fontWeight: fw.medium,
    color: colors.subcontent,
    marginBottom: 6,
  },
  fieldInput: {
    minHeight: 44,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldInputError: {
    borderBottomColor: colors.danger,
  },
  fieldInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  fieldValue: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
    flex: 1,
  },
  placeholder: {
    color: colors.muted,
  },
  observationInput: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
    minHeight: 44,
    paddingVertical: spacing.sm,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inputError: {
    borderBottomColor: colors.danger,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  toggleLabel: {
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
  },
  sectionLabel: {
    fontSize: fs.sm,
    fontWeight: fw.medium,
    color: colors.subcontent,
    marginBottom: spacing.sm,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paymentItem: {
    flex: 1,
  },
  helperText: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.subcontent,
    marginTop: 6,
  },
  errorText: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.danger,
    marginTop: 6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sheet: {
    paddingHorizontal: spacing.lg,
    maxHeight: 480,
  },
  sheetTitle: {
    fontSize: fs.lg,
    fontWeight: fw.semibold,
    color: colors.content,
    marginBottom: spacing.md,
  },
  sheetList: {
    flexGrow: 0,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sheetOptionLabel: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.content,
    flex: 1,
  },
  sheetOptionLabelSelected: {
    fontWeight: fw.semibold,
    color: colors.success,
  },
  emptyText: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
