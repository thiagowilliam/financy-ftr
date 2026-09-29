import { prisma } from "../../lib/prisma.js";
import { TransactionType } from "../../shared/enums/transaction-type.enum.js";
import { ValidationError } from "../../shared/errors/validation.error.js";
import { assertPositiveInt, assertValidDate } from "../../utils/validators.js";
import { mapCategory } from "../category/category.service.js";
import type { CategorySummary, DashboardSummary } from "./dashboard.model.js";
import type { DashboardSummaryInput } from "./dtos/dashboard-summary.input.js";

const DEFAULT_CATEGORIES_LIMIT = 5;
const MAX_CATEGORIES_LIMIT = 20;

function currentMonthRange(now = new Date()): { startDate: Date; endDate: Date } {
  return {
    startDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    endDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)),
  };
}

function parseRange(input?: DashboardSummaryInput | null): { startDate: Date; endDate: Date } {
  const fallback = currentMonthRange();
  const startDate =
    input?.startDate === undefined || input?.startDate === null
      ? fallback.startDate
      : assertValidDate(input.startDate, "startDate");
  const endDate =
    input?.endDate === undefined || input?.endDate === null
      ? fallback.endDate
      : assertValidDate(input.endDate, "endDate");
  if (startDate > endDate) {
    throw new ValidationError('O campo "startDate" deve ser anterior a "endDate".', "startDate");
  }
  return { startDate, endDate };
}

function parseLimit(value: number | null | undefined): number {
  if (value === undefined || value === null) {
    return DEFAULT_CATEGORIES_LIMIT;
  }
  const limit = assertPositiveInt(value, "categoriesLimit");
  if (limit > MAX_CATEGORIES_LIMIT) {
    throw new ValidationError(
      `O campo "categoriesLimit" deve ser no maximo ${MAX_CATEGORIES_LIMIT}.`,
      "categoriesLimit",
    );
  }
  return limit;
}

/** Soma os valores agrupados por tipo: { INCOME: 1000, EXPENSE: 400 }. */
function sumByType(groups: { type: string; _sum: { amount: number | null } }[]) {
  const totals = { income: 0, expense: 0 };
  for (const group of groups) {
    const amount = group._sum.amount ?? 0;
    if (group.type === TransactionType.INCOME) totals.income += amount;
    if (group.type === TransactionType.EXPENSE) totals.expense += amount;
  }
  return totals;
}

export const dashboardService = {
  async summary(userId: string, input?: DashboardSummaryInput | null): Promise<DashboardSummary> {
    const { startDate, endDate } = parseRange(input);
    const limit = parseLimit(input?.categoriesLimit);
    const periodWhere = { userId, date: { gte: startDate, lte: endDate } };

    const [allTime, period, byCategoryAndType] = await Promise.all([
      prisma.transaction.groupBy({
        by: ["type"],
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["type"],
        where: periodWhere,
        _sum: { amount: true },
      }),
      prisma.transaction.groupBy({
        by: ["categoryId", "type"],
        where: { ...periodWhere, categoryId: { not: null } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
    ]);

    // Junta receitas e despesas de cada categoria.
    const totalsByCategory = new Map<string, { income: number; expense: number; count: number }>();
    for (const group of byCategoryAndType) {
      if (group.categoryId === null) continue;
      const totals = totalsByCategory.get(group.categoryId) ?? { income: 0, expense: 0, count: 0 };
      const amount = group._sum.amount ?? 0;
      if (group.type === TransactionType.INCOME) totals.income += amount;
      if (group.type === TransactionType.EXPENSE) totals.expense += amount;
      totals.count += group._count._all;
      totalsByCategory.set(group.categoryId, totals);
    }

    // Maior movimentacao primeiro, seja saldo positivo ou negativo.
    const ranked = [...totalsByCategory.entries()]
      .map(([categoryId, totals]) => ({
        categoryId,
        ...totals,
        net: totals.income - totals.expense,
      }))
      .sort((a, b) => Math.abs(b.net) - Math.abs(a.net) || b.count - a.count)
      .slice(0, limit);

    const categories = await prisma.category.findMany({
      where: { userId, id: { in: ranked.map((item) => item.categoryId) } },
    });
    const categoriesById = new Map(categories.map((category) => [category.id, category]));

    const topCategories: CategorySummary[] = [];
    for (const item of ranked) {
      const category = categoriesById.get(item.categoryId);
      if (!category) continue;
      topCategories.push({
        category: mapCategory(category),
        transactionCount: item.count,
        income: item.income,
        expense: item.expense,
        total: item.net,
      });
    }

    const allTimeTotals = sumByType(allTime);
    const periodTotals = sumByType(period);

    return {
      balance: allTimeTotals.income - allTimeTotals.expense,
      periodIncome: periodTotals.income,
      periodExpense: periodTotals.expense,
      topCategories,
    };
  },
};
