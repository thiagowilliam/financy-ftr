import type { MiddlewareFn } from "type-graphql";
import type { Context } from "../graphql/context.js";

export const LoggerMiddleware: MiddlewareFn<Context> = async ({ info, context }, next) => {
  const startedAt = Date.now();
  const result = await next();
  const elapsed = Date.now() - startedAt;
  const actor = context.userId ?? "anonimo";
  console.log(`[graphql] ${info.parentType.name}.${info.fieldName} usuario=${actor} ${elapsed}ms`);
  return result;
};
