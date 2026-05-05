import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { Checkbox } from '@/components/Checkbox';
import { FAB } from '@/components/FAB';
import { colors } from '@/constants';

export default function HomeRoute() {
  const [ativo, setAtivo] = useState(false);
  const [marcado, setMarcado] = useState(false);

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button onPress={() => {}}>Teste</Button>
      <Toggle
        value={ativo}
        onValueChange={setAtivo}
        accessibilityLabel="Toggle de teste"
      />
      <Checkbox
        value={marcado}
        onValueChange={setMarcado}
        accessibilityLabel="Checkbox de teste"
      />
      <FAB
        onPress={() => {}}
        label="Adicionar carteira"
        accessibilityLabel="Botão de adicionar"
        style={{ position: 'absolute', bottom: 24, right: 16 }}
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