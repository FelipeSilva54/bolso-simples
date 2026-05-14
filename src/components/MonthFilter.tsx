import React, { useRef, useEffect, useCallback } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ListRenderItem,
} from 'react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

type MonthFilterProps = {
  activeMonth: number; // 0-indexed
  activeYear: number;
  onChange: (month: number, year: number) => void;
};

type MonthItem = {
  month: number;
  year: number;
  key: string;
};

const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const ITEM_WIDTH = Dimensions.get('window').width / 3;
const MONTHS_BACK = 24;
const MONTHS_FORWARD = 12;

function buildMonthList(): MonthItem[] {
  const now = new Date();
  const base = { month: now.getMonth(), year: now.getFullYear() };
  const items: MonthItem[] = [];

  for (let i = -MONTHS_BACK; i <= MONTHS_FORWARD; i++) {
    let m = base.month + i;
    let y = base.year;
    while (m < 0) { m += 12; y--; }
    while (m > 11) { m -= 12; y++; }
    items.push({ month: m, year: y, key: `${y}-${m}` });
  }

  return items;
}

// Computed once — list is stable for the app session
const MONTH_LIST = buildMonthList();

export function MonthFilter({ activeMonth, activeYear, onChange }: MonthFilterProps) {
  const listRef = useRef<FlatList<MonthItem>>(null);

  const activeIndex = MONTH_LIST.findIndex(
    (item) => item.month === activeMonth && item.year === activeYear,
  );

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const renderItem: ListRenderItem<MonthItem> = useCallback(
    ({ item }) => {
      const isActive = item.month === activeMonth && item.year === activeYear;

      return (
        <TouchableOpacity
          style={styles.item}
          onPress={() => onChange(item.month, item.year)}
          activeOpacity={0.7}
          accessibilityLabel={`${MONTHS_SHORT[item.month]} ${item.year}`}
          accessibilityRole="button"
          accessibilityState={{ selected: isActive }}
        >
          <Text style={[styles.monthText, isActive && styles.monthTextActive]}>
            {MONTHS_SHORT[item.month]}/{item.year}
          </Text>
          {isActive && <View style={styles.indicator} />}
        </TouchableOpacity>
      );
    },
    [activeMonth, activeYear, onChange],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={MONTH_LIST}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        initialNumToRender={3}
        onScrollToIndexFailed={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 0.8,
    borderBottomColor: colors.border,
  },
  item: {
    width: ITEM_WIDTH,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.subcontent,
  },
  monthTextActive: {
    fontWeight: fw.semibold,
    color: colors.content,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 2.5,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
});
