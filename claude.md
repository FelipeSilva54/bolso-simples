# CLAUDE.md — Bolso Simples

> Instruções obrigatórias para qualquer agente de IA que trabalhe neste projeto.
> Leia este arquivo inteiro antes de criar, editar ou deletar qualquer coisa.

---

## 1. Leia a documentação antes de qualquer ação

Antes de criar ou editar qualquer arquivo, leia os documentos abaixo na ordem:

1. `docs/DESIGN.md` — sistema de design, tokens e componentes existentes
2. `docs/ARCHITECTURE.md` — estrutura de pastas, padrões de código e nomenclatura
3. `docs/PRD.md` — regras de negócio e funcionalidades do produto

Se a tarefa envolver navegação ou fluxos entre telas, leia também:

4. `docs/FLOWS.md`

---

## 2. Stack — o que é permitido

| Camada | Tecnologia permitida |
|---|---|
| Framework | React Native + Expo (SDK gerenciado) |
| Linguagem | TypeScript — obrigatório em todos os arquivos |
| Estilização | `StyleSheet.create()` do React Native |
| Ícones | Phosphor React Native — **única biblioteca de ícones** |
| Auth + DB | Firebase Authentication + Firestore |
| Roteamento | Expo Router (file-based) |

**Nenhuma biblioteca de UI externa é permitida.** Sem Gluestack, NativeWind, React Native Paper, Tamagui, ou similares. Todos os componentes são React Native puro.

---

## 3. Regras absolutas de código

Estas regras nunca devem ser quebradas:

- ❌ Nunca usar cores hardcoded (`'#fff'`, `'white'`, `'black'`)
- ❌ Nunca usar valores numéricos diretos para fonte ou espaçamento (`fontSize: 16`, `padding: 12`)
- ❌ Nunca instalar ou importar bibliotecas de UI externas
- ❌ Nunca acessar Firestore diretamente nas telas — sempre via `services/` + `hooks/`
- ❌ Nunca criar arquivos `.js` dentro de `src/` — somente `.ts` e `.tsx`
- ❌ Nunca importar constants de arquivos individuais — sempre pelo barrel
- ✅ Sempre importar tokens de `@/constants` (barrel export)
- ✅ Ícones sempre do Phosphor React Native com `accessibilityLabel` obrigatório
- ✅ Todo elemento interativo com área de toque mínima de 44x44px
- ✅ Formatação de moeda sempre via `utils/currency.ts`
- ✅ Formatação de datas sempre via `utils/date.ts`

```tsx
// ✅ correto
import { colors, fontSize as fs, fontWeight as fw, spacing, radius } from '@/constants';

// ❌ errado
import { colors } from '@/constants/colors';
import { spacing } from '../constants/spacing';
```

---

## 4. Componentes — sempre reutilize antes de criar

Antes de criar qualquer componente novo, verifique se um dos abaixo já resolve:

| Componente | Arquivo | Quando usar |
|---|---|---|
| `Button` | `src/components/Button.tsx` | Qualquer ação primária ou secundária |
| `Toggle` | `src/components/Toggle.tsx` | Preferências on/off |
| `Checkbox` | `src/components/Checkbox.tsx` | Seleção múltipla, aceite de termos |
| `FAB` | `src/components/FAB.tsx` | Ação flutuante principal da tela |
| `WalletCard` | `src/components/WalletCard.tsx` | Exibição de carteira na Home |
| `TransactionItem` | `src/components/TransactionItem.tsx` | Item em listas de transações |
| `SummaryCard` | `src/components/SummaryCard.tsx` | Resumo de receitas/despesas do mês |
| `StatusBadge` | `src/components/StatusBadge.tsx` | Status de transação (pago, pendente) |
| `MonthFilter` | `src/components/MonthFilter.tsx` | Navegação entre meses |
| `Tab` | `src/components/Tab.tsx` | Seletor de seção dentro de uma tela |
| `EmptyState` | `src/components/EmptyState.tsx` | Estado vazio em listas |
| `BalanceDisplay` | `src/components/BalanceDisplay.tsx` | Saldo com toggle de visibilidade |

Só crie um componente novo se nenhum dos acima servir. Ao criar, documente no `docs/DESIGN.md`.

---

## 5. Estados de loading — obrigatório em toda tela nova

Toda tela que busca dados (Firestore, auth, etc.) deve ter estado de loading com **skeleton**, nunca spinner isolado.

### Padrão obrigatório:

```tsx
if (loading) return <NomeDaTelaSkeletonScreen />;
if (error) return <EmptyState ... />;
return <TelaReal />;
```

### Como construir o skeleton:

- Use `View` com `backgroundColor: colors.skeleton` (ou `colors.border` como fallback)
- Aplique `borderRadius` compatível com o elemento real
- Use `Animated.loop` + `Animated.sequence` com opacidade entre `0.4` e `1.0` para o efeito de pulso
- O skeleton deve espelhar o layout real da tela (mesmas proporções e posições)

```tsx
// Exemplo de pulso
const pulse = useRef(new Animated.Value(0.4)).current;

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
    ])
  ).start();
}, []);
```

---

## 6. Micro-animações — aplicar onde agrega fluidez

Use `Animated` do React Native (sem libs externas). Aplique com critério — só onde melhora a percepção de resposta ou transição.

### Quando usar:

| Situação | Animação recomendada |
|---|---|
| Marcar transação como paga/recebida | Scale + fade no `StatusBadge` |
| Toggle de visibilidade do saldo | Fade out/in do valor |
| Abrir/fechar FAB com label | Spring horizontal no label |
| Cartão de carteira ao pressionar | Scale down suave (0.97) no `onPressIn` |
| Entrada de nova tela com lista | FadeIn com translateY leve nos itens (stagger) |
| Checkbox ao marcar | Scale no ícone de check (0 → 1) |
| Salvar com sucesso | Feedback visual no botão (opacity flash) |

### Padrão para press feedback:

```tsx
const scale = useRef(new Animated.Value(1)).current;

const onPressIn = () =>
  Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();

const onPressOut = () =>
  Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
```

**Regra:** sempre `useNativeDriver: true` para performance. Nunca animar `width`, `height` ou `padding` diretamente — use `transform` e `opacity`.

---

## 7. Padrões de tela

### Estrutura visual padrão (Home e Detalhe de Carteira):

```
┌─────────────────────────────┐
│  Header — colors.primary    │  ← fundo escuro
│  Título / saldo             │  ← texto colors.white
└─────────────────────────────┘
┌─────────────────────────────┐
│  Corpo — colors.background  │  ← fundo claro
│  Conteúdo principal         │
└─────────────────────────────┘
```

### Telas com fundo claro total:
- Login → `colors.white`
- Perfil, listas, formulários → `colors.background`

### Feedback obrigatório em toda ação:
- Salvar, editar, excluir → toast ou snackbar
- Excluir → confirmação via dialog antes de executar
- Salvar/excluir com sucesso → voltar para tela anterior automaticamente

---

## 8. Nomenclatura e organização

- Telas: `NomeDaTela.tsx` em PascalCase → `src/screens/`
- Hooks: `useNomeDoHook.ts` → `src/hooks/`
- Services: `nomeDoServico.ts` → `src/services/`
- Tipos: interfaces no singular → `Wallet`, `Transaction`, `Category`
- Skeletons: `NomeDaTelaSkeletonScreen.tsx` junto da tela que pertence

---

## 9. Segurança

- Variáveis de ambiente com prefixo `EXPO_PUBLIC_` via `.env.local` (não commitado)
- Regras do Firestore garantem que cada usuário acessa apenas `users/{seu próprio UID}`
- Nunca logar dados sensíveis do usuário no console
- Nunca expor chaves do Firebase em código hardcoded

---

## 10. O que está fora do escopo (não implementar)

- Integração bancária / Open Finance
- Notificações push
- Gráficos e relatórios avançados
- Metas financeiras
- Exportação de dados
- Versão iOS
- Múltiplos usuários / compartilhamento
- Tema escuro (dark mode)

---

**Última atualização:** 2026
**Projeto:** Bolso Simples