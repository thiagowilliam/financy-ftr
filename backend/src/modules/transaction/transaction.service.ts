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
import { type CategoryRecord, mapCategory } from "../category/category.service.js";
import type { CreateTransactionInput } from "./dtos/create-transaction.input.js";
import type { ListTransactionsInput } from "./dtos/list-transactions.input.js";
import type { PaginationInput } from "./dtos/pagination.input.js";
import type { UpdateTransactionInput } from "./dtos/update-transaction.input.js";
import type { Transaction } from "./transaction.model.js";
import type { TransactionPage } from "./transaction-page.model.js";

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

/** Garante que a categoria existe e pertence ao usuario. */
async function assertCategoryBelongsToUser(userId: string, categoryId: string): Promise<void> {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });
  if (!category) {
    throw new NotFoundError("Categoria nao encontrada.");
  }
}

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

function parsePage(value: number | null | undefined): number {
  if (value === undefined || value === null) {
    return DEFAULT_PAGE;
  }
  return assertPositiveInt(value, "page");
}

function parsePerPage(value: number | null | undefined): number {
  if (value === undefined || value === null) {
    return DEFAULT_PER_PAGE;
  }
  const perPage = assertPositiveInt(value, "perPage");
  if (perPage > MAX_PER_PAGE) {
    throw new ValidationError(`O campo "perPage" deve ser no maximo ${MAX_PER_PAGE}.`, "perPage");
  }
  return perPage;
}

function buildWhere(
  userId: string,
  filters?: ListTransactionsInput | null,
): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = { userId };

  const search = filters?.search?.trim();
  if (search) {
    // No SQLite o "contains" (LIKE) ignora maiusculas/minusculas apenas em ASCII.
    where.description = { contains: search };
  }

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

  return where;
}

const TRANSACTION_ORDER: Prisma.TransactionOrderByWithRelationInput[] = [
  { date: "desc" },
  { createdAt: "desc" },
];

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
      await assertCategoryBelongsToUser(userId, categoryId);
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
      await assertCategoryBelongsToUser(userId, categoryId);
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

  async listPage(
    userId: string,
    filters?: ListTransactionsInput | null,
    pagination?: PaginationInput | null,
  ): Promise<TransactionPage> {
    const page = parsePage(pagination?.page);
    const perPage = parsePerPage(pagination?.perPage);
    const where = buildWhere(userId, filters);

    const [total, transactions] = await prisma.$transaction([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: TRANSACTION_ORDER,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return {
      items: transactions.map(mapTransaction),
      total,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
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
