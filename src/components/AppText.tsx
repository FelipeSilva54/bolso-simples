import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';

const weightToFamily: Record<string, string> = {
  '100': 'Inter_400Regular',
  '200': 'Inter_400Regular',
  '300': 'Inter_400Regular',
  '400': 'Inter_400Regular',
  'normal': 'Inter_400Regular',
  '500': 'Inter_500Medium',
  '600': 'Inter_600SemiBold',
  '700': 'Inter_700Bold',
  'bold': 'Inter_700Bold',
  '800': 'Inter_700Bold',
  '900': 'Inter_700Bold',
};

export default function AppText({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const weight = flat?.fontWeight as string | undefined;
  const fontFamily = weightToFamily[weight ?? '400'] ?? 'Inter_400Regular';

  const resolvedStyle: TextStyle = {
    ...flat,
    fontFamily,
    fontWeight: undefined,
  };

  return <Text style={resolvedStyle} {...props} />;
}
