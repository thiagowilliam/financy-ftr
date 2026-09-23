# Financy — Frontend

SPA de controle de finanças pessoais, construída em React 19 com Vite e consumindo a [API GraphQL do projeto](../backend/README.md) via Apollo Client.

Gerenciador de pacotes: **pnpm**.

## Requisitos

- Node.js 22 ou superior
- pnpm
- A API rodando em `http://localhost:4000/graphql` (veja [`backend/README.md`](../backend/README.md))

## Setup

```bash
pnpm install
pnpm dev
```

A aplicação sobe em `http://localhost:5173`.

Não há arquivo `.env`: a URL da API está definida diretamente em [`src/lib/apollo.ts`](src/lib/apollo.ts). Para apontar para outro ambiente, altere o `uri` do `HttpLink` nesse arquivo.

## Como entrar na aplicação

A forma mais rápida é usar o usuário criado pelo seed do backend:

```
E-mail: demo@financy.dev
Senha:  123456
```

Se o seed ainda não foi executado, rode `pnpm seed` dentro de `backend/`.

Para criar um usuário novo, use a tela `/signup`. Ela dispara a mutation `signUp` ([`src/lib/graphql/mutations/Register.ts`](src/lib/graphql/mutations/Register.ts)), e o token devolvido pela API é gravado automaticamente na store de autenticação — ou seja, o cadastro já deixa o usuário logado.

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
| `@apollo/client` 4 + `graphql` | Cliente GraphQL e cache normalizado (`InMemoryCache`) |
| `zustand` 5 | Estado global de autenticação, com o middleware `persist` gravando no `localStorage` |

### Interface

| Dependência | Papel no projeto |
| --- | --- |
| `tailwindcss` 3.4 + `postcss` + `autoprefixer` | Estilização utilitária |
| `@radix-ui/*` | Primitivos acessíveis (checkbox, select, label, avatar, separator, slot) |
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
├── main.tsx                 # entrypoint: monta o React e o BrowserRouter
├── App.tsx                  # declaração das rotas + ProtectedRoute/PublicRoute
├── pages/                   # uma tela por arquivo
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── StyleGuide.tsx       # catálogo visual do design system
│   ├── Example.tsx
│   └── Teste.tsx
├── components/
│   ├── Layout.tsx           # casca da aplicação: header, main e Toaster
│   ├── Header.tsx
│   ├── Page.tsx
│   ├── brand/Logo.tsx
│   └── ui/                  # design system (shadcn/ui customizado)
├── stores/
│   ├── auth.ts              # login, signup, logout e sessão persistida
│   └── theme-store.ts
├── lib/
│   ├── apollo.ts            # instância do Apollo Client
│   ├── utils.ts             # helper cn()
│   ├── demo-state.ts        # prop data-demo-state, usada no style guide
│   └── graphql/mutations/   # documentos gql (Login, Register)
├── styles/
│   ├── tokens.ts            # fonte da verdade de cores e tipografia
│   └── globals.css          # camadas base do Tailwind e variáveis do shadcn
├── types/index.ts           # User, LoginInput, RegisterInput
└── assets/                  # logos em SVG
```

O alias `@/` aponta para `src/`, configurado em [`vite.config.ts`](vite.config.ts) e em [`tsconfig.app.json`](tsconfig.app.json). Prefira `@/components/ui/button` a caminhos relativos longos.

## Design system

Os componentes de UI vêm do **shadcn/ui** no estilo `new-york` (configuração em [`components.json`](components.json)), mas foram customizados para a identidade do Financy. Dois pontos importantes antes de mexer neles:

**A paleta padrão do Tailwind foi substituída.** Em [`tailwind.config.ts`](tailwind.config.ts), as cores são declaradas em `theme.colors` (e não em `theme.extend.colors`), o que remove as cores nativas do Tailwind. Só existem as classes geradas a partir de [`src/styles/tokens.ts`](src/styles/tokens.ts): `brand-base`, `brand-dark`, `gray-100` até `gray-800`, `danger`, `success` e as cores auxiliares. Uma classe como `text-slate-500` simplesmente não existe neste projeto.

**`tokens.ts` é a fonte única da verdade.** Ele alimenta ao mesmo tempo as classes do Tailwind, as variáveis CSS do shadcn (`--primary`, `--ring`, …) e a página de style guide. Para mudar uma cor do produto, altere o token — não a classe no componente.

A rota `/` renderiza o [`StyleGuide`](src/pages/StyleGuide.tsx), que serve como catálogo visual de todos os componentes e seus estados. É o lugar mais rápido para conferir o efeito de uma mudança no design system.

### Componentes com comportamento próprio

- [`Input`](src/components/ui/input.tsx) — recebe `label`, `icon`, `helperText` e `error` e monta o campo inteiro (label, campo, ícone e mensagem). Quando `type="password"`, exibe automaticamente o botão de mostrar/ocultar senha; use `hidePasswordToggle` para desligá-lo.
- [`Select`](src/components/ui/select.tsx) — segue a mesma convenção de label e mensagem de erro do `Input`.

## Rotas

| Rota | Tela | Acesso |
| --- | --- | --- |
| `/` | Style guide | Público |
| `/login` | Login | Público |
| `/signup` | Cadastro | Público |
| `/exemplo` | Exemplo de listagem | Público |

As rotas são envolvidas por dois wrappers declarados em [`App.tsx`](src/App.tsx): `PublicRoute` redireciona para `/` quem já está autenticado, e `ProtectedRoute` manda para `/login` quem não está.

## Autenticação

O fluxo vive todo em [`src/stores/auth.ts`](src/stores/auth.ts). As ações `login` e `signup` chamam as mutations correspondentes, guardam `user` e `token` na store e marcam `isAuthenticated`. O middleware `persist` do Zustand grava esse estado no `localStorage` sob a chave `auth-storage`, então a sessão sobrevive a um refresh. O `logout` limpa a store e chama `apolloClient.clearStore()`.

**Limitação atual:** o `authLink` que injeta o header `Authorization` está comentado em [`src/lib/apollo.ts`](src/lib/apollo.ts). O token é guardado, mas ainda não acompanha as requisições — qualquer query protegida (`me`, `categories`, `transactions`) vai voltar como não autorizada até que esse link seja reativado.
