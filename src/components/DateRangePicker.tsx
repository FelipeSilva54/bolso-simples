import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';
import { BottomSheet } from '@/components/BottomSheet';

type DateRangePickerProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
};

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const;

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
] as const;

const DAY_CELL_SIZE = 44;
const DAY_CIRCLE_SIZE = 36;
const RANGE_BAR_INSET = (DAY_CELL_SIZE - DAY_CIRCLE_SIZE) / 2;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Date[] = [];

  const leadingCount = firstDay.getDay(); // 0 = Sunday, semana começa no domingo
  for (let i = leadingCount; i > 0; i--) {
    days.push(new Date(year, month, 1 - i));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }
  const trailing = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= trailing; d++) {
    days.push(new Date(year, month + 1, d));
  }

  return days;
}

function splitIntoWeeks(days: Date[]): Date[][] {
  const result: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    result.push(days.slice(i, i + 7));
  }
  return result;
}

export function DateRangePicker({
  visible,
  onClose,
  onConfirm,
  initialStartDate,
  initialEndDate,
}: DateRangePickerProps) {
  const today = useRef(new Date()).current;

  const initStartRef = useRef(initialStartDate);
  const initEndRef = useRef(initialEndDate);
  useEffect(() => { initStartRef.current = initialStartDate; }, [initialStartDate]);
  useEffect(() => { initEndRef.current = initialEndDate; }, [initialEndDate]);

  const [currentYear, setCurrentYear] = useState(
    () => (initialStartDate ?? today).getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    () => (initialStartDate ?? today).getMonth()
  );
  const [startDate, setStartDate] = useState<Date | undefined>(
    () => (initialStartDate ? startOfDay(initialStartDate) : undefined)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    () => (initialEndDate ? startOfDay(initialEndDate) : undefined)
  );

  useEffect(() => {
    if (!visible) return;
    const initStart = initStartRef.current ? startOfDay(initStartRef.current) : undefined;
    const initEnd = initEndRef.current ? startOfDay(initEndRef.current) : undefined;
    setStartDate(initStart);
    setEndDate(initEnd);
    const base = initStart ?? today;
    setCurrentYear(base.getFullYear());
    setCurrentMonth(base.getMonth());
  }, [visible, today]);

  const weeks = useMemo(
    () => splitIntoWeeks(buildCalendarDays(currentYear, currentMonth)),
    [currentYear, currentMonth]
  );

  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }, [currentMonth]);

  const handleDayPress = useCallback(
    (day: Date) => {
      const d = startOfDay(day);
      if (!startDate || endDate != null) {
        setStartDate(d);
        setEndDate(undefined);
      } else if (d.getTime() <= startDate.getTime()) {
        setStartDate(d);
        setEndDate(undefined);
      } else {
        setEndDate(d);
        onConfirm(startDate, d);
        onClose();
      }
    },
    [startDate, endDate, onConfirm, onClose]
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} height={420}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable
            onPress={goToPrevMonth}
            accessibilityLabel="Mês anterior"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.navButton}
          >
            <CaretLeft size={20} color={colors.content} weight="regular" />
          </Pressable>
          <Text style={styles.headerTitle}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </Text>
          <Pressable
            onPress={goToNextMonth}
            accessibilityLabel="Próximo mês"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.navButton}
          >
            <CaretRight size={20} color={colors.content} weight="regular" />
          </Pressable>
        </View>

        <View style={styles.weekDaysRow}>
          {WEEK_DAYS.map((label) => (
            <Text key={label} style={styles.weekDayLabel}>
              {label}
            </Text>
          ))}
        </View>

        <View>
          {weeks.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                const isCurrentMonth = day.getMonth() === currentMonth;
                const dayTime = day.getTime();
                const isStart = startDate != null && isSameDay(day, startDate);
                const isEnd = endDate != null && isSameDay(day, endDate);
                const isInRange =
                  startDate != null &&
                  endDate != null &&
                  dayTime > startDate.getTime() &&
                  dayTime < endDate.getTime();
                const isSelected = isStart || isEnd;
                const showRightBar = isStart && endDate != null && isCurrentMonth;
                const showLeftBar = isEnd && isCurrentMonth;
                const showFullBar = isInRange && isCurrentMonth;

                return (
                  <Pressable
                    key={di}
                    onPress={isCurrentMonth ? () => handleDayPress(day) : undefined}
                    disabled={!isCurrentMonth}
                    accessibilityLabel={
                      isCurrentMonth
                        ? `${day.getDate()} de ${MONTH_NAMES[day.getMonth()]} de ${day.getFullYear()}`
                        : undefined
                    }
                    style={styles.dayCell}
                  >
                    {showFullBar && <View style={[styles.rangeBar, styles.rangeBarFull]} />}
                    {showRightBar && <View style={[styles.rangeBar, styles.rangeBarRight]} />}
                    {showLeftBar && <View style={[styles.rangeBar, styles.rangeBarLeft]} />}
                    <View style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}>
                      <Text
                        style={[
                          styles.dayText,
                          !isCurrentMonth && styles.dayTextMuted,
                          isSelected && styles.dayTextSelected,
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  navButton: {
    width: DAY_CELL_SIZE,
    height: DAY_CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fs.md,
    fontWeight: fw.semibold,
    color: colors.content,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: fs.xs,
    fontWeight: fw.medium,
    color: colors.muted,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    height: DAY_CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeBar: {
    position: 'absolute',
    top: RANGE_BAR_INSET,
    bottom: RANGE_BAR_INSET,
    backgroundColor: colors.background,
  },
  rangeBarFull: {
    left: 0,
    right: 0,
  },
  rangeBarRight: {
    left: '50%',
    right: 0,
    borderTopLeftRadius: DAY_CIRCLE_SIZE / 2,
    borderBottomLeftRadius: DAY_CIRCLE_SIZE / 2,
  },
  rangeBarLeft: {
    left: 0,
    right: '50%',
    borderTopRightRadius: DAY_CIRCLE_SIZE / 2,
    borderBottomRightRadius: DAY_CIRCLE_SIZE / 2,
  },
  dayCircle: {
    width: DAY_CIRCLE_SIZE,
    height: DAY_CIRCLE_SIZE,
    borderRadius: DAY_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: fs.sm,
    fontWeight: fw.regular,
    color: colors.content,
  },
  dayTextMuted: {
    color: colors.muted,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: fw.medium,
  },
});
