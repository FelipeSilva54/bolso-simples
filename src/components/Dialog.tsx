import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
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

function TrashIllustration() {
  return (
    <Svg width={96} height={120} viewBox="0 0 174 218">
      <Path fillRule="evenodd" clipRule="evenodd" d="M137.998 217.234H0.00683594V47.239H137.998V217.234Z" fill="#FF3A2F" />
      <Path opacity={0.25} fillRule="evenodd" clipRule="evenodd" d="M113.693 47.828V165.855C113.693 179.792 102.343 191.089 88.3392 191.089H0.28418V217.137H137.948V47.828H113.693Z" fill="#020403" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M40.5039 195.739C38.5079 195.739 37.0039 194.12 37.0039 192.125V90.9139C37.0039 88.9169 38.5079 87.299 40.5039 87.299C42.4999 87.299 44.0039 88.9169 44.0039 90.9139V192.125C44.0039 194.12 42.4999 195.739 40.5039 195.739Z" fill="#142A3B" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M94.501 195.739C92.505 195.739 91.001 194.12 91.001 192.125V90.9139C91.001 88.9169 92.505 87.299 94.501 87.299C96.497 87.299 98.001 88.9169 98.001 90.9139V192.125C98.001 194.12 96.497 195.739 94.501 195.739Z" fill="#142A3B" />
      <Path opacity={0.35} fillRule="evenodd" clipRule="evenodd" d="M137.193 68.385V47.828H1.97363L137.193 68.385Z" fill="#020403" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M115.919 41.535L60.5322 24.103L68.1942 -0.0150146L123.582 17.417L115.919 41.535Z" fill="#FF3A2F" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M167.848 63.301C167.307 63.301 166.761 63.22 166.219 63.049L6.97864 12.932C4.12064 12.033 2.53364 8.98904 3.43364 6.13304C4.33364 3.27504 7.37764 1.69104 10.2316 2.58804L169.472 52.704C172.331 53.604 173.917 56.649 173.016 59.505C172.29 61.819 170.152 63.301 167.848 63.301Z" fill="#FF3A2F" />
    </Svg>
  );
}

function BroomIllustration() {
  return (
    <Svg width={74} height={120} viewBox="0 0 135 218">
      <Path fillRule="evenodd" clipRule="evenodd" d="M47.852 215.115H61.563L67.244 185.649V216.895H91.404V184.394C91.404 184.394 108.073 215.115 121.28 215.115H134.488C126.39 192.508 127.43 187.576 134.488 168.063V122.728C134.488 107.979 122.533 96.025 107.785 96.025H26.703C11.955 96.025 0 107.979 0 122.728V214.628H20.215V181.873L24.903 213.721H34.728L38.939 189.861L47.852 215.115Z" fill="#FBB713" />
      <Path opacity={0.25} fillRule="evenodd" clipRule="evenodd" d="M51.9611 215.115V195.839L48.2451 215.115H51.9611Z" fill="black" />
      <Path opacity={0.25} fillRule="evenodd" clipRule="evenodd" d="M23.6553 200.05L23.2383 202.412L24.9033 213.721H28.4813L23.6553 200.05Z" fill="black" />
      <Path opacity={0.25} fillRule="evenodd" clipRule="evenodd" d="M4.93066 192.062V214.628H8.25266L4.93066 192.062Z" fill="black" />
      <Path opacity={0.25} fillRule="evenodd" clipRule="evenodd" d="M76.1211 194.583V216.895H91.4041V216.28C82.9951 207.215 76.1211 194.583 76.1211 194.583Z" fill="black" />
      <Path opacity={0.25} fillRule="evenodd" clipRule="evenodd" d="M134.488 122.728C134.488 107.979 122.533 96.025 107.785 96.025H26.7031C17.8511 96.025 10.0651 100.381 5.20605 107.014C7.20905 106.535 9.27005 106.214 11.4191 106.214H92.5021C107.249 106.214 119.205 118.169 119.205 132.916V178.252C113.605 193.732 111.814 200.062 115.348 213.293C117.357 214.407 119.356 215.115 121.281 215.115H134.488C126.39 192.508 127.43 187.576 134.488 168.063V122.728Z" fill="black" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M81.5879 97.884L89.7899 15.867C90.6389 7.38101 83.9749 0.0150146 75.4449 0.0150146H59.0419C50.5139 0.0150146 43.8489 7.38101 44.6969 15.867L52.8989 97.884H81.5879Z" fill="#142A3B" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M70.8458 44.396L72.9068 23.798C73.1188 21.668 71.4448 19.818 69.3028 19.818H65.1838C63.0418 19.818 61.3688 21.668 61.5818 23.798L63.6408 44.396H70.8458Z" fill="#EDEDED" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M134.488 144.697H0.000976562V137.467H134.488V144.697Z" fill="#142A3B" />
      <Path fillRule="evenodd" clipRule="evenodd" d="M134.488 129.917H0.000976562V122.687H134.488V129.917Z" fill="#142A3B" />
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.backdrop} onPress={handleCancel}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>

          {variant === 'delete' && (
            <View style={styles.illustration}>
              <TrashIllustration />
            </View>
          )}

          {variant === 'clear' && (
            <View style={styles.illustration}>
              <BroomIllustration />
            </View>
          )}

          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
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
              <Button variant="outlined" size="sm" onPress={handleCancel}>
                {resolvedCancelLabel}
              </Button>
            </View>
            <View style={styles.actionButton}>
              <Button
                variant="danger"
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
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  illustration: {
    marginBottom: spacing.lg,
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
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
    textAlign: 'center',
    lineHeight: 24,
  },
  checkboxRow: {
    marginBottom: spacing.xl,
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
