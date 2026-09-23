import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { type Context, createContext } from "./graphql/context.js";
import { createSchema } from "./graphql/schema.js";

function resolveCorsOrigin(): true | string[] {
  if (env.CORS_ORIGIN === "*") {
    return true;
  }
  return env.CORS_ORIGIN.split(",").map((origin) => origin.trim());
}

export async function startServer(): Promise<{ url: string }> {
  const schema = await createSchema();
  const apollo = new ApolloServer<Context>({ schema });
  await apollo.start();

  const app = express();

  app.use(
    "/graphql",
    cors({
      origin: resolveCorsOrigin(),
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
    express.json(),
    expressMiddleware(apollo, {
      context: async ({ req }) => createContext({ req }),
    }),
  );

  await new Promise<void>((resolve) => {
    app.listen(env.PORT, resolve);
  });

  return { url: `http://localhost:${env.PORT}/graphql` };
}
