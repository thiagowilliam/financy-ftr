import type { Context } from "../graphql/context.js";
import { UnauthorizedError } from "../shared/errors/unauthorized.error.js";

/**
 * Narrowing explicito do userId do contexto, evitando "!" e casts nos resolvers.
 */
export function requireUserId(ctx: Context): string {
  const { userId } = ctx;
  if (userId === null) {
    throw new UnauthorizedError();
  }
  return userId;
}
