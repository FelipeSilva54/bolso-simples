import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Tag } from 'phosphor-react-native';
import * as Phosphor from 'phosphor-react-native';

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

type IconComponent = React.ComponentType<{ size?: number; color?: string; weight?: string }>;

function getIconComponent(name: string | undefined): IconComponent {
  if (!name) return Tag as unknown as IconComponent;
  const Icon = (Phosphor as unknown as Record<string, unknown>)[name];
  return (Icon ?? Tag) as unknown as IconComponent;
}

function statusFor(type: TxType, on: boolean): TransactionStatus {
  if (type === 'expense') return on ? 'paid' : 'unpaid';
  return on ? 'received' : 'unreceived';
}

export function AddEditTransactionScreen() {
  const router = useRouter();
  const { walletId } = useLocalSearchParams<{ walletId: string }>();
  const { user } = useAuth();
  const { categories } = useCategories();

  const [type, setType] = useState<TxType>('expense');
  const [valueText, setValueText] = useState('');
  const [statusOn, setStatusOn] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
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

  const categoriesForType = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type],
  );

  const categoryOptions: SelectOption[] = useMemo(
    () => categoriesForType.map((c) => ({
      label: c.name,
      value: c.id,
      icon: getIconComponent(c.icon),
      iconColor: c.color,
    })),
    [categoriesForType],
  );

  const recurrenceOptions: SelectOption[] = RECURRENCE_OPTIONS.map((o) => ({
    label: o.label,
    value: o.value,
  }));

  function validate(): boolean {
    const next: typeof errors = {};

    if (numericValue <= 0) {
      next.value = 'Informe um valor maior que R$ 0,00';
    }
    if (!categoryId) {
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
    const selectedCategory = categories.find((c) => c.id === categoryId);
    if (!user || !walletId || !selectedCategory) return;

    setSaving(true);
    try {
      if (paymentType === 'installment' && installmentsCount > 1) {
        // Cada parcela vira uma transação com data deslocada em N meses.
        // Apenas a primeira herda o status do toggle — futuras nascem pendentes.
        const perInstallment = numericValue / installmentsCount;
        const pendingStatus: TransactionStatus = type === 'expense' ? 'unpaid' : 'unreceived';

        const promises: Promise<string>[] = [];
        for (let i = 0; i < installmentsCount; i++) {
          const installmentDate = new Date(date);
          installmentDate.setMonth(installmentDate.getMonth() + i);

          promises.push(
            addTransaction(user.uid, walletId, {
              type,
              title: selectedCategory.name,
              description: observation,
              amount: perInstallment,
              categoryId: selectedCategory.id,
              status: i === 0 ? statusFor(type, statusOn) : pendingStatus,
              isRecurring: false,
              date: installmentDate,
              installmentIndex: i + 1,
              installmentTotal: installmentsCount,
            }),
          );
        }
        await Promise.all(promises);
      } else {
        await addTransaction(user.uid, walletId, {
          type,
          title: selectedCategory.name,
          description: observation,
          amount: numericValue,
          categoryId: selectedCategory.id,
          status: statusFor(type, statusOn),
          isRecurring: paymentType === 'recurring',
          date,
        });
      }
      router.back();
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível salvar a transação. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

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
              setStatusOn(false);
              // Clear category if it doesn't belong to the new type
              if (categoryId != null) {
                const cat = categories.find((c) => c.id === categoryId);
                if (cat && cat.type !== t) setCategoryId(null);
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
              value={categoryId}
              onChange={setCategoryId}
              searchable
disabled={categoriesForType.length === 0}
              helperText={
                categoriesForType.length === 0
                  ? `Nenhuma categoria de ${type === 'expense' ? 'despesa' : 'receita'} cadastrada`
                  : undefined
              }
              error={errors.category}
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
                label="Quantidade de parcelas"
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
                label="Tipo de recorrência"
                placeholder="Selecionar tipo"
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

      <View style={[styles.footer, { paddingBottom: spacing.xl }]}>
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
    fontSize: fs.md,
    fontWeight: fw.medium,
    color: colors.content,
    marginBottom: spacing.lg,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paymentItem: {
    flex: 1,
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
});
