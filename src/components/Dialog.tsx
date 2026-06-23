import React, { useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import AppText from '@/components/AppText';
import Svg, { Path } from 'react-native-svg';
import { Broom } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { useLanguage } from '@/store/LanguageContext';

type DialogProps = {
  visible: boolean;
  title: string;
  description: string;
  variant?: 'delete' | 'clear' | 'disconnect';
  confirmLabel?: string;
  cancelLabel?: string;
  requireConfirmation?: boolean;
  confirmationLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function TrashIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6H21" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M19 6L18.3333 20C18.3333 20.5523 17.8856 21 17.3333 21H6.66667C6.11438 21 5.66667 20.5523 5.66667 20L5 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 11V17" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M14 11V17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}


export function Dialog({
  visible,
  title,
  description,
  variant = 'delete',
  confirmLabel,
  cancelLabel,
  requireConfirmation = false,
  confirmationLabel,
  loading = false,
  onConfirm,
  onCancel,
}: DialogProps) {
  const { t } = useLanguage();
  const [checked, setChecked] = useState(false);

  const resolvedConfirmLabel = confirmLabel ?? t('dialog.confirmDefault');
  const resolvedCancelLabel = cancelLabel ?? t('dialog.cancelDefault');
  const resolvedConfirmationLabel = confirmationLabel ?? t('dialog.confirmationDefault');

  function handleCancel() {
    setChecked(false);
    onCancel();
  }

  function handleConfirm() {
    setChecked(false);
    onConfirm();
  }

  const showIcon = variant === 'delete' || variant === 'clear';
  const iconBgColor = variant === 'delete' ? colors.dangerLight : colors.infoLight;
  const iconColor = variant === 'delete' ? colors.danger : colors.info;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.backdrop} onPress={handleCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>

          {showIcon && (
            <View style={[styles.iconCircle, { backgroundColor: iconBgColor }]}>
              {variant === 'delete'
                ? <TrashIcon color={iconColor} />
                : <Broom size={22} color={iconColor} weight="regular" />
              }
            </View>
          )}

          <View style={styles.content}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.description}>{description}</AppText>
          </View>

          {requireConfirmation && (
            <View style={styles.checkboxRow}>
              <Checkbox
                value={checked}
                onValueChange={setChecked}
                label={resolvedConfirmationLabel}
                accessibilityLabel={resolvedConfirmationLabel}
              />
            </View>
          )}

          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <Button variant="soft" size="sm" onPress={handleCancel}>
                {resolvedCancelLabel}
              </Button>
            </View>
            <View style={styles.actionButton}>
              <Button
                variant={variant === 'clear' ? 'primary' : 'danger'}
                size="sm"
                disabled={(requireConfirmation && !checked) || loading}
                loading={loading}
                onPress={handleConfirm}
              >
                {resolvedConfirmLabel}
              </Button>
            </View>
          </View>

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.xl,
  },
  content: {
    gap: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: fs.xl,
    fontWeight: fw.semibold,
    color: colors.content,
    textAlign: 'center',
  },
  description: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
    lineHeight: 22,
    textAlign: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkboxRow: {
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
});
