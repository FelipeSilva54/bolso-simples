import React, { useRef, useEffect, useCallback } from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
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
const ITEM_WIDTH = 56;
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
const CURRENT_YEAR = new Date().getFullYear();

export function MonthFilter({ activeMonth, activeYear, onChange }: MonthFilterProps) {
  const listRef = useRef<FlatList<MonthItem>>(null);

  const activeIndex = MONTH_LIST.findIndex(
    (item) => item.month === activeMonth && item.year === activeYear,
  );

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    // Delay ensures layout is complete before scrollToIndex
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
      const showYear = item.year !== CURRENT_YEAR;

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
            {MONTHS_SHORT[item.month]}
          </Text>
          {showYear && (
            <Text style={[styles.yearText, isActive && styles.yearTextActive]}>
              {item.year}
            </Text>
          )}
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
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        initialNumToRender={9}
        onScrollToIndexFailed={() => {}}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    paddingHorizontal: spacing.md,
  },
  item: {
    width: ITEM_WIDTH,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
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
  yearText: {
    fontSize: fs.xs,
    fontWeight: fw.regular,
    color: colors.muted,
  },
  yearTextActive: {
    color: colors.subcontent,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing.sm,
    right: spacing.sm,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
});
