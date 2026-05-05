import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { colors } from '@/constants';

export default function HomeRoute() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button onPress={() => {}}>Teste</Button>
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