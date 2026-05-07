import { CategoryType } from '@/types/category';

export type DefaultCategory = {
  name: string;
  icon: string;     // Nome exato do export do phosphor-react-native
  color: string;
  type: CategoryType;
};

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Despesas
  { name: 'Alimentação',           icon: 'ForkKnife',      color: '#E67E22', type: 'expense' },
  { name: 'Assinaturas e serviços', icon: 'Television',     color: '#8E44AD', type: 'expense' },
  { name: 'Bares e restaurantes',  icon: 'Wine',           color: '#C0392B', type: 'expense' },
  { name: 'Casa',                  icon: 'House',          color: '#16A085', type: 'expense' },
  { name: 'Compras',               icon: 'ShoppingBag',    color: '#D35400', type: 'expense' },
  { name: 'Cuidados pessoais',     icon: 'HandSoap',       color: '#E91E63', type: 'expense' },
  { name: 'Dívidas e empréstimos', icon: 'Bank',           color: '#7F8C8D', type: 'expense' },
  { name: 'Educação',              icon: 'GraduationCap',  color: '#2980B9', type: 'expense' },
  { name: 'Família e filhos',      icon: 'Baby',           color: '#F39C12', type: 'expense' },
  { name: 'Impostos e taxas',      icon: 'Receipt',        color: '#34495E', type: 'expense' },
  { name: 'Investimentos',         icon: 'ChartLineUp',    color: '#27AE60', type: 'expense' },
  { name: 'Lazer e hobbies',       icon: 'GameController', color: '#9B59B6', type: 'expense' },
  { name: 'Mercado',               icon: 'ShoppingCart',   color: '#E74C3C', type: 'expense' },
  { name: 'Pets',                  icon: 'PawPrint',       color: '#F1C40F', type: 'expense' },
  { name: 'Presentes e doações',   icon: 'Gift',           color: '#E84393', type: 'expense' },
  { name: 'Saúde',                 icon: 'Heartbeat',      color: '#EB2F06', type: 'expense' },
  { name: 'Tarifas bancárias',     icon: 'CreditCard',     color: '#576574', type: 'expense' },
  { name: 'Transporte',            icon: 'Car',            color: '#3498DB', type: 'expense' },
  { name: 'Vestuário',             icon: 'TShirt',         color: '#A569BD', type: 'expense' },
  { name: 'Viagens',               icon: 'Airplane',       color: '#1ABC9C', type: 'expense' },
  { name: 'Outros',                icon: 'DotsThree',      color: '#95A5A6', type: 'expense' },

  // Receitas
  { name: 'Salário',               icon: 'Money',          color: '#27AE60', type: 'income' },
  { name: 'Freelance',             icon: 'Briefcase',      color: '#16A085', type: 'income' },
  { name: 'Investimentos',         icon: 'ChartLineUp',    color: '#2ECC71', type: 'income' },
  { name: 'Aluguel recebido',      icon: 'Buildings',      color: '#3498DB', type: 'income' },
  { name: 'Vendas',                icon: 'Storefront',     color: '#E67E22', type: 'income' },
  { name: 'Reembolso',             icon: 'ArrowUUpLeft',   color: '#9B59B6', type: 'income' },
  { name: 'Presentes',             icon: 'Gift',           color: '#E84393', type: 'income' },
  { name: 'Bonificação',           icon: 'Star',           color: '#F39C12', type: 'income' },
  { name: 'Rendimentos',           icon: 'TrendUp',        color: '#1ABC9C', type: 'income' },
  { name: 'Outros',                icon: 'DotsThree',      color: '#95A5A6', type: 'income' },
];
