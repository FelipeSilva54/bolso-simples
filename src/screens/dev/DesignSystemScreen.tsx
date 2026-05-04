import React from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DesignSystemParamList } from './types';

type Props = NativeStackScreenProps<DesignSystemParamList, 'Home'>;

type ComponentItem = {
  name: string;
  screen: keyof Omit<DesignSystemParamList, 'Home'>;
  description: string;
};

type SectionData = {
  title: string;
  data: ComponentItem[];
};

const SECTIONS: SectionData[] = [
  {
    title: 'Tipografia',
    data: [
      { name: 'Text', screen: 'Text', description: 'Texto, tamanhos e estilos' },
      { name: 'Heading', screen: 'Heading', description: 'Títulos h1–h6' },
    ],
  },
  {
    title: 'Layout',
    data: [
      { name: 'Layout', screen: 'Layout', description: 'Box, HStack, VStack, Center, Grid, View' },
    ],
  },
  {
    title: 'Ações',
    data: [
      { name: 'Button', screen: 'Button', description: 'Variantes, tamanhos e estados' },
      { name: 'FAB', screen: 'FAB', description: 'Floating Action Button' },
      { name: 'Pressable', screen: 'Pressable', description: 'Área de toque genérica' },
      { name: 'Link', screen: 'Link', description: 'Links e âncoras' },
    ],
  },
  {
    title: 'Formulários',
    data: [
      { name: 'Input', screen: 'Input', description: 'Campo de texto' },
      { name: 'Textarea', screen: 'Textarea', description: 'Campo de texto longo' },
      { name: 'Select', screen: 'Select', description: 'Seleção de opções' },
      { name: 'Checkbox', screen: 'Checkbox', description: 'Seleção múltipla' },
      { name: 'Radio', screen: 'Radio', description: 'Seleção única' },
      { name: 'Switch', screen: 'Switch', description: 'Alternância on/off' },
      { name: 'Slider', screen: 'Slider', description: 'Seleção de intervalo' },
      { name: 'FormControl', screen: 'FormControl', description: 'Label, helper e erro' },
    ],
  },
  {
    title: 'Exibição',
    data: [
      { name: 'Badge', screen: 'Badge', description: 'Etiquetas e status' },
      { name: 'Avatar', screen: 'Avatar', description: 'Imagem de perfil' },
      { name: 'Icon', screen: 'Icon', description: 'Ícones Phosphor' },
      { name: 'Image', screen: 'Image', description: 'Imagens com fallback' },
      { name: 'Divider', screen: 'Divider', description: 'Separador horizontal/vertical' },
      { name: 'Card', screen: 'Card', description: 'Cartão de conteúdo' },
      { name: 'Table', screen: 'Table', description: 'Tabela de dados' },
    ],
  },
  {
    title: 'Feedback',
    data: [
      { name: 'Alert', screen: 'Alert', description: 'Alertas inline' },
      { name: 'Spinner', screen: 'Spinner', description: 'Indicador de carregamento' },
      { name: 'Progress', screen: 'Progress', description: 'Barra de progresso' },
      { name: 'Skeleton', screen: 'Skeleton', description: 'Placeholder de carregamento' },
      { name: 'Toast', screen: 'Toast', description: 'Notificações temporárias' },
    ],
  },
  {
    title: 'Overlay',
    data: [
      { name: 'Modal', screen: 'Modal', description: 'Diálogo em camada' },
      { name: 'AlertDialog', screen: 'AlertDialog', description: 'Diálogo de confirmação' },
      { name: 'Tooltip', screen: 'Tooltip', description: 'Dica flutuante' },
      { name: 'Popover', screen: 'Popover', description: 'Conteúdo flutuante' },
      { name: 'Drawer', screen: 'Drawer', description: 'Painel lateral' },
      { name: 'BottomSheet', screen: 'BottomSheet', description: 'Painel inferior' },
      { name: 'ActionSheet', screen: 'ActionSheet', description: 'Menu de ações' },
    ],
  },
  {
    title: 'Navegação',
    data: [
      { name: 'Menu', screen: 'Menu', description: 'Menu dropdown' },
      { name: 'Accordion', screen: 'Accordion', description: 'Seções expansíveis' },
    ],
  },
];

export function DesignSystemScreen({ navigation }: Props) {
  return (
    <SectionList
      style={styles.list}
      sections={SECTIONS}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate(item.screen)}
          activeOpacity={0.6}
        >
          <View style={styles.itemText}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      )}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  itemDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  chevron: {
    fontSize: 20,
    color: '#D1D5DB',
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 16,
  },
});
