import { CategoryType } from '@/types/category';

export type DefaultCategory = {
  nameKey: string;  // chave de tradução (categories.defaults.*)
  name: string;     // nome em português (fallback e seed no Firestore)
  icon: string;     // Nome exato do export do phosphor-react-native
  color: string;
  type: CategoryType;
};

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  // Despesas
  { nameKey: 'categories.defaults.food',             name: 'Alimentação',           icon: 'ForkKnife',      color: '#E67E22', type: 'expense' },
  { nameKey: 'categories.defaults.subscriptions',    name: 'Assinaturas e serviços', icon: 'Television',     color: '#8E44AD', type: 'expense' },
  { nameKey: 'categories.defaults.barsAndRestaurants', name: 'Bares e restaurantes', icon: 'Wine',           color: '#C0392B', type: 'expense' },
  { nameKey: 'categories.defaults.home',             name: 'Casa',                  icon: 'House',          color: '#16A085', type: 'expense' },
  { nameKey: 'categories.defaults.shopping',         name: 'Compras',               icon: 'ShoppingBag',    color: '#D35400', type: 'expense' },
  { nameKey: 'categories.defaults.personalCare',     name: 'Cuidados pessoais',     icon: 'HandSoap',       color: '#E91E63', type: 'expense' },
  { nameKey: 'categories.defaults.debts',            name: 'Dívidas e empréstimos', icon: 'Bank',           color: '#7F8C8D', type: 'expense' },
  { nameKey: 'categories.defaults.education',        name: 'Educação',              icon: 'GraduationCap',  color: '#2980B9', type: 'expense' },
  { nameKey: 'categories.defaults.family',           name: 'Família e filhos',      icon: 'Baby',           color: '#F39C12', type: 'expense' },
  { nameKey: 'categories.defaults.taxes',            name: 'Impostos e taxas',      icon: 'Receipt',        color: '#34495E', type: 'expense' },
  { nameKey: 'categories.defaults.investments',      name: 'Investimentos',         icon: 'ChartLineUp',    color: '#27AE60', type: 'expense' },
  { nameKey: 'categories.defaults.leisure',          name: 'Lazer e hobbies',       icon: 'GameController', color: '#9B59B6', type: 'expense' },
  { nameKey: 'categories.defaults.grocery',          name: 'Mercado',               icon: 'ShoppingCart',   color: '#E74C3C', type: 'expense' },
  { nameKey: 'categories.defaults.pets',             name: 'Pets',                  icon: 'PawPrint',       color: '#F1C40F', type: 'expense' },
  { nameKey: 'categories.defaults.giftsAndDonations', name: 'Presentes e doações',  icon: 'Gift',           color: '#E84393', type: 'expense' },
  { nameKey: 'categories.defaults.health',           name: 'Saúde',                 icon: 'Heartbeat',      color: '#EB2F06', type: 'expense' },
  { nameKey: 'categories.defaults.bankFees',         name: 'Tarifas bancárias',     icon: 'CreditCard',     color: '#576574', type: 'expense' },
  { nameKey: 'categories.defaults.transport',        name: 'Transporte',            icon: 'Car',            color: '#3498DB', type: 'expense' },
  { nameKey: 'categories.defaults.clothing',         name: 'Vestuário',             icon: 'TShirt',         color: '#A569BD', type: 'expense' },
  { nameKey: 'categories.defaults.travel',           name: 'Viagens',               icon: 'Airplane',       color: '#1ABC9C', type: 'expense' },
  { nameKey: 'categories.defaults.others',           name: 'Outros',                icon: 'DotsThree',      color: '#95A5A6', type: 'expense' },

  // Receitas
  { nameKey: 'categories.defaults.salary',           name: 'Salário',               icon: 'Money',          color: '#27AE60', type: 'income' },
  { nameKey: 'categories.defaults.freelance',        name: 'Freelance',             icon: 'Briefcase',      color: '#16A085', type: 'income' },
  { nameKey: 'categories.defaults.investments',      name: 'Investimentos',         icon: 'ChartLineUp',    color: '#2ECC71', type: 'income' },
  { nameKey: 'categories.defaults.rentalIncome',     name: 'Aluguel recebido',      icon: 'Buildings',      color: '#3498DB', type: 'income' },
  { nameKey: 'categories.defaults.sales',            name: 'Vendas',                icon: 'Storefront',     color: '#E67E22', type: 'income' },
  { nameKey: 'categories.defaults.refund',           name: 'Reembolso',             icon: 'ArrowUUpLeft',   color: '#9B59B6', type: 'income' },
  { nameKey: 'categories.defaults.gifts',            name: 'Presentes',             icon: 'Gift',           color: '#E84393', type: 'income' },
  { nameKey: 'categories.defaults.bonus',            name: 'Bonificação',           icon: 'Star',           color: '#F39C12', type: 'income' },
  { nameKey: 'categories.defaults.earnings',         name: 'Rendimentos',           icon: 'TrendUp',        color: '#1ABC9C', type: 'income' },
  { nameKey: 'categories.defaults.others',           name: 'Outros',                icon: 'DotsThree',      color: '#95A5A6', type: 'income' },
];

// Mapeamento de nome em PT → chave de tradução (retrocompatibilidade com categorias já salvas sem nameKey)
export const PT_NAME_TO_TRANSLATION_KEY: Record<string, string> = {
  'Alimentação':           'categories.defaults.food',
  'Assinaturas e serviços': 'categories.defaults.subscriptions',
  'Bares e restaurantes':  'categories.defaults.barsAndRestaurants',
  'Casa':                  'categories.defaults.home',
  'Compras':               'categories.defaults.shopping',
  'Cuidados pessoais':     'categories.defaults.personalCare',
  'Dívidas e empréstimos': 'categories.defaults.debts',
  'Educação':              'categories.defaults.education',
  'Família e filhos':      'categories.defaults.family',
  'Impostos e taxas':      'categories.defaults.taxes',
  'Investimentos':         'categories.defaults.investments',
  'Lazer e hobbies':       'categories.defaults.leisure',
  'Mercado':               'categories.defaults.grocery',
  'Pets':                  'categories.defaults.pets',
  'Presentes e doações':   'categories.defaults.giftsAndDonations',
  'Saúde':                 'categories.defaults.health',
  'Tarifas bancárias':     'categories.defaults.bankFees',
  'Transporte':            'categories.defaults.transport',
  'Vestuário':             'categories.defaults.clothing',
  'Viagens':               'categories.defaults.travel',
  'Outros':                'categories.defaults.others',
  'Salário':               'categories.defaults.salary',
  'Freelance':             'categories.defaults.freelance',
  'Aluguel recebido':      'categories.defaults.rentalIncome',
  'Vendas':                'categories.defaults.sales',
  'Reembolso':             'categories.defaults.refund',
  'Presentes':             'categories.defaults.gifts',
  'Bonificação':           'categories.defaults.bonus',
  'Rendimentos':           'categories.defaults.earnings',
};
