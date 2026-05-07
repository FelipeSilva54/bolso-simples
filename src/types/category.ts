export type CategoryType = 'expense' | 'income';

export type Category = {
  id: string;
  name: string;
  icon: string;     // Nome do ícone do Phosphor React Native
  color: string;    // Hex
  type: CategoryType;
  isDefault: boolean;
};
