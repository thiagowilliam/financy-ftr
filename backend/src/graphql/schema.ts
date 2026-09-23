import type { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { ErrorInterceptor } from "../middlewares/error-interceptor.middleware.js";
import { LoggerMiddleware } from "../middlewares/logger.middleware.js";
import { AuthResolver } from "../modules/auth/auth.resolver.js";
import { CategoryResolver } from "../modules/category/category.resolver.js";
import { TransactionResolver } from "../modules/transaction/transaction.resolver.js";
import { UserResolver } from "../modules/user/user.resolver.js";
import { authChecker } from "./auth-checker.js";

export async function createSchema(): Promise<GraphQLSchema> {
  return buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
    authChecker,
    globalMiddlewares: [ErrorInterceptor, LoggerMiddleware],
    // A validacao automatica exigiria class-validator, que nao faz parte do projeto.
    validate: false,
  });
}
