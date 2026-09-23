import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import {
  TRANSACTION_TYPES,
  type TransactionType,
  toTransactionType,
} from "../../shared/enums/transaction-type.enum.js";
import { NotFoundError } from "../../shared/errors/not-found.error.js";
import { ValidationError } from "../../shared/errors/validation.error.js";
import {
  assertEnumValue,
  assertMinLength,
  assertPositiveInt,
  assertRequiredString,
  assertValidDate,
} from "../../utils/validators.js";
import { mapCategory } from "../category/category.service.js";
import type { CreateTransactionInput } from "./dtos/create-transaction.input.js";
import type { ListTransactionsInput } from "./dtos/list-transactions.input.js";
import type { UpdateTransactionInput } from "./dtos/update-transaction.input.js";
import type { Transaction } from "./transaction.model.js";

interface CategoryRecord {
  id: string;
  name: string;
  type: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionRecord {
  id: string;
  description: string;
  amount: number;
  type: string;
  date: Date;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: CategoryRecord | null;
}

function mapTransaction(record: TransactionRecord): Transaction {
  return {
    id: record.id,
    description: record.description,
    amount: record.amount,
    type: toTransactionType(record.type),
    date: record.date,
    categoryId: record.categoryId,
    category: record.category ? mapCategory(record.category) : null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function parseType(value: unknown, field = "type"): TransactionType {
  return toTransactionType(assertEnumValue(TRANSACTION_TYPES, value, field), field);
}

/**
 * Garante que a categoria pertence ao usuario e que o tipo da transacao
 * e igual ao tipo da categoria.
 */
async function assertCategoryMatches(
  userId: string,
  categoryId: string,
  type: TransactionType,
): Promise<void> {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    throw new NotFoundError("Categoria nao encontrada.");
  }
  if (toTransactionType(category.type) !== type) {
    throw new ValidationError(
      `O tipo da transacao (${type}) deve ser igual ao tipo da categoria ` +
        `"${category.name}" (${category.type}).`,
      "type",
    );
  }
}

export const transactionService = {
  async create(userId: string, input: CreateTransactionInput): Promise<Transaction> {
    const description = assertMinLength(input.description, 2, "description");
    const amount = assertPositiveInt(input.amount, "amount");
    const type = parseType(input.type);
    const date = assertValidDate(input.date, "date");
    const categoryId =
      input.categoryId === undefined || input.categoryId === null
        ? null
        : assertRequiredString(input.categoryId, "categoryId");

    if (categoryId !== null) {
      await assertCategoryMatches(userId, categoryId, type);
    }

    const created = await prisma.transaction.create({
      data: { description, amount, type, date, categoryId, userId },
      include: { category: true },
    });

    return mapTransaction(created);
  },

  async update(userId: string, id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const transactionId = assertRequiredString(id, "id");
    const existing = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });
    if (!existing) {
      throw new NotFoundError("Transacao nao encontrada.");
    }

    const description = resolveDescription(input.description, existing.description);
    const amount = resolveAmount(input.amount, existing.amount);
    const type = resolveType(input.type, existing.type);
    const date = resolveDate(input.date, existing.date);
    const categoryId = resolveCategoryId(input.categoryId, existing.categoryId);

    if (categoryId !== null) {
      await assertCategoryMatches(userId, categoryId, type);
    }

    const updated = await prisma.transaction.update({
      where: { id: existing.id },
      data: { description, amount, type, date, categoryId },
      include: { category: true },
    });

    return mapTransaction(updated);
  },

  async delete(userId: string, id: string): Promise<boolean> {
    const transactionId = assertRequiredString(id, "id");
    const existing = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });
    if (!existing) {
      throw new NotFoundError("Transacao nao encontrada.");
    }

    await prisma.transaction.delete({ where: { id: existing.id } });
    return true;
  },

  async list(userId: string, filters?: ListTransactionsInput | null): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = { userId };

    if (filters?.type !== undefined && filters?.type !== null) {
      where.type = parseType(filters.type);
    }

    if (filters?.categoryId !== undefined && filters?.categoryId !== null) {
      where.categoryId = assertRequiredString(filters.categoryId, "categoryId");
    }

    const dateFilter: Prisma.DateTimeFilter = {};
    if (filters?.startDate !== undefined && filters?.startDate !== null) {
      dateFilter.gte = assertValidDate(filters.startDate, "startDate");
    }
    if (filters?.endDate !== undefined && filters?.endDate !== null) {
      dateFilter.lte = assertValidDate(filters.endDate, "endDate");
    }
    if (dateFilter.gte !== undefined || dateFilter.lte !== undefined) {
      where.date = dateFilter;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return transactions.map(mapTransaction);
  },

  async findById(userId: string, id: string): Promise<Transaction> {
    const transactionId = assertRequiredString(id, "id");
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
      include: { category: true },
    });
    if (!transaction) {
      throw new NotFoundError("Transacao nao encontrada.");
    }
    return mapTransaction(transaction);
  },
};

function resolveDescription(value: string | null | undefined, current: string): string {
  if (value === undefined || value === null) {
    return current;
  }
  return assertMinLength(value, 2, "description");
}

function resolveAmount(value: number | null | undefined, current: number): number {
  if (value === undefined || value === null) {
    return current;
  }
  return assertPositiveInt(value, "amount");
}

function resolveType(value: TransactionType | null | undefined, current: string): TransactionType {
  if (value === undefined || value === null) {
    return toTransactionType(current);
  }
  return parseType(value);
}

function resolveDate(value: Date | null | undefined, current: Date): Date {
  if (value === undefined || value === null) {
    return current;
  }
  return assertValidDate(value, "date");
}

function resolveCategoryId(
  value: string | null | undefined,
  current: string | null,
): string | null {
  if (value === undefined) {
    return current;
  }
  if (value === null) {
    return null;
  }
  return assertRequiredString(value, "categoryId");
}
