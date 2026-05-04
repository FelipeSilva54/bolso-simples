# PRD — Bolso Simples

> **Documento vivo.** Atualizar sempre que houver mudanças de produto.
> Este documento é a fonte de verdade do produto. Qualquer agente de IA ou desenvolvedor deve ler este arquivo antes de criar, editar ou tomar decisões sobre o produto.

---

## Metadados

| Campo | Valor |
|---|---|
| Produto | Bolso Simples |
| Versão | 1.0 |
| Status | Em desenvolvimento |
| Plataforma | Android |
| Última atualização | 2026 |

---

## 1. Resumo Executivo

O **Bolso Simples** é um aplicativo mobile de controle financeiro pessoal para Android. O objetivo é ser simples, rápido e direto: o usuário entra, cria suas carteiras e registra transações manualmente. Sem banco conectado, sem inteligência artificial, sem complexidade.

O diferencial é a proposta de valor clara: **100% brasileiro, gratuito e sem anúncios.**

---

## 2. Problema

Aplicativos de finanças pessoais existentes no mercado tendem a ser complexos demais ou exigem integração bancária, criação de conta com e-mail/senha, e configurações extensas antes de o usuário conseguir registrar qualquer coisa.

O usuário que precisa apenas de um caderninho digital para anotar o que entra e o que sai não encontra um app simples o suficiente.

**Dores principais:**
- Processo de cadastro longo antes de usar
- Obrigatoriedade de vincular conta bancária
- Interfaces carregadas e difíceis de entender
- Apps com anúncios que interrompem o uso

---

## 3. Solução

Um app minimalista onde o usuário entra com um clique (Google ou modo anônimo), cria uma carteira e começa a registrar. Sem formulários longos, sem integrações, sem complexidade.

---

## 4. Usuário-Alvo

**Persona principal: Ana, 28 anos**
- Trabalha com carteira assinada e tem renda variável extra (freela)
- Quer saber quanto entra e quanto sai por mês
- Já tentou outros apps de finanças mas desistiu pela complexidade
- Usa Android, prefere apps simples e rápidos
- Não quer vincular conta bancária a nenhum app

**Jobs to be Done (JTBD):**
- "Quando eu recebo meu salário, quero registrar quanto entrou pra saber meu saldo atual."
- "Quando pago uma conta, quero marcar como pago pra não perder o controle."
- "Quando termina o mês, quero ver quanto gastei e quanto recebi."
- "Quando tenho várias fontes de renda, quero organizar em carteiras separadas."

---

## 5. Objetivos do Produto

| Objetivo | Métrica de sucesso |
|---|---|
| Onboarding rápido | Usuário registra primeira transação em menos de 2 minutos |
| Retenção | Usuário retorna ao app pelo menos uma vez por semana |
| Simplicidade | Qualquer ação principal realizada em no máximo 3 toques |
| Confiabilidade | Dados nunca perdidos entre sessões |

---

## 6. Funcionalidades

### Prioridade P0 — Essencial (sem isso o app não existe)

#### 6.1 Autenticação
- Login com Google (OAuth via Firebase Authentication)
- Login anônimo (sem cadastro, sem e-mail, sem senha)
- Sessão persistida entre aberturas do app
- Logout disponível na tela de Perfil

**Regras:**
- Não existe cadastro manual com e-mail e senha
- Usuário anônimo tem os dados salvos no Firebase vinculados ao UID anônimo
- Se o usuário anônimo fizer login com Google, os dados devem ser migrados para a conta Google

#### 6.2 Carteiras
Uma carteira representa uma conta financeira do usuário (ex: carteira física, conta corrente, poupança, cartão de crédito).

**Criar carteira:**
- Campos: nome (obrigatório), cor (obrigatório — o usuário escolhe de uma paleta)
- Saldo começa em zero
- Não há saldo inicial configurável — o saldo é sempre calculado pelas transações

**Visualizar carteiras (Home):**
- Lista de todas as carteiras do usuário
- Cada carteira exibe: nome, cor de fundo, saldo atual
- Saldo total de todas as carteiras exibido no topo
- Ícone de olho para ocultar/revelar valores (saldo total e saldo de cada carteira ficam borrados)
- Estado vazio quando não há carteiras cadastradas

**Editar carteira:**
- Permite alterar nome e cor
- Saldo não é editável diretamente — é sempre calculado

**Excluir carteira:**
- Confirmação obrigatória antes de excluir
- Ao excluir, todas as transações da carteira são excluídas junto

#### 6.3 Transações
Uma transação é um registro financeiro dentro de uma carteira.

**Tipos de transação:**
- **Receita:** dinheiro que entra na carteira
- **Despesa:** dinheiro que sai da carteira

**Campos de uma transação:**
- Título (obrigatório)
- Valor (obrigatório — sempre positivo, o tipo define se é entrada ou saída)
- Tipo: receita ou despesa (obrigatório)
- Categoria (obrigatório — selecionada de uma lista)
- Data (obrigatório — padrão: data atual)
- Status:
  - Para despesas: **Pago** ou **Não pago**
  - Para receitas: **Recebido** ou **Não recebido**
- Recorrente: sim ou não (campo informativo — não gera repetição automática)
- Descrição (opcional)

**Regras de saldo:**
- Despesas **pagas** subtraem do saldo
- Despesas **não pagas** NÃO subtraem do saldo (são compromissos futuros)
- Receitas **recebidas** somam ao saldo
- Receitas **não recebidas** NÃO somam ao saldo

**Ações disponíveis em uma transação:**
- Marcar como pago/recebido (ação rápida, sem abrir detalhes)
- Editar (abre formulário com os dados preenchidos)
- Excluir (confirmação obrigatória)

#### 6.4 Visualização por mês
Dentro de cada carteira, as transações são organizadas por mês.

**Resumo mensal:**
- Total de receitas do mês (somando apenas as recebidas)
- Total de despesas do mês (somando apenas as pagas)
- Saldo do mês = receitas recebidas − despesas pagas
- Filtro de mês: navegar entre meses (anterior / próximo)

**Histórico de transações do mês:**
- Lista cronológica de todas as transações do mês selecionado
- Cada item exibe: ícone da categoria, título, valor, data e status (pago/recebido/pendente)
- Ação rápida de marcar como pago/recebido diretamente na lista

**Tela de Receitas do mês:**
- Acessada ao clicar no card de receitas
- Exibe todas as receitas do mês divididas em duas seções: Recebidas e Não recebidas
- Total de cada seção

**Tela de Despesas do mês:**
- Acessada ao clicar no card de despesas
- Exibe todas as despesas do mês divididas em duas seções: Pagas e Não pagas
- Total de cada seção

### Prioridade P1 — Importante

#### 6.5 Categorias
Usadas para classificar as transações.

**Categorias padrão (pré-cadastradas no primeiro acesso):**
- Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Salário, Freelance, Investimentos, Outros

**Categorias customizadas:**
- O usuário pode criar, editar e excluir categorias
- Cada categoria tem: nome, ícone (selecionado de uma lista do Phosphor), cor

**Regra:** não é possível excluir uma categoria que está em uso por alguma transação.

#### 6.6 Perfil
Tela acessada pela tab bar.

**Conteúdo:**
- Foto, nome e e-mail do usuário (ou "Usuário anônimo" se sem conta)
- Atalho para Categorias
- Preferências (ex: ocultar saldo por padrão)
- Notificações in-app (sem push notifications)
- FAQ
- Avaliar no Google Play (link externo)
- Sobre o app (versão, créditos)
- Botão de Logout (com confirmação)

### Prioridade P2 — Desejável (futuramente)

- Notificações locais (lembrete de contas a pagar)
- Exportação de dados (PDF ou CSV)
- Gráficos de evolução mensal
- Tema escuro

---

## 7. Fluxos Principais

### 7.1 Fluxo de Onboarding
```
Abrir app
  └── [Não autenticado] → Tela de Login
        ├── Entrar com Google → Auth Firebase → Home
        └── Entrar sem cadastro → Auth Anônima → Home

  └── [Já autenticado] → Home (direto, sem passar pelo Login)
```

### 7.2 Fluxo de Criar Carteira
```
Home (estado vazio ou com carteiras)
  └── Botão "+ Adicionar carteira"
        └── Modal/Tela de nova carteira
              ├── Preenche nome
              ├── Escolhe cor
              └── Confirma → Salva no Firestore → Volta para Home com nova carteira
```

### 7.3 Fluxo de Adicionar Transação
```
Detalhe da Carteira
  └── Botão "+ Nova transação"
        └── Tela de adicionar transação
              ├── Seleciona tipo (receita / despesa)
              ├── Preenche título, valor, categoria, data
              ├── Define status (pago/recebido)
              ├── (Opcional) Descrição, recorrente
              └── Confirma → Salva no Firestore → Volta para Detalhe da Carteira
```

### 7.4 Fluxo de Visualização Mensal
```
Detalhe da Carteira
  ├── Filtro de mês (anterior / próximo)
  ├── Card de Receitas do mês → Tela de Receitas (recebidas / não recebidas)
  ├── Card de Despesas do mês → Tela de Despesas (pagas / não pagas)
  └── Lista de transações do mês
        └── Clique em transação → Detalhe da Transação
              ├── Marcar como pago/recebido
              ├── Editar
              └── Excluir
```

---

## 8. Mapa de Telas

| # | Tela | Acesso | Descrição |
|---|---|---|---|
| 1 | Login | Abertura do app | Google, anônimo |
| 2 | Home | Tab bar | Saldo total + lista de carteiras |
| 3 | Adicionar/Editar Carteira | Home | Modal com nome e cor |
| 4 | Detalhe da Carteira | Home → carteira | Resumo mensal + histórico |
| 5 | Lista de Receitas | Detalhe → card receitas | Recebidas e não recebidas |
| 6 | Lista de Despesas | Detalhe → card despesas | Pagas e não pagas |
| 7 | Detalhe da Transação | Lista → transação | Visualizar, editar, excluir, marcar |
| 8 | Adicionar/Editar Transação | Detalhe → nova transação | Formulário completo |
| 9 | Perfil | Tab bar | Dados, categorias, configurações |
| 10 | Categorias | Perfil | Lista de categorias |
| 11 | Adicionar/Editar Categoria | Categorias | Formulário de categoria |
| 12 | Preferências | Perfil | Configurações do app |
| 13 | FAQ | Perfil | Perguntas frequentes |
| 14 | Sobre | Perfil | Versão e créditos |

---

## 9. Regras de Negócio

| # | Regra |
|---|---|
| RN01 | Saldo = soma das receitas recebidas − soma das despesas pagas |
| RN02 | Despesas não pagas e receitas não recebidas não afetam o saldo |
| RN04 | Ao excluir uma carteira, todas as suas transações são excluídas |
| RN05 | Não é possível excluir categoria em uso por alguma transação |
| RN06 | Valores são sempre positivos — o tipo da transação define entrada ou saída |
| RN07 | Data padrão de uma nova transação é a data atual |
| RN08 | Saldo total = soma dos saldos de todas as carteiras |
| RN09 | Usuário anônimo tem dados salvos no Firebase com UID anônimo |
| RN10 | Valores monetários exibidos sempre em formato brasileiro (R$ 1.250,00) |
| RN11 | Datas exibidas sempre em formato brasileiro (dd/mm/aaaa) |

---

## 10. Estados de Interface

Cada tela com lista deve ter os seguintes estados tratados:

| Estado | Quando ocorre | O que exibir |
|---|---|---|
| Vazio | Sem itens cadastrados | Ilustração + texto explicativo + CTA |
| Carregando | Buscando dados do Firestore | Skeleton ou spinner |
| Com dados | Itens disponíveis | Lista normal |
| Erro | Falha na conexão | Mensagem de erro + botão de tentar novamente |

---

## 11. Comportamentos Globais

- **Visibilidade do saldo:** ícone de olho oculta/revela todos os valores monetários da tela atual. Valor oculto exibe "••••••"
- **Confirmação antes de excluir:** toda exclusão exige confirmação via dialog
- **Feedback de ações:** toda ação de salvar, editar ou excluir deve ter feedback visual (toast ou snackbar)
- **Formatação:** todos os valores em R$ com separador de milhar e duas casas decimais. Todas as datas em dd/mm/aaaa
- **Navegação:** ao salvar ou excluir, volta para a tela anterior automaticamente
- **Teclado:** campos de valor abrem teclado numérico

---

## 12. Requisitos Técnicos

| Requisito | Decisão |
|---|---|
| Plataforma | Android (Google Play Store) |
| Framework | React Native + Expo (SDK gerenciado) |
| Linguagem | TypeScript |
| UI | Gluestack UI v2 + NativeWind |
| Auth | Firebase Authentication (Google + Anônimo) |
| Banco | Firebase Firestore (southamerica-east1) |
| Persistência local | AsyncStorage (sessão Firebase) |
| Ícones | Phosphor React Native |
| Navegação | React Navigation (native stack + bottom tabs) |
| Variáveis de ambiente | EXPO_PUBLIC_* via .env.local |

---

## 13. Glossário

| Termo | Definição |
|---|---|
| Carteira | Conta financeira do usuário (ex: conta corrente, carteira física) |
| Transação | Registro financeiro dentro de uma carteira |
| Receita | Transação de entrada de dinheiro |
| Despesa | Transação de saída de dinheiro |
| Saldo | Resultado das receitas recebidas menos despesas pagas |
| Status | Situação de uma transação: pago/não pago ou recebido/não recebido |
| Categoria | Classificação de uma transação (ex: Alimentação, Transporte) |
| Modo anônimo | Acesso sem conta — Firebase cria UID anônimo |
| UID | Identificador único do usuário no Firebase |