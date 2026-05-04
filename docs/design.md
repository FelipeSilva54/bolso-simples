# DESIGN.md — Bolso Simples

> Documento vivo. Atualizar sempre que houver mudanças de design ou novos componentes criados.
> Este arquivo é referência obrigatória antes de criar ou editar qualquer componente ou tela.

---

## 1. Princípios de Design

- **Simples antes de bonito** — clareza de informação acima de tudo
- **Mínimo de fricção** — qualquer ação principal em no máximo 3 toques
- **Consistência** — mesmos componentes, mesmos padrões, em todas as telas
- **Feedback sempre** — toda ação do usuário tem resposta visual

---

## 2. Stack de UI

| Camada | Tecnologia |
|---|---|
| Componentes base | Gluestack UI v2 |
| Estilização | NativeWind (Tailwind CSS para React Native) |
| Ícones | Phosphor React Native |
| Tema | Light (único tema no MVP) |

---

## 3. Regras Absolutas

Estas regras nunca devem ser quebradas em nenhum arquivo do projeto:

- ❌ **Nunca usar cores hardcoded** — proibido valores como `#ffffff`, `rgb(0,0,0)`, `'white'`
- ❌ **Nunca usar `StyleSheet.create`** — toda estilização via classes NativeWind
- ❌ **Nunca criar um componente que o Gluestack já tem** — verificar `src/components/ui/` antes
- ❌ **Nunca importar componentes de `node_modules/@gluestack-ui`** — sempre de `src/components/ui/`
- ✅ **Sempre usar tokens do Gluestack** — cores, espaçamentos, tipografia
- ✅ **Sempre usar componentes de `src/components/ui/`** — eles são a fonte da verdade
- ✅ **Ícones sempre do Phosphor React Native**

---

## 4. Tokens

Todos os tokens estão definidos em:
```
src/components/ui/gluestack-ui-provider/config.ts
```

### 4.1 Cores — Uso por contexto

| Contexto | Token |
|---|---|
| Fundo de tela principal | `$backgroundLight0` |
| Fundo de tela secundária | `$backgroundLight50` |
| Fundo de cards | `$backgroundLight0` |
| Header escuro | `$backgroundDark950` |
| Texto principal | `$textLight950` |
| Texto secundário | `$textLight600` |
| Texto desabilitado | `$textLight400` |
| Texto sobre fundo escuro | `$textDark0` |
| Bordas | `$borderLight200` |
| Bordas fortes | `$borderLight300` |
| Sucesso | `$success500` |
| Erro | `$error500` |
| Aviso | `$warning500` |

### 4.2 Tipografia — Uso por contexto

| Contexto | Size token |
|---|---|
| Título de tela | `$3xl` |
| Título de seção | `$xl` |
| Corpo de texto | `$md` |
| Texto secundário | `$sm` |
| Label pequeno | `$xs` |
| Saldo total | `$4xl` |
| Saldo de carteira | `$2xl` |

### 4.3 Espaçamentos

Usar sempre as classes do NativeWind: `p-4`, `px-6`, `py-3`, `gap-2`, `mb-4`, etc.
Nunca usar valores numéricos diretos como `padding: 16`.

---

## 5. Componentes Gluestack — Referência de uso

Todos os componentes estão em `src/components/ui/`. Adicionar novos via:
```bash
npx gluestack-ui add [nome-do-componente]
```

### Componentes disponíveis no projeto

| Componente | Caminho | Quando usar |
|---|---|---|
| Button | `src/components/ui/button` | Todas as ações primárias e secundárias |
| Input | `src/components/ui/input` | Campos de texto e valor |
| Text | `src/components/ui/text` | Todo texto do app |
| Heading | `src/components/ui/heading` | Títulos de tela e seção |
| Card | `src/components/ui/card` | Containers de conteúdo agrupado |
| Badge | `src/components/ui/badge` | Status de transações (pago, pendente) |
| Modal | `src/components/ui/modal` | Confirmações e formulários simples |
| AlertDialog | `src/components/ui/alert-dialog` | Confirmação de exclusão |
| Toast | `src/components/ui/toast` | Feedback de ações (salvo, erro, excluído) |
| Spinner | `src/components/ui/spinner` | Estado de carregamento |
| Divider | `src/components/ui/divider` | Separação de seções |
| Avatar | `src/components/ui/avatar` | Foto do usuário no Perfil |
| Icon | `src/components/ui/icon` | Ícones inline (usar Phosphor) |
| FAB | `src/components/ui/fab` | Botão flutuante de ação principal |
| Select | `src/components/ui/select` | Seleção de categoria, tipo de transação |
| Checkbox | `src/components/ui/checkbox` | Status pago/recebido |
| Switch | `src/components/ui/switch` | Recorrente sim/não, preferências |
| FormControl | `src/components/ui/form-control` | Wrapper de campos com label e erro |
| BottomSheet | `src/components/ui/bottomsheet` | Ações contextuais (editar, excluir) |
| ActionSheet | `src/components/ui/actionsheet` | Menu de opções |
| HStack | `src/components/ui/hstack` | Layout horizontal |
| VStack | `src/components/ui/vstack` | Layout vertical |
| Box | `src/components/ui/box` | Container genérico |
| ScrollView | `src/components/ui/scroll-view` | Telas com conteúdo rolável |

---

## 6. Padrão Visual das Telas

### 6.1 Estrutura padrão de tela com header escuro
```
┌─────────────────────────────┐
│  Header (fundo escuro)      │  ← $backgroundDark950
│  Título da tela             │  ← texto $textDark0
│  Informação principal       │  ← ex: saldo total
└─────────────────────────────┘
┌─────────────────────────────┐
│                             │
│  Corpo (fundo claro)        │  ← $backgroundLight50
│  Conteúdo principal         │
│                             │
└─────────────────────────────┘
```

### 6.2 Telas que usam esse padrão
- Home (saldo total no header escuro, carteiras no corpo claro)
- Detalhe da Carteira (saldo da carteira no header, transações no corpo)

### 6.3 Telas com fundo totalmente claro
- Login
- Perfil
- Todas as telas de lista (receitas, despesas)
- Formulários (adicionar/editar transação, carteira, categoria)

---

## 7. Componentes Customizados do Projeto

Estes componentes são específicos do Bolso Simples e ficam em `src/components/`.
Eles são construídos **por cima** dos componentes do Gluestack.

### 7.1 WalletCard
**Arquivo:** `src/components/WalletCard.tsx`
**Uso:** Card de carteira na Home
**Exibe:** nome da carteira, cor de fundo (escolhida pelo usuário), saldo atual
**Comportamento:** saldo fica borrado quando visibilidade está oculta

### 7.2 TransactionItem
**Arquivo:** `src/components/TransactionItem.tsx`
**Uso:** Item de lista em todas as telas de transações
**Exibe:** ícone da categoria (Phosphor), título, valor, data, badge de status
**Comportamento:** ação rápida de marcar como pago/recebido

### 7.3 SummaryCard
**Arquivo:** `src/components/SummaryCard.tsx`
**Uso:** Cards de resumo no Detalhe da Carteira
**Exibe:** label (Receitas / Despesas), valor total do mês
**Comportamento:** clicável, navega para a lista detalhada

### 7.4 StatusBadge
**Arquivo:** `src/components/StatusBadge.tsx`
**Uso:** Tag de status em TransactionItem e Detalhe da Transação
**Variantes:**
- `paid` — Pago (verde)
- `unpaid` — Não pago (amarelo/laranja)
- `received` — Recebido (verde)
- `unreceived` — Não recebido (amarelo/laranja)

### 7.5 MonthFilter
**Arquivo:** `src/components/MonthFilter.tsx`
**Uso:** Seletor de mês no Detalhe da Carteira
**Exibe:** mês e ano atual, botões de anterior e próximo

### 7.6 EmptyState
**Arquivo:** `src/components/EmptyState.tsx`
**Uso:** Estado vazio em qualquer tela de lista
**Props:** ícone, título, subtítulo, texto do CTA (opcional)

### 7.7 BalanceDisplay
**Arquivo:** `src/components/BalanceDisplay.tsx`
**Uso:** Exibição de saldo com toggle de visibilidade
**Comportamento:** ícone de olho oculta/revela o valor. Valor oculto exibe `••••••`

---

## 8. Ícones

Usar sempre **Phosphor React Native**. Nunca usar outros pacotes de ícones.

```tsx
import { Wallet, ArrowUp, ArrowDown, Eye, EyeSlash } from 'phosphor-react-native'

<Wallet size={24} color={tokens.textLight950} weight="regular" />
```

**Pesos disponíveis:** `thin`, `light`, `regular`, `bold`, `fill`, `duotone`
**Peso padrão do projeto:** `regular` para ícones de UI, `fill` para ícones de categoria

---

## 9. Feedback Visual

| Ação | Feedback |
|---|---|
| Salvar com sucesso | Toast verde ("Salvo com sucesso") |
| Erro ao salvar | Toast vermelho ("Erro ao salvar. Tente novamente.") |
| Excluir | AlertDialog de confirmação → Toast ("Excluído") |
| Marcar como pago | Atualização imediata na lista + Toast discreto |
| Carregando dados | Spinner centralizado ou Skeleton |

---

## 10. Navegação Visual

- **Tab bar:** 2 abas — Carteiras (ícone `Wallet`) e Perfil (ícone `User`)
- **Header nativo:** presente em telas de detalhe com botão de voltar automático
- **FAB:** botão flutuante `+` na Home para adicionar carteira e no Detalhe para adicionar transação
- **Modal:** usado para formulários simples (adicionar/editar carteira)
- **Tela full:** usado para formulários complexos (adicionar/editar transação)
- **BottomSheet:** usado para ações contextuais (opções de editar/excluir)

---

## 11. Acessibilidade

- Todo elemento interativo deve ter `accessibilityLabel`
- Áreas de toque mínimo de 44x44px
- Contraste de texto sempre respeitando WCAG AA