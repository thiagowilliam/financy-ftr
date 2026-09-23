import { PrismaClient } from "@prisma/client";
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

  const categories = [
    { name: "Salario", type: INCOME, color: "#22C55E" },
    { name: "Freelance", type: INCOME, color: "#0EA5E9" },
    { name: "Alimentacao", type: EXPENSE, color: "#F97316" },
    { name: "Moradia", type: EXPENSE, color: "#8B5CF6" },
    { name: "Transporte", type: EXPENSE, color: "#EF4444" },
    { name: "Lazer", type: EXPENSE, color: "#EC4899" },
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
      category: "Salario",
    },
    {
      description: "Salario de agosto",
      amount: 850000,
      type: INCOME,
      date: daysAgo(45),
      category: "Salario",
    },
    {
      description: "Salario de setembro",
      amount: 880000,
      type: INCOME,
      date: daysAgo(15),
      category: "Salario",
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
      category: "Alimentacao",
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
      category: "Lazer",
    },
    {
      description: "Jantar fora",
      amount: 18750,
      type: EXPENSE,
      date: daysAgo(4),
      category: "Alimentacao",
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
}

main()
  .catch((error: unknown) => {
    console.error("Falha ao executar o seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
