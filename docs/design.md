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
| Componentes | React Native puro (View, Text, TouchableOpacity, ScrollView, etc.) |
| Estilização | StyleSheet.create() do React Native |
| Ícones | Phosphor React Native |
| Tema | Light (único tema no MVP) |

**Não há biblioteca de componentes externa.** Todos os componentes são construídos do zero usando React Native puro e as constantes do projeto.

---

## 3. Regras Absolutas

Estas regras nunca devem ser quebradas em nenhum arquivo do projeto:

- ❌ **Nunca usar cores hardcoded** — proibido valores como `'#ffffff'`, `'white'`, `'black'`
- ❌ **Nunca usar valores numéricos diretos para fonte ou espaçamento** — proibido `fontSize: 16`, `padding: 12`
- ❌ **Nunca usar bibliotecas de UI externas** — sem Gluestack, NativeWind, React Native Paper, etc.
- ✅ **Sempre importar de** `@/constants` (barrel export — nunca importar de arquivos individuais)
- ✅ **Ícones sempre do Phosphor React Native**

---

## 4. Constantes de Design

Todos os valores de design ficam em `src/constants/`.

### 4.1 Cores — `src/constants/colors.ts`

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#181719` | Cor principal, botões primários, header |
| `content` | `#080808` | Texto principal |
| `subcontent` | `#5D5D5D` | Texto secundário |
| `muted` | `#8C8C8C` | Texto desabilitado, placeholders |
| `border` | `#DBDBDB` | Bordas, divisores |
| `white` | `#FFFFFF` | Fundos de cards, superfícies |
| `offwhite` | `#F5F5F5` | Fundo de telas secundárias |
| `background` | `#F6F6F6` | Fundo padrão do app |
| `danger` | `#DC2626` | Erros, excluir, não pago |
| `dangerLight` | `#FEF1F1` | Fundo de badges de erro |
| `success` | `#348352` | Sucesso, pago, recebido |
| `successLight` | `#E4FFF4` | Fundo de badges de sucesso |
| `info` | `#075A83` | Informação |
| `infoLight` | `#EBF8FE` | Fundo de badges de info |

**Cores de carteira** (paleta para o usuário escolher):
```
walletColors: ['#348352', '#6B4FBB', '#1A6FA8', '#C0392B', '#D4832A', '#2C7873', '#8E3B46', '#4A4A8A']
```

### 4.2 Tipografia — `src/constants/typography.ts`

| Token | Tamanho | Uso |
|---|---|---|
| `xs` | 12px | Labels pequenos, badges |
| `sm` | 14px | Texto secundário, datas, labels de tab |
| `md` | 16px | Corpo de texto padrão |
| `lg` | 18px | Texto de botões, destaques |
| `xl` | 20px | Títulos de seção |
| `xxl` | 24px | Títulos de tela |
| `xxxl` | 30px | Saldo da carteira |
| `display` | 36px | Saldo total |

**Pesos:**

| Token | Valor |
|---|---|
| `regular` | `'400'` |
| `medium` | `'500'` |
| `semibold` | `'600'` |
| `bold` | `'700'` |

### 4.3 Espaçamentos — `src/constants/spacing.ts`

| Token | Valor | Uso típico |
|---|---|---|
| `xs` | 4px | Espaços internos pequenos, gap entre ícone e texto |
| `sm` | 8px | Gap entre elementos |
| `md` | 12px | Padding interno de cards |
| `lg` | 16px | Padding padrão de tela, padding horizontal de botões |
| `xl` | 24px | Espaçamento entre seções |
| `xxl` | 32px | Espaçamento grande |
| `xxxl` | 48px | Altura de botões e FAB |

---

## 5. Como usar as constantes

Sempre importar pelo barrel `@/constants` — nunca importar de arquivos individuais.

```tsx
import { colors, fontSize as fs, fontWeight as fw, spacing } from '@/constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: fs.xxl,
    fontWeight: fw.bold,
    color: colors.content,
  },
  subtitle: {
    fontSize: fs.md,
    fontWeight: fw.regular,
    color: colors.subcontent,
  },
});
```

---

## 6. Padrão Visual das Telas

### 6.1 Estrutura padrão — header escuro + corpo claro

```
┌─────────────────────────────┐
│  Header (fundo escuro)      │  ← colors.primary
│  Saudação / título          │  ← colors.white
│  Informação principal       │  ← ex: saldo total
└─────────────────────────────┘
┌─────────────────────────────┐
│                             │
│  Corpo (fundo claro)        │  ← colors.background
│  Conteúdo principal         │
│                             │
└─────────────────────────────┘
```

**Telas que usam esse padrão:** Home e Detalhe da Carteira.

### 6.2 Telas com fundo totalmente claro

- Login → `colors.white`
- Perfil → `colors.background`
- Listas de receitas e despesas → `colors.background`
- Formulários → `colors.white`

---

## 7. Componentes Customizados do Projeto

Todos os componentes ficam em `src/components/`. São construídos com React Native puro usando as constantes de design. Todo elemento interativo deve ter `accessibilityLabel` e área de toque mínima de 44x44px.

### 7.1 Button
**Arquivo:** `src/components/Button.tsx`
**Uso:** Ações primárias e secundárias em qualquer tela
**Variantes:** `primary`, `outlined`, `danger`, `dangerLight`
**Tamanhos:** `lg` (altura 48px) e `sm` (altura 36px)
**Props extras:** `loading` (spinner), `leftIcon`, `selected` (outlined ativo vira success)

### 7.2 Toggle
**Arquivo:** `src/components/Toggle.tsx`
**Uso:** Preferências do usuário, configurações on/off
**Comportamento:** animação spring entre off (colors.border) e on (colors.success)
**Props:** `value`, `onValueChange`, `disabled`, `accessibilityLabel` (obrigatório)

### 7.3 Checkbox
**Arquivo:** `src/components/Checkbox.tsx`
**Uso:** Seleção de itens, aceite de termos, filtros múltiplos
**Comportamento:** animação scale no ícone de check ao marcar; label clicável junto com a caixa
**Props:** `value`, `onValueChange`, `label` (opcional), `disabled`, `accessibilityLabel` (obrigatório)

### 7.4 FAB (Floating Action Button)
**Arquivo:** `src/components/FAB.tsx`
**Uso:** Ação principal flutuante — adicionar carteira ou transação
**Variantes:** só ícone (quadrado 48x48) ou com label (pílula com padding horizontal)
**Posicionamento:** definido pela tela via prop `style` (position: absolute, bottom, right)
**Props:** `onPress`, `label` (opcional), `disabled`, `accessibilityLabel` (obrigatório), `style`

### 7.5 WalletCard
**Arquivo:** `src/components/WalletCard.tsx`
**Uso:** Card de carteira na Home
**Exibe:** nome da carteira, cor de fundo escolhida pelo usuário, saldo atual
**Comportamento:** saldo fica com `••••••` quando visibilidade está oculta

### 7.6 TransactionItem
**Arquivo:** `src/components/TransactionItem.tsx`
**Uso:** Item de lista em todas as telas de transações
**Exibe:** ícone da categoria (Phosphor), título, valor, data, badge de status
**Comportamento:** ação rápida de marcar como pago/recebido

### 7.7 SummaryCard
**Arquivo:** `src/components/SummaryCard.tsx`
**Uso:** Cards de resumo no Detalhe da Carteira
**Exibe:** label (Receitas / Despesas), valor total do mês
**Comportamento:** clicável, navega para a lista detalhada

### 7.8 StatusBadge
**Arquivo:** `src/components/StatusBadge.tsx`
**Uso:** Tag de status em TransactionItem e Detalhe da Transação
**Variantes:**
- `paid` — Pago → `colors.success` / `colors.successLight`
- `unpaid` — Não pago → `colors.danger` / `colors.dangerLight`
- `received` — Recebido → `colors.success` / `colors.successLight`
- `unreceived` — Não recebido → `colors.danger` / `colors.dangerLight`

### 7.9 MonthFilter
**Arquivo:** `src/components/MonthFilter.tsx`
**Uso:** Seletor de mês com scroll horizontal no Detalhe da Carteira e nas telas de receitas/despesas
**Exibe:** mês anterior, mês atual (em destaque com bold + underline), próximo mês
**Comportamento:** scroll horizontal com snap; mês ativo centralizado

### 7.10 Tab
**Arquivo:** `src/components/Tab.tsx`
**Uso:** Seletor de categoria ou seção dentro de uma tela (ex: Produtos comuns / Sua despensa)
**Exibe:** lista vertical de opções; item selecionado com fundo branco elevado
**Comportamento:** seleção exclusiva (um item ativo por vez)

### 7.11 EmptyState
**Arquivo:** `src/components/EmptyState.tsx`
**Uso:** Estado vazio em qualquer tela de lista
**Props:** ícone, título, subtítulo, texto do CTA (opcional)

### 7.12 BalanceDisplay
**Arquivo:** `src/components/BalanceDisplay.tsx`
**Uso:** Exibição de saldo com toggle de visibilidade
**Comportamento:** ícone de olho oculta/revela o valor. Valor oculto exibe `••••••`

---

## 8. Ícones

Usar sempre **Phosphor React Native**. Nunca usar outros pacotes de ícones.

```tsx
import { Wallet, ArrowUp, ArrowDown, Eye, EyeSlash } from 'phosphor-react-native';

<Wallet size={24} color={colors.white} weight="regular" />
```

**Pesos disponíveis:** `thin`, `light`, `regular`, `bold`, `fill`, `duotone`
**Peso padrão:** `regular` para ícones de UI, `fill` para ícones de categoria e estado ativo

---

## 9. Feedback Visual

| Ação | Feedback |
|---|---|
| Salvar com sucesso | Toast verde |
| Erro ao salvar | Toast vermelho |
| Excluir | Alert de confirmação → Toast |
| Marcar como pago | Atualização imediata na lista |
| Carregando dados | ActivityIndicator centralizado |

---

## 10. Navegação Visual

- **Tab bar:** 2 abas — Carteiras (`Wallet` Phosphor) e Perfil (`User` Phosphor)
- **Header nativo:** presente em telas de detalhe com botão de voltar automático
- **FAB (+):** na Home e no Detalhe da Carteira para adicionar itens
- **Modal:** formulários simples (adicionar/editar carteira)
- **Tela full:** formulários complexos (adicionar/editar transação)
- **Bottom sheet:** ações contextuais (editar/excluir)

---

## 11. Acessibilidade

- Todo elemento interativo deve ter `accessibilityLabel`
- Áreas de toque mínimo de 44x44px — usar `hitSlop` quando necessário
- Contraste de texto respeitando WCAG AA