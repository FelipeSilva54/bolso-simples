import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
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
import { addTransaction, updateTransaction, getTransaction } from '@/services/transactions';
import { TransactionStatus } from '@/types/transaction';
import { parseCurrency, formatCurrency } from '@/utils/currency';
import { usePreferences } from '@/store/PreferencesContext';
import { useToast } from '@/store/ToastContext';
import { useLanguage } from '@/store/LanguageContext';

type TxType = 'expense' | 'income';
type PaymentType = 'cash' | 'installment' | 'recurring';


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

function derivePaymentType(isRecurring: boolean, installmentTotal?: number): PaymentType {
  if (isRecurring) return 'recurring';
  if (installmentTotal != null && installmentTotal > 1) return 'installment';
  return 'cash';
}

export function AddEditTransactionScreen() {
  const router = useRouter();
  const { walletId, transactionId } = useLocalSearchParams<{
    walletId: string;
    transactionId?: string;
  }>();
  const { user } = useAuth();
  const { categories } = useCategories();
  const { preferences } = usePreferences();

  const isEditing = Boolean(transactionId);

  const [loadingTx, setLoadingTx] = useState(isEditing);
  const [type, setType] = useState<TxType>('expense');
  const [valueText, setValueText] = useState('');
  const [statusOn, setStatusOn] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [observation, setObservation] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('cash');

  function handlePaymentType(type: PaymentType) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPaymentType(type);
  }
  const [installments, setInstallments] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    value?: string;
    category?: string;
    installments?: string;
    recurrence?: string;
  }>({});

  const { showToast } = useToast();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);

  const RECURRENCE_OPTIONS = useMemo(() => [
    { value: 'daily', label: t('transaction.recurrenceDaily') },
    { value: 'weekly', label: t('transaction.recurrenceWeekly') },
    { value: 'biweekly', label: t('transaction.recurrenceBiweekly') },
    { value: 'monthly', label: t('transaction.recurrenceMonthly') },
    { value: 'bimonthly', label: t('transaction.recurrenceBimonthly') },
    { value: 'quarterly', label: t('transaction.recurrenceQuarterly') },
    { value: 'semiannually', label: t('transaction.recurrenceSemiannually') },
    { value: 'annually', label: t('transaction.recurrenceAnnually') },
  ], [t]);

  useEffect(() => {
    if (!transactionId || !user || !walletId) return;

    let cancelled = false;
    setLoadingTx(true);

    getTransaction(user.uid, walletId, transactionId)
      .then((tx) => {
        if (cancelled || !tx) return;
        const txType: TxType =
          tx.type === 'income' || tx.type === 'expense' ? tx.type : 'expense';
        setType(txType);
        setValueText(formatCurrency(tx.amount, preferences.currency));
        setStatusOn(tx.status === 'paid' || tx.status === 'received');
        setCategoryId(tx.categoryId);
        setDate(tx.date);
        setObservation(tx.description);
        const pt = derivePaymentType(tx.isRecurring, tx.installmentTotal);
        setPaymentType(pt);
        if (pt === 'installment' && tx.installmentTotal != null) {
          setInstallments(String(tx.installmentTotal));
        }
        if (pt === 'recurring') {
          setRecurrenceType(tx.recurrenceType ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          Alert.alert(t('common.error'), t('transaction.errorLoad'));
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingTx(false);
      });

    return () => {
      cancelled = true;
    };
  }, [transactionId, user, walletId]);

  const numericValue = parseCurrency(valueText, preferences.currency);
  const installmentsCount = parseInt(installments || '0', 10);
  const installmentValue = installmentsCount > 0 ? numericValue / installmentsCount : 0;
  const installmentsHelper =
    installmentsCount > 1 && numericValue > 0
      ? `${installmentsCount}x de ${formatCurrency(installmentValue, preferences.currency)}`
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
      next.value = t('transaction.validationValue');
    }
    if (!categoryId) {
      next.category = t('transaction.validationCategory');
    }
    if (paymentType === 'installment') {
      if (!Number.isInteger(installmentsCount) || installmentsCount < 2) {
        next.installments = t('transaction.validationInstallments');
      }
    }
    if (paymentType === 'recurring' && !recurrenceType) {
      next.recurrence = t('transaction.validationRecurrence');
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
      if (isEditing && transactionId) {
        await updateTransaction(user.uid, walletId, transactionId, {
          type,
          title: selectedCategory.name,
          description: observation,
          amount: numericValue,
          categoryId: selectedCategory.id,
          status: statusFor(type, statusOn),
          isRecurring: paymentType === 'recurring',
          recurrenceType: paymentType === 'recurring' ? (recurrenceType ?? undefined) : undefined,
          date,
        });
      } else if (paymentType === 'installment' && installmentsCount > 1) {
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
        router.back();
        showToast(t('transaction.added'));
        return;
      } else {
        await addTransaction(user.uid, walletId, {
          type,
          title: selectedCategory.name,
          description: observation,
          amount: numericValue,
          categoryId: selectedCategory.id,
          status: statusFor(type, statusOn),
          isRecurring: paymentType === 'recurring',
          recurrenceType: paymentType === 'recurring' ? (recurrenceType ?? undefined) : undefined,
          date,
        });
        if (!isEditing) {
          router.back();
          showToast(t('transaction.added'));
          return;
        }
      }
      router.back();
    } catch {
      Alert.alert(t('transaction.errorSaveTitle'), t('transaction.errorSave'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="light" />

      <Header
        title={isEditing ? t('transaction.editTitle') : t('transaction.addTitle')}
        variant="screen"
        theme="dark"
        showBackButton
        onBackPress={() => router.back()}
      />

      {loadingTx ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
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
                label={t('transaction.categoryLabel')}
                placeholder={t('transaction.categoryPlaceholder')}
                sheetTitle={t('transaction.categoryPlaceholder')}
                options={categoryOptions}
                value={categoryId}
                onChange={setCategoryId}
                searchable
                disabled={categoriesForType.length === 0}
                helperText={
                  categoriesForType.length === 0
                    ? t(type === 'expense' ? 'transaction.noCategoryExpense' : 'transaction.noCategoryIncome')
                    : undefined
                }
                error={errors.category}
                accessibilityLabel={t('transaction.categoryPlaceholder')}
              />

              {/* Data */}
              <DateInput
                label={t('transaction.dateLabel')}
                value={date}
                onChange={setDate}
                accessibilityLabel={t('date.selectDate')}
              />

              {/* Observação */}
              <TextInput
                label={t('transaction.notesLabel')}
                value={observation}
                onChangeText={setObservation}
                placeholder={t('transaction.notesPlaceholder')}
                accessibilityLabel={t('transaction.notesLabel')}
              />

              {/* Toggle status */}
              <View style={styles.toggleRow}>
                <Toggle
                  value={statusOn}
                  onValueChange={setStatusOn}
                  accessibilityLabel={type === 'expense' ? t('transaction.alreadyPaid') : t('transaction.alreadyReceived')}
                />
                <Text style={styles.toggleLabel}>
                  {type === 'expense' ? t('transaction.alreadyPaid') : t('transaction.alreadyReceived')}
                </Text>
              </View>

              {/* Tipo de pagamento */}
              <View>
                <Text style={styles.sectionLabel}>{t('transaction.paymentTypeLabel')}</Text>
                <View style={styles.paymentRow}>
                  <View style={styles.paymentItem}>
                    <Button
                      variant="outlined"
                      size="sm"
                      selected={paymentType === 'cash'}
                      onPress={() => handlePaymentType('cash')}
                    >
                      {t('transaction.paymentTypeCash')}
                    </Button>
                  </View>
                  <View style={styles.paymentItem}>
                    <Button
                      variant="outlined"
                      size="sm"
                      selected={paymentType === 'installment'}
                      onPress={() => handlePaymentType('installment')}
                    >
                      {t('transaction.paymentTypeInstallment')}
                    </Button>
                  </View>
                  <View style={styles.paymentItem}>
                    <Button
                      variant="outlined"
                      size="sm"
                      selected={paymentType === 'recurring'}
                      onPress={() => handlePaymentType('recurring')}
                    >
                      {t('transaction.paymentTypeRecurring')}
                    </Button>
                  </View>
                </View>
              </View>

              {/* Parcelas */}
              {paymentType === 'installment' && (
                <TextInput
                  label={t('transaction.installmentsLabel')}
                  value={installments}
                  onChangeText={(v) => setInstallments(v.replace(/\D/g, ''))}
                  keyboardType="numeric"
                  placeholder={t('transaction.installmentsPlaceholder')}
                  accessibilityLabel={t('transaction.installmentsLabel')}
                  error={errors.installments}
                  helperText={installmentsHelper}
                />
              )}

              {/* Recorrência */}
              {paymentType === 'recurring' && (
                <SelectInput
                  label={t('transaction.recurrenceTypeLabel')}
                  placeholder={t('transaction.recurrenceTypePlaceholder')}
                  sheetTitle={t('transaction.recurrenceTypeLabel')}
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
      )}

      <View style={[styles.footer, { paddingBottom: spacing.md }]}>
        <Button
          variant="primary"
          onPress={handleSave}
          loading={saving}
          disabled={loadingTx}
        >
          {isEditing ? t('transaction.saveChanges') : t('transaction.saveButton')}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
