# Financy

Aplicação de controle de finanças pessoais. O usuário cria uma conta, cadastra categorias (receitas e despesas) e registra suas transações, com todos os dados isolados por usuário.

O projeto é dividido em dois pacotes independentes:

| Pacote | O que é | Porta | Documentação |
| --- | --- | --- | --- |
| [`backend/`](backend) | API GraphQL com autenticação JWT e persistência em SQLite | `4000` | [backend/README.md](backend/README.md) |
| [`frontend/`](frontend) | SPA em React consumindo a API via Apollo Client | `5173` | [frontend/README.md](frontend/README.md) |

## Início rápido

Os dois pacotes têm dependências próprias e precisam ser instalados separadamente. São necessários **Node.js 22+** e **pnpm**.

```bash
# Terminal 1 — API
cd backend
pnpm install
cp .env.example .env          # preencha o JWT_SECRET
pnpm prisma generate
pnpm prisma migrate dev
pnpm seed                     # cria o usuário demo@financy.dev / 123456
pnpm dev                      # http://localhost:4000/graphql

# Terminal 2 — Web
cd frontend
pnpm install
pnpm dev                      # http://localhost:5173
```

O frontend aponta para `http://localhost:4000/graphql`, então a API precisa estar no ar antes do login funcionar.

## Arquitetura

```
┌──────────────────────────┐         ┌─────────────────────────────────────┐
│  Browser (SPA)           │         │  Node.js                            │
│                          │         │                                     │
│  React 19 + React Router │         │  Express 5                          │
│  shadcn/ui + Tailwind    │         │    └── Apollo Server 5  /graphql    │
│  Zustand (auth + persist)│  HTTP   │          └── TypeGraphQL (schema)   │
│  Apollo Client ──────────┼────────▶│                └── Resolvers        │
│                          │ GraphQL │                    └── Services     │
│                          │  + JWT  │                        └── Prisma   │
└──────────────────────────┘         └─────────────────┬───────────────────┘
                                                       │
                                                  ┌────▼────┐
                                                  │ SQLite  │
                                                  │ dev.db  │
                                                  └─────────┘
```

O backend segue uma arquitetura em camadas, organizada por módulo de domínio (`auth`, `user`, `category`, `transaction`). Cada módulo repete a mesma estrutura:

- **Resolver** — expõe as queries e mutations, aplica `@Authorized()` e extrai o `userId` do contexto. Não contém regra de negócio.
- **Service** — concentra a regra de negócio, a validação dos inputs e o acesso ao Prisma. É onde a posse do registro é verificada.
- **Model** — o tipo exposto no schema GraphQL (`@ObjectType`).
- **DTOs** — os inputs das mutations (`@InputType`).

A autenticação é stateless: o `signIn`/`signUp` devolve um JWT, o frontend guarda no `localStorage` via Zustand e o envia no header `Authorization: Bearer <token>`. O backend decodifica esse token em `graphql/context.ts` e injeta o `userId` no contexto de cada request; o `authChecker` do TypeGraphQL barra qualquer operação anotada com `@Authorized()` quando esse `userId` é nulo.

## Estrutura de pastas

```
financy/
├── financy.code-workspace        # workspace do VS Code (frontend + backend)
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma         # modelos User, Category e Transaction
│   │   ├── migrations/           # histórico versionado das migrations
│   │   ├── seed.ts               # usuário demo + categorias + transações
│   │   └── dev.db                # banco SQLite local (não versionado)
│   └── src/
│       ├── index.ts              # entrypoint (carrega reflect-metadata)
│       ├── server.ts             # Express + Apollo + CORS
│       ├── config/env.ts         # leitura e validação das variáveis de ambiente
│       ├── graphql/              # montagem do schema, context e auth-checker
│       ├── modules/              # domínios: auth, user, category, transaction
│       ├── middlewares/          # interceptor de erros e logger
│       ├── shared/               # enums e classes de erro da aplicação
│       ├── lib/prisma.ts         # instância única do Prisma Client
│       └── utils/                # jwt, hash de senha e validadores
└── frontend/
    └── src/
        ├── main.tsx              # entrypoint (BrowserRouter)
        ├── App.tsx               # rotas públicas e protegidas
        ├── pages/                # telas (Login, Signup, StyleGuide, …)
        ├── components/
        │   ├── ui/               # design system (shadcn/ui customizado)
        │   └── brand/            # logo
        ├── stores/               # estado global com Zustand
        ├── lib/
        │   ├── apollo.ts         # client GraphQL
        │   └── graphql/          # queries e mutations
        ├── styles/
        │   ├── tokens.ts         # fonte da verdade do design system
        │   └── globals.css       # camada base do Tailwind
        └── types/                # tipos compartilhados do domínio
```

## Modelo de dados

```
User 1──* Category 1──* Transaction
  └────────────────*─────┘
```

- **User** — `id`, `name`, `email` (único), `password` (hash bcrypt).
- **Category** — pertence a um usuário, com `name` único por usuário, `type` (`INCOME` ou `EXPENSE`) e uma `color` hexadecimal opcional.
- **Transaction** — pertence a um usuário e, opcionalmente, a uma categoria.

Duas convenções valem para o projeto inteiro:

- **Valores monetários são inteiros em centavos.** `R$ 159,90` é gravado como `15990`. Nunca use `Float`.
- **O sinal do valor vem do campo `type`**, não do número. O `amount` é sempre positivo.

Apagar um usuário apaga em cascata suas categorias e transações. Apagar uma categoria **não** apaga as transações: elas ficam com `categoryId` nulo.

## Convenções de desenvolvimento

- **pnpm** é o gerenciador de pacotes dos dois pacotes.
- **Biome** cuida de lint, format e organização de imports em ambos. Rode `pnpm lint` antes de commitar e `pnpm lint:fix` para as correções automáticas.
- **TypeScript** em modo estrito nos dois lados; `pnpm typecheck` valida sem emitir arquivos.
- O backend roda apenas em modo desenvolvimento, via `tsx watch`, sem etapa de build.

## Estado atual

O que já funciona ponta a ponta: cadastro, login, logout e persistência da sessão no frontend; CRUD completo de categorias e transações na API, com isolamento por usuário.

Pendências conhecidas, úteis para quem for continuar o trabalho:

- O `authLink` do Apollo Client está comentado em [`frontend/src/lib/apollo.ts`](frontend/src/lib/apollo.ts), então o token ainda não é enviado nas operações autenticadas — as telas de categorias e transações vão precisar disso.
- A URL da API está fixa no código do frontend, sem variável de ambiente.
- As telas de categorias, transações e dashboard ainda não existem; a rota `/` exibe o style guide do design system.
