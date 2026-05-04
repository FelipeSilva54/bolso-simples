import React, { useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, View } from 'react-native';
import { colors, Label, ScreenWrapper, Section } from './_shared';

function Slider({
  initialValue = 50,
  min = 0,
  max = 100,
  color = colors.primary,
  disabled = false,
}: {
  initialValue?: number;
  min?: number;
  max?: number;
  color?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const trackWidth = useRef(0);

  const pct = ((value - min) / (max - min)) * 100;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onPanResponderMove: (_, g) => {
      if (trackWidth.current === 0) return;
      const raw = (g.moveX - 16) / trackWidth.current;
      const clamped = Math.min(1, Math.max(0, raw));
      setValue(Math.round(min + clamped * (max - min)));
    },
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View
        style={[styles.track, disabled && { opacity: 0.4 }]}
        onLayout={(e) => { trackWidth.current = e.nativeEvent.layout.width; }}
      >
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
        <View style={[styles.thumb, { left: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
}

export function SliderScreen() {
  return (
    <ScreenWrapper>
      <Section title="Valores">
        <Label text="0%" /><Slider initialValue={0} />
        <Label text="25%" /><Slider initialValue={25} />
        <Label text="50%" /><Slider initialValue={50} />
        <Label text="75%" /><Slider initialValue={75} />
        <Label text="100%" /><Slider initialValue={100} />
      </Section>

      <Section title="Cores">
        <Label text="Primary" /><Slider initialValue={60} color={colors.primary} />
        <Label text="Success" /><Slider initialValue={80} color={colors.success} />
        <Label text="Warning" /><Slider initialValue={45} color={colors.warning} />
        <Label text="Danger" /><Slider initialValue={20} color={colors.danger} />
      </Section>

      <Section title="Estados">
        <Label text="Interativo (arraste)" /><Slider initialValue={40} />
        <Label text="Disabled" /><Slider initialValue={60} disabled />
      </Section>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginLeft: -10,
    top: -7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  valueText: {
    fontSize: 12,
    color: colors.textMuted,
    width: 30,
    textAlign: 'right',
  },
});
