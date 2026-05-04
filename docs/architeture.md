# ARCHITECTURE.md — Bolso Simples

> Documento vivo. Atualizar sempre que houver mudanças estruturais no projeto.
> Este arquivo é a principal referência para qualquer agente de IA ou desenvolvedor que for contribuir com o projeto.

---

## 1. Visão Geral do Projeto

**Nome:** Bolso Simples
**Plataforma:** Android (Google Play Store) — iOS não previsto
**Tipo:** Aplicativo mobile de controle financeiro pessoal
**Proposta de valor:** App de bolso para finanças — 100% brasileiro, gratuito e sem anúncios

O usuário entra no app, cria suas carteiras e adiciona transações manualmente — receitas, despesas ou transferências. O app calcula automaticamente o saldo de cada carteira e o saldo total. É possível visualizar as transações mês a mês, com resumo de receitas e despesas do mês, histórico completo e ações rápidas (marcar como pago/recebido, editar, excluir). Não há integração com bancos ou serviços externos — todo registro é manual.

---

## 2. Stack Técnica

| Camada | Tecnologia | Versão / Observação |
|---|---|---|
| Framework mobile | React Native + Expo | SDK gerenciado |
| Linguagem | TypeScript | Obrigatório em todos os arquivos |
| Roteamento | Expo Router | File-based routing dentro de `src/app/` |
| UI / Componentes | Gluestack UI v2 | Componentes gerados localmente via CLI |
| Estilização | NativeWind (Tailwind CSS) | Nunca usar valores hardcoded |
| Autenticação | Firebase Authentication | Google OAuth + Anônimo |
| Banco de dados | Firebase Firestore | Região: southamerica-east1 |
| Persistência local | AsyncStorage | Sessão do Firebase Auth |
| Ícones | Phosphor React Native | Requer react-native-svg |
| Navegação | React Navigation | Native Stack + Bottom Tabs |

---

## 3. Estrutura de Pastas

```
bolso-simples/
├── src/                          # Todo o código da aplicação
│   ├── app/                      # Rotas (Expo Router — file-based routing)
│   │   ├── _layout.tsx           # Layout raiz — providers globais
│   │   ├── index.tsx             # Rota inicial (redireciona p/ login ou home)
│   │   ├── (auth)/               # Grupo de rotas de autenticação
│   │   │   └── login.tsx
│   │   └── (tabs)/               # Grupo de rotas com tab bar
│   │       ├── _layout.tsx       # Configuração das tabs
│   │       ├── index.tsx         # Home (carteiras)
│   │       └── profile.tsx       # Perfil
│   │
│   ├── screens/                  # Telas completas (importadas pelas rotas)
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── wallets/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── WalletDetailScreen.tsx
│   │   │   ├── AddEditWalletScreen.tsx
│   │   │   ├── TransactionListScreen.tsx   # Receitas ou despesas do mês
│   │   │   └── TransactionDetailScreen.tsx
│   │   ├── transactions/
│   │   │   └── AddEditTransactionScreen.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       ├── CategoriesScreen.tsx
│   │       ├── AddEditCategoryScreen.tsx
│   │       └── PreferencesScreen.tsx
│   │
│   ├── components/               # Componentes reutilizáveis do projeto
│   │   ├── ui/                   # Componentes gerados pelo Gluestack CLI
│   │   │   ├── button/
│   │   │   ├── input/
│   │   │   ├── card/
│   │   │   └── ...               # Outros componentes do Gluestack
│   │   ├── WalletCard.tsx        # Card de carteira (nome, cor, saldo)
│   │   ├── TransactionItem.tsx   # Item de lista de transação
│   │   ├── SummaryCard.tsx       # Card de resumo receita/despesa do mês
│   │   ├── StatusBadge.tsx       # Badge pago/pendente/recebido
│   │   ├── MonthFilter.tsx       # Seletor de mês
│   │   ├── EmptyState.tsx        # Estado vazio reutilizável
│   │   └── BalanceDisplay.tsx    # Saldo com toggle de visibilidade
│   │
│   ├── services/                 # Integrações externas
│   │   ├── firebase.ts           # Inicialização do Firebase (app, auth, db)
│   │   ├── auth.ts               # Funções de autenticação (signIn, signOut)
│   │   ├── wallets.ts            # CRUD de carteiras no Firestore
│   │   ├── transactions.ts       # CRUD de transações no Firestore
│   │   └── categories.ts         # CRUD de categorias no Firestore
│   │
│   ├── hooks/                    # Hooks customizados (lógica de negócio)
│   │   ├── useAuth.ts            # Estado de autenticação do usuário
│   │   ├── useWallets.ts         # Lista e operações de carteiras
│   │   ├── useTransactions.ts    # Transações por carteira e mês
│   │   ├── useCategories.ts      # Categorias do usuário
│   │   └── useBalanceVisibility.ts # Toggle de visibilidade do saldo
│   │
│   ├── store/                    # Contexto global (estado compartilhado)
│   │   ├── AuthContext.tsx       # Usuário autenticado, loading, logout
│   │   └── PreferencesContext.tsx # Preferências do app (tema, visibilidade)
│   │
│   ├── utils/                    # Funções utilitárias puras
│   │   ├── currency.ts           # Formatação de moeda (R$ 1.250,00)
│   │   ├── date.ts               # Formatação de datas (dd/mm/aaaa)
│   │   ├── balance.ts            # Cálculo de saldo a partir de transações
│   │   └── colors.ts             # Geração/validação de cores de carteira
│   │
│   ├── constants/                # Valores fixos do projeto
│   │   ├── categories.ts         # Categorias padrão pré-cadastradas
│   │   ├── colors.ts             # Paleta de cores disponíveis para carteiras
│   │   └── routes.ts             # Nomes das rotas de navegação
│   │
│   └── types/                    # Tipagem TypeScript do domínio
│       ├── user.ts               # User, UserProfile
│       ├── wallet.ts             # Wallet
│       ├── transaction.ts        # Transaction, TransactionType, TransactionStatus
│       └── category.ts           # Category
│
├── assets/                       # Arquivos estáticos
│   ├── images/                   # Imagens e ilustrações
│   └── fonts/                    # Fontes customizadas (se houver)
│
├── docs/                         # Documentação do projeto
│   ├── ARCHITECTURE.md           # Este arquivo
│   ├── PRD.md                    # Product Requirements Document
│   ├── DESIGN.md                 # Sistema de design e tokens
│   ├── FIREBASE.md               # Estrutura do Firestore e regras
│   └── SCREENS.md                # Mapa de telas e fluxos
│
├── .env.local                    # Variáveis de ambiente (não commitado)
├── .env.example                  # Template de variáveis de ambiente
├── app.json                      # Configuração do Expo
├── babel.config.js               # Configuração do Babel
├── metro.config.js               # Configuração do Metro Bundler
├── tailwind.config.js            # Configuração do NativeWind/Tailwind
├── tsconfig.json                 # Configuração do TypeScript
└── package.json                  # Dependências do projeto
```

---

## 4. Diagrama do Sistema

```
[Usuário Android]
      │
      ▼
[App Bolso Simples — React Native / Expo]
      │
      ├──► [Firebase Authentication]
      │         ├── Google OAuth
      │         └── Anônimo
      │
      └──► [Firebase Firestore]
                ├── users/{userId}
                ├── users/{userId}/wallets/{walletId}
                ├── users/{userId}/wallets/{walletId}/transactions/{id}
                └── users/{userId}/categories/{categoryId}
```

Não há backend próprio. Toda a lógica roda no cliente e se comunica diretamente com o Firebase.

---

## 5. Componentes Principais

### 5.1. Autenticação (`src/services/auth.ts` + `src/store/AuthContext.tsx`)
Responsável por gerenciar o ciclo de vida da sessão do usuário.
- Login com Google via Firebase Authentication
- Login anônimo (sem cadastro)
- Persistência de sessão via AsyncStorage
- Logout e limpeza de estado

### 5.2. Carteiras (`src/services/wallets.ts` + `src/hooks/useWallets.ts`)
Gerencia o CRUD de carteiras no Firestore.
- Criar, editar e excluir carteiras
- Cada carteira tem nome, cor (escolhida pelo usuário) e saldo calculado
- Saldo = soma de todas as transações pagas/recebidas da carteira

### 5.3. Transações (`src/services/transactions.ts` + `src/hooks/useTransactions.ts`)
Gerencia o CRUD de transações dentro de cada carteira.
- Tipos: Receita, Despesa, Transferência entre carteiras
- Status: Pago / Não pago (despesas), Recebido / Não recebido (receitas)
- Organizadas por mês (filtro mensal)
- Suporte a transações recorrentes

### 5.4. Categorias (`src/services/categories.ts` + `src/hooks/useCategories.ts`)
Categorias usadas para classificar transações.
- Categorias padrão pré-cadastradas no primeiro acesso
- CRUD de categorias customizadas pelo usuário
- Cada categoria tem: nome, ícone (Phosphor) e cor

### 5.5. Perfil (`src/screens/profile/`)
Área de configurações e informações do usuário.
- Dados da conta (nome, foto, email)
- Gerenciamento de categorias
- Preferências do app
- Notificações in-app (sem push)
- FAQ, sobre o app, avaliar na Play Store
- Logout

---

## 6. Banco de Dados — Firestore

### Estrutura de Coleções

```
users/
└── {userId}/
    ├── name: string
    ├── email: string
    ├── photoURL: string
    ├── createdAt: timestamp
    │
    ├── wallets/
    │   └── {walletId}/
    │       ├── name: string
    │       ├── color: string        # Hex escolhido pelo usuário
    │       ├── createdAt: timestamp
    │       │
    │       └── transactions/
    │           └── {transactionId}/
    │               ├── type: 'income' | 'expense' | 'transfer'
    │               ├── title: string
    │               ├── description: string
    │               ├── amount: number
    │               ├── categoryId: string
    │               ├── status: 'paid' | 'unpaid' | 'received' | 'unreceived'
    │               ├── isRecurring: boolean
    │               ├── date: timestamp
    │               └── createdAt: timestamp
    │
    └── categories/
        └── {categoryId}/
            ├── name: string
            ├── icon: string         # Nome do ícone Phosphor
            ├── color: string        # Hex da cor
            └── isDefault: boolean
```

---

## 7. Autenticação e Segurança

- **Google OAuth:** via Firebase Authentication SDK — sem backend próprio
- **Anônimo:** Firebase cria uma identidade temporária; dados salvos no Firestore vinculados ao UID anônimo
- **Migração:** usuário anônimo pode vincular conta Google futuramente
- **Variáveis de ambiente:** todas as chaves do Firebase usam prefixo `EXPO_PUBLIC_` e ficam em `.env.local` (não commitado)
- **Regras do Firestore:** cada usuário só acessa seus próprios dados (`request.auth.uid == userId`)

---

## 8. Padrões de Código

### Regras obrigatórias
- **TypeScript em tudo** — sem arquivos `.js` no `src/`
- **Componentes funcionais** — sem class components
- **Lógica de negócio nos hooks** — telas são apenas apresentação
- **Nunca acessar Firestore direto nas telas** — sempre via `services/` e `hooks/`
- **Nunca usar cores hardcoded** — sempre tokens do Gluestack ou variáveis do `constants/colors.ts`
- **Formatação de moeda e data** sempre via `utils/currency.ts` e `utils/date.ts`

### Nomenclatura
- Arquivos de tela: `NomeDaTela.tsx` (PascalCase) dentro de `src/screens/`
- Hooks: `useNomeDoHook.ts` (camelCase com prefixo `use`)
- Services: `nomeDoServico.ts` (camelCase)
- Tipos: interfaces com nome no singular (`Wallet`, `Transaction`, `Category`)

### Componentes Gluestack
- Componentes do Gluestack ficam em `src/components/ui/` (gerados via CLI)
- Componentes customizados do projeto ficam em `src/components/` (raiz)
- Para adicionar um componente Gluestack: `npx gluestack-ui add [nome]`

---

## 9. Ambiente de Desenvolvimento

**Pré-requisitos:**
- Node.js LTS
- Expo Go no celular Android (para visualização em tempo real)
- Conta Firebase com projeto configurado

**Rodar o projeto:**
```bash
npx expo start
```

**Variáveis de ambiente:**
Copiar `.env.example` para `.env.local` e preencher com as chaves do Firebase Console.

---

## 10. Glossário

| Termo | Definição |
|---|---|
| Carteira | Conta financeira do usuário (ex: Conta corrente, Carteira física) |
| Transação | Registro financeiro dentro de uma carteira (receita, despesa ou transferência) |
| Saldo da carteira | Soma de todas as transações pagas/recebidas da carteira |
| Saldo total | Soma dos saldos de todas as carteiras do usuário |
| Status | Situação de uma transação: pago/não pago (despesa) ou recebido/não recebido (receita) |
| Categoria | Classificação de uma transação (ex: Alimentação, Transporte, Salário) |
| Modo anônimo | Acesso sem conta Google — dados vinculados a UID anônimo no Firebase |

---

**Última atualização:** 2026
**Projeto:** Bolso Simples
**Repositório:** github.com/[seu-usuario]/bolso-simples