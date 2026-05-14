# CLAUDE.md — Bolso Simples

## 1. Visão geral do projeto

App mobile de controle financeiro pessoal para Android. O usuário cria carteiras e registra transações manualmente — receitas, despesas e transferências. O app calcula saldos automaticamente e organiza transações por mês. Proposta de valor: 100% brasileiro, gratuito, sem anúncios e sem integração bancária.

---

## 2. Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo (SDK gerenciado) |
| Linguagem | TypeScript — obrigatório em todos os arquivos |
| Roteamento | Expo Router — file-based routing em `src/app/` |
| UI / Estilização | React Native puro + `StyleSheet.create()` — sem libs externas |
| Auth | Firebase Authentication (Google OAuth + Anônimo) |
| Banco de dados | Firebase Firestore (southamerica-east1) |
| Persistência local | AsyncStorage (sessão Firebase Auth) |
| Ícones | Phosphor React Native — única biblioteca de ícones permitida |
| Navegação | React Navigation (Native Stack + Bottom Tabs) |

---

## 3. Estrutura de pastas

```
src/
├── app/                  # Rotas Expo Router (file-based) — sem lógica de negócio
│   ├── _layout.tsx       # Layout raiz com providers globais
│   ├── (auth)/           # Rotas de autenticação
│   └── (tabs)/           # Rotas com tab bar
│
├── screens/              # Telas completas importadas pelas rotas
│   ├── auth/
│   ├── wallets/
│   ├── transactions/
│   └── profile/
│
├── components/           # Componentes reutilizáveis — React Native puro
├── services/             # CRUD no Firestore — única camada que toca o banco
├── hooks/                # Lógica de negócio e estado — chamam services
├── store/                # Contextos globais (AuthContext, PreferencesContext)
├── utils/                # Funções puras (currency.ts, date.ts, balance.ts)
├── constants/            # Tokens de design (colors, typography, spacing) + barrel export
└── types/                # Interfaces TypeScript do domínio
```

---

## 4. Regras obrigatórias de código

- ❌ Nunca usar cores hardcoded (`'#fff'`, `'white'`, `'black'`)
- ❌ Nunca usar valores numéricos diretos para fonte ou espaçamento (`fontSize: 16`, `padding: 12`)
- ❌ Nunca instalar ou importar bibliotecas de UI externas (Gluestack, NativeWind, Tamagui, etc.)
- ❌ Nunca acessar Firestore diretamente nas telas — sempre via `services/` + `hooks/`
- ❌ Nunca criar arquivos `.js` em `src/` — somente `.ts` e `.tsx`
- ❌ Nunca importar constants de arquivos individuais — sempre pelo barrel `@/constants`
- ✅ Todos os componentes: funcionais, sem class components
- ✅ Lógica de negócio nos hooks — telas são apenas apresentação
- ✅ Ícones sempre do Phosphor React Native com `accessibilityLabel` obrigatório
- ✅ Todo elemento interativo com área de toque mínima de 44x44px (usar `hitSlop` se necessário)
- ✅ Formatação de moeda via `utils/currency.ts`, datas via `utils/date.ts`
- ✅ Toda tela com busca de dados: skeleton de loading, não spinner isolado
- ✅ Toda ação de salvar/editar/excluir: feedback visual (toast) + dialog de confirmação antes de excluir
- ✅ Ao salvar ou excluir com sucesso: voltar para a tela anterior automaticamente
- ✅ Animações sempre com `useNativeDriver: true` — nunca animar `width`, `height` ou `padding`

---

## 5. Regras de design

### Tokens de cores (`src/constants/colors.ts`)

| Token | Uso |
|---|---|
| `primary` (#181719) | Header, botões primários |
| `content` (#080808) | Texto principal |
| `subcontent` (#5D5D5D) | Texto secundário |
| `muted` (#8C8C8C) | Placeholders, desabilitado |
| `border` (#DBDBDB) | Bordas, divisores |
| `white` (#FFFFFF) | Cards, superfícies |
| `background` (#F6F6F6) | Fundo padrão de telas |
| `danger` / `dangerLight` | Erros, excluir, não pago |
| `success` / `successLight` | Pago, recebido, sucesso |

### Tokens de tipografia (`src/constants/typography.ts`)
`xs` 12 / `sm` 14 / `md` 16 / `lg` 18 / `xl` 20 / `xxl` 24 / `xxxl` 30 / `display` 36 — pesos: `regular` `medium` `semibold` `bold`

### Tokens de espaçamento (`src/constants/spacing.ts`)
`xs` 4 / `sm` 8 / `md` 12 / `lg` 16 / `xl` 24 / `xxl` 32 / `xxxl` 48

### Padrão de importação

```tsx
// ✅ correto
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

// ❌ errado
import { colors } from '@/constants/colors';
import { spacing } from '../constants/spacing';
```

### Padrão visual de telas

- **Header escuro + corpo claro** (Home, Detalhe de Carteira): header `colors.primary`, texto `colors.white`, corpo `colors.background`
- **Fundo totalmente claro**: Login → `colors.white` | Perfil, listas, formulários → `colors.background`

---

## 6. Padrões de nomenclatura

| Tipo | Padrão | Local |
|---|---|---|
| Telas | `NomeDaTelaScreen.tsx` (PascalCase) | `src/screens/` |
| Skeleton de tela | `NomeDaTelaSkeletonScreen.tsx` | junto da tela |
| Hooks | `useNomeDoHook.ts` (camelCase + prefixo `use`) | `src/hooks/` |
| Services | `nomeDoServico.ts` (camelCase) | `src/services/` |
| Interfaces/tipos | singular (`Wallet`, `Transaction`, `Category`) | `src/types/` |
| Componentes | `NomeDoComponente.tsx` (PascalCase) | `src/components/` |

---

## 7. Estrutura do Firestore

```
users/{userId}
├── name, email, photoURL, createdAt
│
├── wallets/{walletId}
│   ├── name: string
│   ├── color: string          # hex escolhido pelo usuário
│   ├── createdAt: timestamp
│   │
│   └── transactions/{transactionId}
│       ├── type: 'income' | 'expense' | 'transfer'
│       ├── title: string
│       ├── description: string
│       ├── amount: number
│       ├── categoryId: string
│       ├── status: 'paid' | 'unpaid' | 'received' | 'unreceived'
│       ├── isRecurring: boolean
│       ├── date: timestamp
│       └── createdAt: timestamp
│
└── categories/{categoryId}
    ├── name: string
    ├── icon: string            # nome do ícone Phosphor
    ├── color: string
    └── isDefault: boolean
```

**Regras de negócio críticas:**
- Saldo da carteira = receitas com `status: 'received'` − despesas com `status: 'paid'`
- Transações pendentes NÃO entram no cálculo do saldo
- Excluir carteira exige excluir todas as transações filhas

---

## 8. Antes de criar qualquer arquivo

- [ ] O componente já existe em `src/components/`? — Button, Toggle, Checkbox, FAB, WalletCard, TransactionItem, SummaryCard, StatusBadge, MonthFilter, Tab, EmptyState, BalanceDisplay
- [ ] O token de design já existe em `src/constants/`? — verificar colors, typography, spacing antes de criar qualquer valor
- [ ] A importação usa `@/constants` (barrel), não arquivos individuais?
- [ ] O arquivo é `.ts` ou `.tsx`? — nunca `.js`
- [ ] A tela tem skeleton de loading espelhando o layout real?
- [ ] Todo elemento interativo tem `accessibilityLabel` e área de toque ≥ 44x44px?
- [ ] A lógica de negócio está no hook, não na tela?
- [ ] O acesso ao Firestore passa por `services/` + `hooks/`?
- [ ] Novo componente criado? — documentar em `docs/DESIGN.md`
