import { Prisma } from "@prisma/client";
import type { MiddlewareFn } from "type-graphql";
import type { Context } from "../graphql/context.js";
import { AppError } from "../shared/errors/app-error.js";
import { ConflictError } from "../shared/errors/conflict.error.js";
import { NotFoundError } from "../shared/errors/not-found.error.js";
import { UnauthorizedError } from "../shared/errors/unauthorized.error.js";

function isAuthorizationError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "UnauthorizedError" || error.message.includes("Access denied"))
  );
}

export const ErrorInterceptor: MiddlewareFn<Context> = async (_data, next) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (isAuthorizationError(error)) {
      throw new UnauthorizedError();
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new ConflictError("Ja existe um registro com esses dados.");
      }
      if (error.code === "P2025") {
        throw new NotFoundError();
      }
    }

    console.error("[erro inesperado]", error);
    throw new AppError("Erro interno no servidor.", "INTERNAL_SERVER_ERROR");
  }
};
