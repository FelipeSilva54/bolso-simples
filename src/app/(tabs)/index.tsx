import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants';
import { Image } from 'react-native';


export default function HomeRoute() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/Logo-Vertical.png')}
        style={{ width: 120, height: 40 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
});