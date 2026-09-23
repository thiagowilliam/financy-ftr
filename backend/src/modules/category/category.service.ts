import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import {
  TRANSACTION_TYPES,
  type TransactionType,
  toTransactionType,
} from "../../shared/enums/transaction-type.enum.js";
import { ConflictError } from "../../shared/errors/conflict.error.js";
import { NotFoundError } from "../../shared/errors/not-found.error.js";
import {
  assertEnumValue,
  assertHexColor,
  assertMinLength,
  assertRequiredString,
} from "../../utils/validators.js";
import type { Category } from "./category.model.js";
import type { CreateCategoryInput } from "./dtos/create-category.input.js";
import type { UpdateCategoryInput } from "./dtos/update-category.input.js";

interface CategoryRecord {
  id: string;
  name: string;
  type: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function mapCategory(record: CategoryRecord): Category {
  return {
    id: record.id,
    name: record.name,
    type: toTransactionType(record.type),
    color: record.color,
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

function resolveName(value: string | null | undefined, current: string): string {
  if (value === undefined || value === null) {
    return current;
  }
  return assertMinLength(value, 2, "name");
}

function resolveType(
  value: TransactionType | null | undefined,
  current: string,
): TransactionType {
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
    const type = parseType(input.type);
    const color =
      input.color === undefined || input.color === null ? null : assertHexColor(input.color);

    try {
      const created = await prisma.category.create({ data: { name, type, color, userId } });
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
    const type = resolveType(input.type, existing.type);
    const color = resolveColor(input.color, existing.color);

    try {
      const updated = await prisma.category.update({
        where: { id: existing.id },
        data: { name, type, color },
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
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
    return categories.map(mapCategory);
  },

  async findById(userId: string, id: string): Promise<Category> {
    const categoryId = assertRequiredString(id, "id");
    const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
    if (!category) {
      throw new NotFoundError("Categoria nao encontrada.");
    }
    return mapCategory(category);
  },
};
