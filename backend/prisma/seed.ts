import { PrismaClient } from "@prisma/client";
import { CATEGORY_COLORS, DEFAULT_CATEGORIES } from "../src/modules/category/default-categories.js";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@financy.dev";
const DEMO_PASSWORD = "123456";

const INCOME = "INCOME";
const EXPENSE = "EXPENSE";

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(12, 0, 0, 0);
  return date;
}

async function main(): Promise<void> {
  const password = await hashPassword(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: "Usuario Demo", password },
    create: { name: "Usuario Demo", email: DEMO_EMAIL, password },
  });

  // Idempotencia: limpa os dados do usuario demo antes de recriar.
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  // As categorias padrao (as mesmas criadas no cadastro) + extras usadas nas transacoes.
  const categories = [
    ...DEFAULT_CATEGORIES,
    {
      name: "Freelance",
      description: "Projetos e trabalhos avulsos",
      type: INCOME,
      icon: "receipt",
      color: CATEGORY_COLORS.blue,
    },
    {
      name: "Moradia",
      description: "Aluguel, condomínio e manutenção da casa",
      type: EXPENSE,
      icon: "house",
      color: CATEGORY_COLORS.orange,
    },
  ];

  const created = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.category.create({
      data: { ...category, userId: user.id },
    });
    created.set(record.name, record.id);
  }

  function categoryId(name: string): string {
    const id = created.get(name);
    if (id === undefined) {
      throw new Error(`Categoria nao criada no seed: ${name}`);
    }
    return id;
  }

  // Valores sempre em CENTAVOS.
  const transactions = [
    {
      description: "Salario de julho",
      amount: 850000,
      type: INCOME,
      date: daysAgo(75),
      category: "Salário",
    },
    {
      description: "Salario de agosto",
      amount: 850000,
      type: INCOME,
      date: daysAgo(45),
      category: "Salário",
    },
    {
      description: "Salario de setembro",
      amount: 880000,
      type: INCOME,
      date: daysAgo(15),
      category: "Salário",
    },
    {
      description: "Projeto landing page",
      amount: 320000,
      type: INCOME,
      date: daysAgo(38),
      category: "Freelance",
    },
    {
      description: "Aluguel",
      amount: 250000,
      type: EXPENSE,
      date: daysAgo(44),
      category: "Moradia",
    },
    {
      description: "Aluguel",
      amount: 250000,
      type: EXPENSE,
      date: daysAgo(14),
      category: "Moradia",
    },
    {
      description: "Supermercado do mes",
      amount: 78990,
      type: EXPENSE,
      date: daysAgo(30),
      category: "Mercado",
    },
    {
      description: "Combustivel",
      amount: 24500,
      type: EXPENSE,
      date: daysAgo(21),
      category: "Transporte",
    },
    {
      description: "Cinema com a familia",
      amount: 12000,
      type: EXPENSE,
      date: daysAgo(10),
      category: "Entretenimento",
    },
    {
      description: "Jantar fora",
      amount: 18750,
      type: EXPENSE,
      date: daysAgo(4),
      category: "Alimentação",
    },
    {
      description: "Rendimento CDB",
      amount: 15230,
      type: INCOME,
      date: daysAgo(20),
      category: "Investimento",
    },
    {
      description: "Consulta médica",
      amount: 35000,
      type: EXPENSE,
      date: daysAgo(18),
      category: "Saúde",
    },
    {
      description: "Conta de energia",
      amount: 21480,
      type: EXPENSE,
      date: daysAgo(12),
      category: "Utilidades",
    },
    {
      description: "Internet fibra",
      amount: 9990,
      type: EXPENSE,
      date: daysAgo(8),
      category: "Utilidades",
    },
  ];

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: {
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        categoryId: categoryId(transaction.category),
        userId: user.id,
      },
    });
  }

  const resumo = `${categories.length} categorias e ${transactions.length} transacoes`;
  console.log(`Seed concluido: ${resumo} para ${DEMO_EMAIL}`);

  // Usuarios cadastrados antes das categorias padrao existirem ficam sem nenhuma.
  const usersWithoutCategories = await prisma.user.findMany({
    where: { categories: { none: {} } },
    select: { id: true, email: true },
  });
  for (const { id, email } of usersWithoutCategories) {
    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({ ...category, userId: id })),
    });
    console.log(`Categorias padrao criadas para ${email}`);
  }
}

main()
  .catch((error: unknown) => {
    console.error("Falha ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
