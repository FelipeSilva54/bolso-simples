import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Portal } from '@/components/PortalProvider';
import { colors, radius, spacing } from '@/constants';

const SCREEN_HEIGHT = Dimensions.get('window').height;

let _nextId = 0;

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
};

export function BottomSheet({ visible, onClose, children, height }: BottomSheetProps) {
  const { bottom: bottomInset } = useSafeAreaInsets();
  const id = useRef(`bs-${_nextId++}`).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [interactive, setInteractive] = useState(false);

  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const panResponder = useRef(
    PanResponder.create({
      // false = não captura o toque inicial, então taps em botões filhos funcionam normalmente
      onStartShouldSetPanResponder: () => false,
      // Captura somente quando o movimento é predominantemente para baixo
      onMoveShouldSetPanResponder: (_, gs) => gs.dy > 10 && gs.dy > Math.abs(gs.dx),
      onPanResponderMove: (_, gs) => {
        if (gs.dy > 0) translateY.setValue(gs.dy);
      },
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 100 || gs.vy > 0.5) {
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onCloseRef.current());
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 0,
            speed: 20,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      setInteractive(true);
      Keyboard.dismiss();
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setInteractive(false);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  return (
    <Portal id={id}>
      <Animated.View
        style={[styles.backdrop, { opacity }]}
        pointerEvents={interactive ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <View style={styles.container} pointerEvents={interactive ? 'box-none' : 'none'}>
        <Animated.View
          style={[
            styles.sheet,
            height != null ? { height } : styles.sheetAuto,
            { transform: [{ translateY }], paddingBottom: bottomInset },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handleWrapper}>
            <View style={styles.handle} />
          </View>
          {children}
        </Animated.View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  sheetAuto: {
    maxHeight: SCREEN_HEIGHT * 0.90,
  },
  handleWrapper: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  handle: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
});
