import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import {
  TRANSACTION_TYPES,
  type TransactionType,
  toTransactionType,
} from "../../shared/enums/transaction-type.enum.js";
import { ConflictError } from "../../shared/errors/conflict.error.js";
import { NotFoundError } from "../../shared/errors/not-found.error.js";
import { ValidationError } from "../../shared/errors/validation.error.js";
import {
  assertEnumValue,
  assertHexColor,
  assertMinLength,
  assertRequiredString,
} from "../../utils/validators.js";
import type { Category } from "./category.model.js";
import type { CreateCategoryInput } from "./dtos/create-category.input.js";
import type { UpdateCategoryInput } from "./dtos/update-category.input.js";

export interface CategoryRecord {
  id: string;
  name: string;
  description: string | null;
  type: string;
  icon: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { transactions: number };
}

const DESCRIPTION_MAX_LENGTH = 120;
const ICON_MAX_LENGTH = 40;

/** Inclui a contagem de transacoes nas consultas de categoria. */
const withTransactionCount = { _count: { select: { transactions: true } } } as const;

export function mapCategory(record: CategoryRecord): Category {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    type: toTransactionType(record.type),
    icon: record.icon,
    color: record.color,
    transactionCount: record._count?.transactions,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function parseType(value: unknown, field = "type"): TransactionType {
  return toTransactionType(assertEnumValue(TRANSACTION_TYPES, value, field), field);
}

function handleUniqueViolation(error: unknown, name: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new ConflictError(`Voce ja possui uma categoria chamada "${name}".`);
  }
  throw error;
}

/** Compara nomes ignorando espacos nas pontas e maiusculas/minusculas. */
function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase("pt-BR");
}

/**
 * O indice unico [userId, name] do SQLite diferencia maiusculas de minusculas,
 * entao "Mercado" e "mercado" passariam. Esta checagem fecha essa brecha.
 */
async function assertUniqueName(userId: string, name: string, ignoreId?: string): Promise<void> {
  const categories = await prisma.category.findMany({
    where: { userId },
    select: { id: true, name: true },
  });
  const normalized = normalizeName(name);
  const duplicate = categories.find(
    (category) => category.id !== ignoreId && normalizeName(category.name) === normalized,
  );
  if (duplicate) {
    throw new ConflictError(`Voce ja possui uma categoria chamada "${duplicate.name}".`);
  }
}

/** Texto opcional: vazio vira null e o tamanho maximo e validado. */
function parseOptionalText(value: string | null | undefined, max: number, field: string) {
  if (value === undefined || value === null || value.trim() === "") {
    return null;
  }
  const parsed = value.trim();
  if (parsed.length > max) {
    throw new ValidationError(`O campo "${field}" deve ter no maximo ${max} caracteres.`, field);
  }
  return parsed;
}

function resolveOptionalText(
  value: string | null | undefined,
  current: string | null,
  max: number,
  field: string,
): string | null {
  if (value === undefined) {
    return current;
  }
  return parseOptionalText(value, max, field);
}

function resolveName(value: string | null | undefined, current: string): string {
  if (value === undefined || value === null) {
    return current;
  }
  return assertMinLength(value, 2, "name");
}

function resolveType(value: TransactionType | null | undefined, current: string): TransactionType {
  if (value === undefined || value === null) {
    return toTransactionType(current);
  }
  return parseType(value);
}

function resolveColor(value: string | null | undefined, current: string | null): string | null {
  if (value === undefined) {
    return current;
  }
  if (value === null) {
    return null;
  }
  return assertHexColor(value);
}

export const categoryService = {
  async create(userId: string, input: CreateCategoryInput): Promise<Category> {
    const name = assertMinLength(input.name, 2, "name");
    const description = parseOptionalText(input.description, DESCRIPTION_MAX_LENGTH, "description");
    const type = parseType(input.type);
    const icon = parseOptionalText(input.icon, ICON_MAX_LENGTH, "icon");
    const color =
      input.color === undefined || input.color === null ? null : assertHexColor(input.color);

    await assertUniqueName(userId, name);

    try {
      const created = await prisma.category.create({
        data: { name, description, type, icon, color, userId },
        include: withTransactionCount,
      });
      return mapCategory(created);
    } catch (error) {
      handleUniqueViolation(error, name);
    }
  },

  async update(userId: string, id: string, input: UpdateCategoryInput): Promise<Category> {
    const categoryId = assertRequiredString(id, "id");
    const existing = await prisma.category.findFirst({ where: { id: categoryId, userId } });
    if (!existing) {
      throw new NotFoundError("Categoria nao encontrada.");
    }

    const name = resolveName(input.name, existing.name);
    const description = resolveOptionalText(
      input.description,
      existing.description,
      DESCRIPTION_MAX_LENGTH,
      "description",
    );
    const type = resolveType(input.type, existing.type);
    const icon = resolveOptionalText(input.icon, existing.icon, ICON_MAX_LENGTH, "icon");
    const color = resolveColor(input.color, existing.color);

    if (normalizeName(name) !== normalizeName(existing.name)) {
      await assertUniqueName(userId, name, existing.id);
    }

    try {
      const updated = await prisma.category.update({
        where: { id: existing.id },
        data: { name, description, type, icon, color },
        include: withTransactionCount,
      });
      return mapCategory(updated);
    } catch (error) {
      handleUniqueViolation(error, name);
    }
  },

  async delete(userId: string, id: string): Promise<boolean> {
    const categoryId = assertRequiredString(id, "id");
    const existing = await prisma.category.findFirst({ where: { id: categoryId, userId } });
    if (!existing) {
      throw new NotFoundError("Categoria nao encontrada.");
    }

    // As transacoes sao preservadas: a relacao usa onDelete SetNull.
    await prisma.category.delete({ where: { id: existing.id } });
    return true;
  },

  async list(userId: string): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: { userId },
      include: withTransactionCount,
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    return categories.map(mapCategory);
  },

  async findById(userId: string, id: string): Promise<Category> {
    const categoryId = assertRequiredString(id, "id");
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
      include: withTransactionCount,
    });
    if (!category) {
      throw new NotFoundError("Categoria nao encontrada.");
    }
    return mapCategory(category);
  },

  async countTransactions(categoryId: string): Promise<number> {
    return prisma.transaction.count({ where: { categoryId } });
  },
};
