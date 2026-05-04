# bolso**simples**

> App de bolso para finanças — 100% brasileiro, gratuito e sem anúncios.

Aplicativo mobile de controle financeiro pessoal para Android. O usuário entra, cria suas carteiras e registra transações manualmente. Simples, rápido e sem fricção.

---

## Documentação

Toda a documentação do projeto está na pasta `docs/`:

| Arquivo | Descrição |
|---|---|
| `docs/PRD.md` | Product Requirements Document — o que o app faz e por quê |
| `docs/ARCHITECTURE.md` | Arquitetura, estrutura de pastas e padrões de código |
| `docs/DESIGN.md` | Sistema de design, tokens e componentes |
| `docs/FLOWS.md` | Fluxos de navegação entre telas |

> **Agentes de IA:** leia os arquivos da pasta `docs/` antes de criar ou editar qualquer arquivo do projeto.

---

## Stack

- **React Native + Expo** (SDK gerenciado)
- **TypeScript**
- **Gluestack UI v2** + NativeWind
- **Firebase** (Authentication + Firestore)
- **React Navigation**
- **Phosphor React Native**

---

## Pré-requisitos

- Node.js LTS
- Expo Go no celular Android
- Conta Firebase com projeto configurado

---

## Como rodar

**1. Instalar dependências**
```bash
npm install
```

**2. Configurar variáveis de ambiente**
```bash
cp .env.example .env.local
```
Preencher `.env.local` com as chaves do Firebase Console.

**3. Rodar o projeto**
```bash
npx expo start
```

Escanear o QR code no Expo Go.

---

## Estrutura de pastas

```
src/
├── app/          → rotas (Expo Router)
├── screens/      → telas completas
├── components/   → componentes do projeto
│   └── ui/       → componentes do Gluestack
├── services/     → Firebase
├── hooks/        → hooks customizados
├── store/        → contexto global
├── utils/        → formatadores
├── constants/    → valores fixos
└── types/        → tipagem TypeScript
```

---

## Variáveis de ambiente

Copiar `.env.example` para `.env.local` e preencher:

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

> `.env.local` nunca é commitado — está no `.gitignore`.

---

## Design System (dev only)

Em modo de desenvolvimento, acesse a tela de Design System para visualizar e testar os componentes:

```
/design-system
```

Disponível apenas com `__DEV__ === true`. Não aparece no app publicado.