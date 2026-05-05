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

## 6. Funcionalidades — MVP

### 6.1 Autenticação
- Login com Google (OAuth via Firebase)
- Login anônimo (sem criação de conta)
- Persistência de sessão entre aberturas do app

### 6.2 Carteiras
- Criar, editar e excluir carteiras
- Cada carteira tem: nome e cor (paleta fixa de 8 cores)
- Saldo calculado automaticamente com base nas transações pagas/recebidas
- Saldo pode ser ocultado (modo privacidade)

### 6.3 Transações
- Adicionar receita ou despesa em uma carteira
- Campos: título, valor, categoria, data, status, recorrência, descrição (opcional)
- Editar e excluir transações
- Marcar transação como paga/recebida diretamente na lista
- Filtro por mês (navegar entre meses)
- Visualizar lista de receitas ou despesas separadamente

### 6.4 Categorias
- Categorias padrão pré-cadastradas (Alimentação, Transporte, Saúde, etc.)
- Criar, editar e excluir categorias customizadas
- Cada categoria tem: nome, ícone (Phosphor) e cor

### 6.5 Perfil
- Exibir nome e foto do usuário (quando logado com Google)
- Gerenciar categorias
- Preferências: ocultar saldo por padrão
- Logout

---

## 7. Funcionalidades Fora do Escopo (MVP)

- Integração bancária / Open Finance
- Metas financeiras
- Gráficos e relatórios avançados
- Notificações push
- Versão iOS
- Exportação de dados
- Múltiplos usuários / compartilhamento

---

## 8. Fluxos Principais

### 8.1 Primeiro acesso
```
Splash → Tela de Login → (Google ou Anônimo) → Home
```

### 8.2 Adicionar transação
```
Home → Detalhe da Carteira → FAB (+) → Formulário → Salvar → Detalhe da Carteira
```

### 8.3 Marcar como pago
```
Lista de transações → Swipe ou toque no status → Confirmação imediata
```

---

## 9. Regras de Negócio

- **Saldo da carteira** = soma de receitas recebidas − soma de despesas pagas
- **Saldo total** = soma dos saldos de todas as carteiras
- **Transações pendentes** não entram no cálculo do saldo
- **Modo anônimo:** dados ficam vinculados ao UID anônimo do Firebase; se o usuário desinstalar o app, os dados são perdidos
- **Exclusão de carteira:** exclui também todas as transações filhas

---

## 10. Requisitos de UX

- Valor oculto exibe "••••••"
- **Confirmação antes de excluir:** toda exclusão exige confirmação via dialog
- **Feedback de ações:** toda ação de salvar, editar ou excluir deve ter feedback visual (toast ou snackbar)
- **Formatação:** todos os valores em R$ com separador de milhar e duas casas decimais. Todas as datas em dd/mm/aaaa
- **Navegação:** ao salvar ou excluir, volta para a tela anterior automaticamente
- **Teclado:** campos de valor abrem teclado numérico

---

## 11. Requisitos Não-Funcionais

- App deve abrir em menos de 3 segundos
- Funciona offline para leitura (dados em cache do Firestore)
- Sem travamentos perceptíveis ao navegar entre telas

---

## 12. Requisitos Técnicos

| Requisito | Decisão |
|---|---|
| Plataforma | Android (Google Play Store) |
| Framework | React Native + Expo (SDK gerenciado) |
| Linguagem | TypeScript |
| UI | React Native puro + StyleSheet + tokens de `src/constants/` |
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