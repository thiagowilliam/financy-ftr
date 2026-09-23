import { GraphQLError } from "graphql";

export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_USER_INPUT"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends GraphQLError {
  constructor(message: string, code: AppErrorCode, extensions: Record<string, unknown> = {}) {
    super(message, { extensions: { code, ...extensions } });
    this.name = "AppError";
  }
}
