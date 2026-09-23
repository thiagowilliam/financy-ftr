# Financy — Backend

API GraphQL de finanças pessoais com autenticação JWT, isolamento de dados por usuário e CRUD de categorias e transações.

É consumida pela SPA em [`frontend/`](../frontend/README.md). A visão geral do projeto está no [README da raiz](../README.md).

Stack: TypeScript (ESM puro), Apollo Server 5 sobre Express 5, TypeGraphQL 2, Prisma 6 com SQLite, Biome para lint e format. Gerenciador de pacotes: **pnpm**. Execução apenas em desenvolvimento via `tsx watch`, sem etapa de build.

## Requisitos

- Node.js 22 ou superior (usa `process.loadEnvFile`)
- pnpm

## Setup

```bash
pnpm install
cp .env.example .env
```

Preencha o `.env`:

```env
JWT_SECRET=troque-por-um-segredo-forte
DATABASE_URL="file:./dev.db"
PORT=4000
CORS_ORIGIN=*
```

As variáveis são lidas pelo recurso nativo do Node (`process.loadEnvFile`) em `src/config/env.ts`. `JWT_SECRET` e `DATABASE_URL` são obrigatórias e a aplicação falha na inicialização se estiverem ausentes.

## Sequência de migrations

O schema evolui em etapas e cada etapa gera sua própria migration nomeada. Execute exatamente nesta ordem:

```bash
# 1. gera o client a partir do schema
pnpm prisma generate

# 2. tabela de usuários
pnpm prisma migrate dev --name create_users

# 3. tabela de categorias, com FK para users e unique composto
pnpm prisma migrate dev --name create_categories

# 4. tabela de transações, com FK para users e categories
pnpm prisma migrate dev --name create_transactions

# 5. índices de performance em transações
pnpm prisma migrate dev --name add_transaction_indexes

# 6. popular o banco
pnpm seed
```

Para reproduzir a sequência a partir do zero, o `prisma/schema.prisma` entregue já está consolidado. Aplique os blocos por etapa, comentando temporariamente o que ainda não entrou:

### Etapa 1: `create_users`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Etapa 2: `create_categories`

Acrescente ao `User` as relações e crie o model `Category`.

```prisma
model User {
  // campos anteriores
  categories Category[]
}

model Category {
  id        String   @id @default(cuid())
  name      String
  /// INCOME | EXPENSE
  type      String
  /// cor hexadecimal, opcional (ex.: #22C55E)
  color     String?
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, name])
  @@index([userId])
  @@map("categories")
}
```

### Etapa 3: `create_transactions`

```prisma
model User {
  // campos anteriores
  transactions Transaction[]
}

model Category {
  // campos anteriores
  transactions Transaction[]
}

model Transaction {
  id          String   @id @default(cuid())
  description String
  /// valor em CENTAVOS, sempre inteiro positivo maior que zero
  amount      Int
  /// INCOME | EXPENSE
  type        String
  date        DateTime
  categoryId  String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@map("transactions")
}
```

### Etapa 4: `add_transaction_indexes`

```prisma
model Transaction {
  // campos anteriores
  @@index([userId])
  @@index([userId, date])
}
```

O arquivo final e consolidado está em `prisma/schema.prisma`. O diretório `prisma/migrations` é versionado no Git.

Nota de recuperação: se o banco local ficar inconsistente durante o desenvolvimento, `pnpm prisma migrate reset` recria tudo e executa o seed. Não use isso no fluxo normal.

## Executar

```bash
pnpm dev
```

Playground disponível em `http://localhost:4000/graphql`.

Usuário do seed: `demo@financy.dev` / `123456`.

## Adicionar um usuário

Há três caminhos, dependendo do que você precisa.

**1. Rodar o seed.** Recria o usuário demo com um conjunto de dados realista: 6 categorias e 10 transações espalhadas pelos últimos meses.

```bash
pnpm seed
```

O seed é idempotente: ele faz `upsert` do usuário e apaga as categorias e transações dele antes de recriar, então pode ser executado quantas vezes for preciso sem duplicar nada. Para mudar as credenciais ou os dados gerados, edite as constantes no topo de `prisma/seed.ts`.

**2. Usar a mutation `signUp`.** É o caminho normal da aplicação, o mesmo usado pela tela de cadastro do frontend. No playground em `http://localhost:4000/graphql`:

```graphql
mutation SignUp {
  signUp(data: { name: "Thiago", email: "thiago@financy.dev", password: "123456" }) {
    token
    user { id name email }
  }
}
```

A senha passa por `bcrypt` antes de ser gravada e a resposta já devolve o JWT pronto para ser usado no header `Authorization`. O e-mail é normalizado para minúsculas e precisa ser único — um e-mail repetido retorna um erro `CONFLICT`. A senha tem mínimo de 6 caracteres.

**3. Inspecionar ou editar direto no banco.** Para conferir o que foi gravado ou ajustar um registro pontual:

```bash
pnpm prisma studio
```

Evite criar usuários por aqui: o campo `password` guarda um hash, e um valor em texto puro inserido manualmente nunca vai autenticar.

## Scripts

| Script | O que faz |
| --- | --- |
| `pnpm dev` | Sobe o servidor com `tsx watch` |
| `pnpm seed` | Popula o banco com o usuário demo |
| `pnpm migrate` | Atalho para `prisma migrate dev` (use sempre com `--name`) |
| `pnpm generate` | Gera o Prisma Client |
| `pnpm lint` | Lint, format check e organização de imports com Biome |
| `pnpm lint:fix` | Aplica as correções automáticas |
| `pnpm format` | Formata os arquivos |
| `pnpm typecheck` | `tsc --noEmit` |

Os comandos do Prisma que não têm atalho no `package.json` são chamados direto pelo binário: `pnpm prisma studio`, `pnpm prisma migrate reset`, `pnpm prisma migrate deploy`.

## Tecnologias

### Runtime e API

| Dependência | Papel no projeto |
| --- | --- |
| `@apollo/server` 5 | Servidor GraphQL |
| `@as-integrations/express5` | Adaptador que pluga o Apollo no Express 5 |
| `express` 5 | Servidor HTTP e camada de middlewares |
| `graphql` 16 | Implementação de referência do GraphQL |
| `type-graphql` 2 | Gera o schema GraphQL a partir de classes e decorators TypeScript |
| `reflect-metadata` | Metadados em runtime, exigidos pelos decorators do TypeGraphQL |
| `cors` | Libera o acesso do frontend, com a origem controlada por `CORS_ORIGIN` |

### Persistência

| Dependência | Papel no projeto |
| --- | --- |
| `prisma` / `@prisma/client` 6 | ORM, migrations e client tipado |
| SQLite | Banco de dados, em arquivo local (`prisma/dev.db`) |

### Segurança

| Dependência | Papel no projeto |
| --- | --- |
| `bcryptjs` | Hash das senhas |
| `jsonwebtoken` | Emissão e verificação dos tokens JWT |

### Desenvolvimento

| Dependência | Papel no projeto |
| --- | --- |
| `tsx` | Executa TypeScript direto, com watch mode — dispensa etapa de build |
| `typescript` 5.9 | Tipagem estática, em ESM puro |
| `@biomejs/biome` 2 | Lint, formatação e organização de imports |

Não há dependência de `dotenv`: o `.env` é lido pelo recurso nativo `process.loadEnvFile` do Node 22, em `src/config/env.ts`. A validação de inputs também é feita sem biblioteca externa, pelos helpers de `src/utils/validators.ts`.

## Estrutura de pastas

```
backend/
├── prisma/
│   ├── schema.prisma             # modelos User, Category e Transaction
│   ├── migrations/               # histórico versionado (vai para o Git)
│   ├── seed.ts                   # usuário demo + categorias + transações
│   └── dev.db                    # banco local (não versionado)
├── financy.operations.graphql    # coleção de operações para testar a API
└── src/
    ├── index.ts                  # entrypoint: carrega reflect-metadata e sobe o server
    ├── server.ts                 # Express + Apollo + CORS
    ├── config/env.ts             # leitura e validação das variáveis de ambiente
    ├── graphql/
    │   ├── schema.ts             # buildSchema: resolvers, authChecker, middlewares
    │   ├── context.ts            # extrai o userId do header Authorization
    │   └── auth-checker.ts       # regra do @Authorized()
    ├── modules/                  # um diretório por domínio
    │   ├── auth/                 # signUp e signIn
    │   ├── user/                 # query me
    │   ├── category/             # CRUD de categorias
    │   └── transaction/          # CRUD de transações
    ├── middlewares/
    │   ├── error-interceptor.middleware.ts
    │   └── logger.middleware.ts
    ├── shared/
    │   ├── enums/                # TransactionType
    │   └── errors/               # AppError e suas especializações
    ├── lib/prisma.ts             # instância única do Prisma Client
    └── utils/                    # jwt, password, require-user-id, validators
```

### Anatomia de um módulo

Todo módulo de domínio segue o mesmo desenho, o que torna qualquer um deles previsível depois de ler o primeiro:

```
modules/transaction/
├── transaction.resolver.ts   # queries e mutations; sem regra de negócio
├── transaction.service.ts    # regra de negócio, validação e acesso ao banco
├── transaction.model.ts      # @ObjectType exposto no schema
└── dtos/                     # @InputType de cada operação
```

O resolver é uma casca fina: ele resolve o `userId` com `requireUserId(ctx)` e delega ao service. Toda validação, checagem de posse e conversão de tipo acontece no service. Erros de domínio são lançados como subclasses de `AppError` (`ConflictError`, `NotFoundError`, `UnauthorizedError`, `ValidationError`) e o `ErrorInterceptor` os traduz para uma resposta GraphQL com código legível, em vez de vazar o erro cru do Prisma.

## Decisões relevantes

- SQLite não suporta `enum` no Prisma, então `type` é `String` no banco. O enum `TransactionType` vive no TypeScript, é registrado com `registerEnumType` e a conversão acontece no service.
- Valores monetários são `Int` em CENTAVOS. O sinal vem do `type`, nunca do valor. Nada de Float ou Decimal.
- Toda leitura e escrita filtra por `userId` do contexto autenticado. Update e delete fazem uma checagem de posse com `findFirst({ where: { id, userId } })` antes de agir.
- O campo `password` não tem `@Field` e não existe no schema GraphQL.
- Deletar categoria não deleta transações (`onDelete: SetNull`). Deletar usuário deleta em cascata categorias e transações.
- Nome de categoria é único por usuário. A violação vira um erro `CONFLICT` legível, nunca o erro cru do Prisma.
- A organização automática de imports do Biome está desativada apenas para `src/index.ts` via override em `biome.json`, para preservar `import "reflect-metadata"` na primeira linha.

## Exemplos de operações

### signUp

```graphql
mutation SignUp {
  signUp(data: { name: "Thiago", email: "thiago@financy.dev", password: "123456" }) {
    token
    user { id name email }
  }
}
```

### signIn

```graphql
mutation SignIn {
  signIn(data: { email: "demo@financy.dev", password: "123456" }) {
    token
    user { id name email }
  }
}
```

### createTransaction (autenticada)

Headers:

```json
{ "Authorization": "Bearer SEU_TOKEN_AQUI" }
```

```graphql
mutation CreateTransaction {
  createTransaction(
    data: {
      description: "Mercado da semana"
      amount: 15990
      type: EXPENSE
      date: "2026-09-09T12:00:00.000Z"
      categoryId: "COLE_O_ID_DA_CATEGORIA"
    }
  ) {
    id
    description
    amount
    type
    date
    category { id name type }
  }
}
```
