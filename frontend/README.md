# Financy — Frontend

SPA de controle de finanças pessoais, construída em React 19 com Vite e consumindo a [API GraphQL do projeto](../backend/README.md).

Gerenciador de pacotes: **pnpm**.

## Requisitos

- Node.js 22.18 ou superior (os testes usam o suporte nativo a TypeScript do Node)
- pnpm
- A API rodando (veja [`backend/README.md`](../backend/README.md))

## Setup

```bash
pnpm install
cp .env.example .env   # opcional: só é necessário se a API não estiver em localhost:4000
pnpm dev
```

A aplicação sobe em `http://localhost:5173`.

### Variáveis de ambiente

| Variável | Padrão | O que é |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:4000/graphql` | Endpoint GraphQL da API |

A variável é lida em [`src/lib/graphql/client.ts`](src/lib/graphql/client.ts), o único ponto do app que fala com a API.

## Como entrar na aplicação

A forma mais rápida é usar o usuário criado pelo seed do backend:

```
E-mail: demo@financy.dev
Senha:  12345678
```

Se o seed ainda não foi executado, rode `pnpm seed` dentro de `backend/`.

Para criar um usuário novo, use a tela `/signup` (senha com no mínimo 8 caracteres). O token devolvido pela API é gravado na store de autenticação, então o cadastro já deixa o usuário logado. Todo usuário novo começa com um conjunto de categorias padrão.

## Scripts

| Script | O que faz |
| --- | --- |
| `pnpm dev` | Sobe o servidor de desenvolvimento do Vite com HMR |
| `pnpm build` | Roda `tsc -b` e gera o bundle de produção em `dist/` |
| `pnpm preview` | Serve localmente o build gerado, para conferir o resultado final |
| `pnpm lint` | Lint, format check e organização de imports com Biome |
| `pnpm lint:fix` | Aplica as correções automáticas do Biome |
| `pnpm format` | Apenas formata os arquivos |
| `pnpm typecheck` | Checagem de tipos com `tsc -b`, sem emitir arquivos |
| `pnpm test` | Testes unitários com o runner nativo do Node (`node:test`) |

## Tecnologias

### Base

| Dependência | Papel no projeto |
| --- | --- |
| `react` / `react-dom` 19 | Biblioteca de UI |
| `vite` 8 + `@vitejs/plugin-react` | Dev server com HMR e bundler de produção |
| `typescript` 6 | Tipagem estática, em modo estrito |
| `react-router-dom` 7 | Roteamento client-side e proteção de rotas |

### Dados e estado

| Dependência | Papel no projeto |
| --- | --- |
| `@tanstack/react-query` 5 | Cache, loading/erro, paginação e invalidação das operações GraphQL |
| `graphql` | Linguagem das operações (documentos em `src/lib/graphql/`) |
| `zustand` 5 | Estado global de autenticação, com o middleware `persist` gravando no `localStorage` |

### Interface

| Dependência | Papel no projeto |
| --- | --- |
| `tailwindcss` 3.4 + `postcss` + `autoprefixer` | Estilização utilitária |
| `@radix-ui/*` | Primitivos acessíveis (checkbox, dialog, select, label, avatar, separator, slot) |
| `class-variance-authority` | Variantes tipadas dos componentes do design system |
| `clsx` + `tailwind-merge` | Compostos no helper `cn()`, que resolve conflitos entre classes do Tailwind |
| `tailwindcss-animate` | Animações usadas pelos componentes do shadcn |
| `lucide-react` | Ícones |
| `sonner` | Toasts de feedback (sucesso e erro) |

### Qualidade

| Dependência | Papel no projeto |
| --- | --- |
| `@biomejs/biome` | Lint, formatação e organização de imports em uma ferramenta só |

## Estrutura de pastas

```
src/
├── main.tsx                 # entrypoint: QueryClientProvider + BrowserRouter
├── App.tsx                  # rotas + ProtectedRoute/PublicRoute
├── pages/                   # uma tela por arquivo
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Categories.tsx
│   ├── Profile.tsx
│   └── StyleGuide.tsx       # catálogo visual do design system (sem rota)
├── api/                     # funções de acesso à API + query keys/queryOptions
├── hooks/                   # hooks do React Query (useCategories, useCreateTransaction, …)
├── components/
│   ├── Layout.tsx           # casca da aplicação: header, main e Toaster
│   ├── Header.tsx
│   ├── categories/          # cards, formulário e exclusão de categorias
│   ├── transactions/        # tabela, filtros, formulário e exclusão de transações
│   ├── dashboard/           # cards de resumo, transações recentes, categorias
│   ├── brand/Logo.tsx
│   └── ui/                  # design system (shadcn/ui customizado)
├── stores/
│   ├── auth.ts              # login, signup, logout e sessão persistida
│   └── theme-store.ts
├── lib/
│   ├── graphql/
│   │   ├── client.ts        # graphqlRequest(): fetch + token + tratamento de erros
│   │   ├── errors.ts        # GraphQLRequestError e getErrorMessage()
│   │   ├── queries/         # documentos das queries e mutations por domínio
│   │   └── mutations/       # Login e Register
│   ├── query-client.ts      # QueryClient com regras de retry
│   ├── format.ts            # moeda, datas e conversão de centavos
│   ├── period.ts            # opções de mês/ano para os filtros
│   └── utils.ts             # helper cn()
├── styles/
│   ├── tokens.ts            # fonte da verdade de cores e tipografia
│   └── globals.css          # camadas base do Tailwind e variáveis do shadcn
├── types/index.ts           # tipos do domínio (User, Category, Transaction, …)
└── assets/                  # logos em SVG
```

Os testes ficam ao lado do arquivo testado, com o sufixo `.test.ts` (ex.: `lib/format.test.ts`).

O alias `@/` aponta para `src/`, configurado em [`vite.config.ts`](vite.config.ts) e em [`tsconfig.app.json`](tsconfig.app.json). Prefira `@/components/ui/button` a caminhos relativos longos.

## Comunicação com a API

Todas as operações — inclusive login e cadastro — passam por uma única função, `graphqlRequest()` em [`src/lib/graphql/client.ts`](src/lib/graphql/client.ts):

- envia a operação GraphQL por `fetch` para `VITE_API_URL`;
- anexa `Authorization: Bearer <token>` quando há sessão;
- converte o primeiro erro GraphQL em `GraphQLRequestError`, com o `code` do backend (`BAD_USER_INPUT`, `CONFLICT`, `NOT_FOUND`, `UNAUTHENTICATED`, `TOO_MANY_REQUESTS`…);
- faz logout automático quando a API responde `UNAUTHENTICATED` (token expirado ou inválido).

Por cima dela, o **React Query** cuida de cache, loading e erros. Cada domínio tem um arquivo em `src/api/` (funções + query keys) e um em `src/hooks/` (hooks de query e mutation). Toda mutation invalida os caches que dependem dela — por exemplo, criar uma transação atualiza a listagem, a contagem de transações das categorias e o dashboard.

## Rotas

| Rota | Tela | Acesso |
| --- | --- | --- |
| `/login` | Login | Público |
| `/signup` | Cadastro | Público |
| `/` | Dashboard | Autenticado |
| `/transactions` | Transações (busca, filtros, paginação, criar/editar/excluir) | Autenticado |
| `/categories` | Categorias (criar/editar/excluir) | Autenticado |
| `/profile` | Perfil e logout | Autenticado |

As rotas são envolvidas por dois wrappers declarados em [`App.tsx`](src/App.tsx): `PublicRoute` redireciona para `/` quem já está autenticado, e `ProtectedRoute` manda para `/login` quem não está. Qualquer outra URL redireciona para `/`.

## Autenticação

O fluxo vive em [`src/stores/auth.ts`](src/stores/auth.ts). As ações `login` e `signup` chamam as mutations `signIn`/`signUp` via `graphqlRequest()`, guardam `user` e `token` na store e marcam `isAuthenticated`. O middleware `persist` do Zustand grava esse estado no `localStorage` sob a chave `auth-storage`, então a sessão sobrevive a um refresh. O `logout` limpa a store e o cache do React Query, para que nenhum dado de um usuário apareça para o próximo.

Erros de login e cadastro (credenciais inválidas, e-mail já cadastrado, muitas tentativas) são exibidos em toast com a mensagem enviada pela API.

## Design system

Os componentes de UI vêm do **shadcn/ui** no estilo `new-york` (configuração em [`components.json`](components.json)), mas foram customizados para a identidade do Financy. Dois pontos importantes antes de mexer neles:

**A paleta padrão do Tailwind foi substituída.** Em [`tailwind.config.ts`](tailwind.config.ts), as cores são declaradas em `theme.colors` (e não em `theme.extend.colors`), o que remove as cores nativas do Tailwind. Só existem as classes geradas a partir de [`src/styles/tokens.ts`](src/styles/tokens.ts): `brand-base`, `brand-dark`, `gray-100` até `gray-800`, `danger`, `success` e as cores auxiliares. Uma classe como `text-slate-500` simplesmente não existe neste projeto.

**`tokens.ts` é a fonte única da verdade.** Ele alimenta ao mesmo tempo as classes do Tailwind, as variáveis CSS do shadcn (`--primary`, `--ring`, …) e a página de style guide ([`StyleGuide.tsx`](src/pages/StyleGuide.tsx)). Para mudar uma cor do produto, altere o token — não a classe no componente.

### Componentes com comportamento próprio

- [`Input`](src/components/ui/input.tsx) — recebe `label`, `icon`, `helperText` e `error` e monta o campo inteiro (label, campo, ícone e mensagem). Quando `type="password"`, exibe automaticamente o botão de mostrar/ocultar senha; use `hidePasswordToggle` para desligá-lo.
- [`Select`](src/components/ui/select.tsx) — segue a mesma convenção de label e mensagem de erro do `Input`.

## Testes

```bash
pnpm test
```

Usam o runner nativo do Node (`node:test` + `node:assert`), sem dependências extras, e cobrem funções puras: formatação e parsing de moeda/datas (`lib/format.ts`) e o tratamento de mensagens de erro (`lib/graphql/errors.ts`). Os arquivos `*.test.ts` ficam fora do build do app (`tsconfig.app.json`) e são checados pelo `tsconfig.node.json`.
