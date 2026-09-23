# financy

API GraphQL de finanças pessoais com autenticação JWT, isolamento de dados por usuário e CRUD de categorias e transações.

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
