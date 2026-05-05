import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/Button';
import { Toggle } from '@/components/Toggle';
import { Checkbox } from '@/components/Checkbox';
import { FAB } from '@/components/FAB';
import { TabBar } from '@/components/TabBar';
import { StatusBadge } from '@/components/StatusBadge';
import { InfoAlert } from '@/components/InfoAlert';
import { TextInput } from '@/components/TextInput';
import { TransactionItem } from '@/components/TransactionItem';
import { Car } from 'phosphor-react-native';
import { BalanceDisplay } from '@/components/BalanceDisplay';

import { colors, fontWeight as fw } from '@/constants';

export default function HomeRoute() {
  const [ativo, setAtivo] = useState(false);
  const [marcado, setMarcado] = useState(false);
  const [activeTab, setActiveTab] = useState('comum');
  const [nome, setNome] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [hide, setHide] = useState(false);

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
      <TabBar
      tabs={[
        { key: 'comum', label: 'Jan/2024' },
        { key: 'despensa', label: 'Fev/2024' },
        { key: 'outro', label: 'Mar/2024' },
             ]}
        activeKey={activeTab}
        onTabPress={setActiveTab}
      />
      <InfoAlert>
              Despesas{' '}
        <Text style={{ fontWeight: fw.medium }}>não pagas</Text>
        {' '}e receitas{' '}
        <Text style={{ fontWeight: fw.medium }}>não recebidas</Text>
        {' '}não são consideradas no saldo do mês.
      </InfoAlert>
      <StatusBadge variant="danger" label="Não pago" />
      <StatusBadge variant="info" label="Recorrente" />
      <StatusBadge variant="success" label="Pago" />
      <TextInput
        label="Apelido da carteira"
        placeholder="Ex: Carteira do Thiago"
        value={nome}
        onChangeText={setNome}
        helperText="Esse nome aparece na sua lista de carteiras"
      />
      <TransactionItem
        icon={Car}
        iconColor="#D4832A"
        title="Categoria"
        description="Teste de descrição"
        amount={-30}
        badgeVariant="danger"
        badgeLabel="Não pago"
        onPress={() => {}}
      />
      <BalanceDisplay
        variant="wallet"
        subtitle="Saldo da carteira:"
        balance={1250}
        hideBalance={hide}
        onToggleVisibility={() => setHide(!hide)}
        onTodayPress={() => {/* navega para o mês atual */}}
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