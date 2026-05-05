import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Tab } from '@/components/Tab';
import { colors } from '@/constants';

type TabItem = {
  key: string;
  label: string;
};

type TabBarProps = {
  tabs: TabItem[];
  activeKey: string;
  onTabPress: (key: string) => void;
};

export function TabBar({ tabs, activeKey, onTabPress }: TabBarProps) {
  // Guarda a posição (x) e largura de cada tab medida pelo onLayout
  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({});

  // Valores animados para posição horizontal e largura do indicador
  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  // Sempre que o tab ativo mudar E já tivermos as medidas, animamos o indicador
  useEffect(() => {
    const layout = tabLayouts[activeKey];
    if (!layout) return;

    Animated.spring(indicatorX, {
      toValue: layout.x,
      useNativeDriver: false, // false porque estamos animando 'left' e 'width' — propriedades de layout
      bounciness: 0,          // Sem quique — movimento linear e limpo
      speed: 20,
    }).start();

    Animated.spring(indicatorWidth, {
      toValue: layout.width,
      useNativeDriver: false,
      bounciness: 0,
      speed: 20,
    }).start();
  }, [activeKey, tabLayouts]);

  function handleLayout(key: string, event: LayoutChangeEvent) {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [key]: { x, width } }));
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab) => (
          // A View com onLayout envolve cada Tab para capturar posição e largura reais
          <View
            key={tab.key}
            onLayout={(e) => handleLayout(tab.key, e)}
          >
            <Tab
              label={tab.label}
              active={tab.key === activeKey}
              onPress={() => onTabPress(tab.key)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Linha separadora global — fica atrás do indicador */}
      <View style={styles.separator} />

      {/* Indicador animado — fica sobre a linha separadora */}
      <Animated.View
        style={[
          styles.indicator,
          {
            left: indicatorX,
            width: indicatorWidth,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});