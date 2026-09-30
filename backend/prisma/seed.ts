import { PrismaClient } from "@prisma/client";
import { CATEGORY_COLORS, DEFAULT_CATEGORIES } from "../src/modules/category/default-categories.js";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

const DEMO_EMAIL = "demo@financy.dev";
const DEMO_PASSWORD = "12345678";

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

  // 30 transacoes nos ultimos 3 meses. Valores sempre em CENTAVOS.
  const transactions = [
    {
      description: "Salário de julho",
      amount: 850000,
      type: INCOME,
      date: daysAgo(88),
      category: "Salário",
    },
    {
      description: "Aluguel",
      amount: 250000,
      type: EXPENSE,
      date: daysAgo(86),
      category: "Moradia",
    },
    {
      description: "Supermercado do mês",
      amount: 68540,
      type: EXPENSE,
      date: daysAgo(83),
      category: "Mercado",
    },
    {
      description: "Conta de energia",
      amount: 19870,
      type: EXPENSE,
      date: daysAgo(80),
      category: "Utilidades",
    },
    {
      description: "Jantar com amigos",
      amount: 21000,
      type: EXPENSE,
      date: daysAgo(77),
      category: "Alimentação",
    },
    {
      description: "Combustível",
      amount: 23000,
      type: EXPENSE,
      date: daysAgo(74),
      category: "Transporte",
    },
    {
      description: "Projeto landing page",
      amount: 320000,
      type: INCOME,
      date: daysAgo(70),
      category: "Freelance",
    },
    {
      description: "Show de música",
      amount: 18000,
      type: EXPENSE,
      date: daysAgo(66),
      category: "Entretenimento",
    },
    { description: "Farmácia", amount: 8750, type: EXPENSE, date: daysAgo(63), category: "Saúde" },
    {
      description: "Salário de agosto",
      amount: 850000,
      type: INCOME,
      date: daysAgo(58),
      category: "Salário",
    },
    {
      description: "Aluguel",
      amount: 250000,
      type: EXPENSE,
      date: daysAgo(56),
      category: "Moradia",
    },
    {
      description: "Internet fibra",
      amount: 9990,
      type: EXPENSE,
      date: daysAgo(54),
      category: "Utilidades",
    },
    {
      description: "Rendimento CDB",
      amount: 14210,
      type: INCOME,
      date: daysAgo(51),
      category: "Investimento",
    },
    {
      description: "Feira da semana",
      amount: 12380,
      type: EXPENSE,
      date: daysAgo(49),
      category: "Mercado",
    },
    {
      description: "Uber para o aeroporto",
      amount: 6490,
      type: EXPENSE,
      date: daysAgo(46),
      category: "Transporte",
    },
    {
      description: "Almoço no restaurante",
      amount: 5890,
      type: EXPENSE,
      date: daysAgo(43),
      category: "Alimentação",
    },
    {
      description: "Consulta médica",
      amount: 35000,
      type: EXPENSE,
      date: daysAgo(40),
      category: "Saúde",
    },
    {
      description: "Assinatura streaming",
      amount: 5590,
      type: EXPENSE,
      date: daysAgo(37),
      category: "Entretenimento",
    },
    {
      description: "Manutenção do portão",
      amount: 45000,
      type: EXPENSE,
      date: daysAgo(34),
      category: "Moradia",
    },
    {
      description: "Salário de setembro",
      amount: 880000,
      type: INCOME,
      date: daysAgo(28),
      category: "Salário",
    },
    {
      description: "Aluguel",
      amount: 250000,
      type: EXPENSE,
      date: daysAgo(26),
      category: "Moradia",
    },
    {
      description: "Supermercado do mês",
      amount: 78990,
      type: EXPENSE,
      date: daysAgo(24),
      category: "Mercado",
    },
    {
      description: "Consultoria de site",
      amount: 180000,
      type: INCOME,
      date: daysAgo(21),
      category: "Freelance",
    },
    {
      description: "Combustível",
      amount: 24500,
      type: EXPENSE,
      date: daysAgo(19),
      category: "Transporte",
    },
    {
      description: "Rendimento CDB",
      amount: 15230,
      type: INCOME,
      date: daysAgo(16),
      category: "Investimento",
    },
    {
      description: "Conta de energia",
      amount: 21480,
      type: EXPENSE,
      date: daysAgo(13),
      category: "Utilidades",
    },
    {
      description: "Cinema com a família",
      amount: 12000,
      type: EXPENSE,
      date: daysAgo(10),
      category: "Entretenimento",
    },
    {
      description: "Exames de rotina",
      amount: 27000,
      type: EXPENSE,
      date: daysAgo(7),
      category: "Saúde",
    },
    {
      description: "Delivery de pizza",
      amount: 8990,
      type: EXPENSE,
      date: daysAgo(4),
      category: "Alimentação",
    },
    {
      description: "Jantar fora",
      amount: 18750,
      type: EXPENSE,
      date: daysAgo(2),
      category: "Alimentação",
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
