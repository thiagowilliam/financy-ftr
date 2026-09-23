// "reflect-metadata" precisa ser avaliado antes de qualquer modulo com decorator.
// A organizacao automatica de imports do Biome esta desligada para este arquivo
// atraves de um override em biome.json, para preservar esta ordem.
import "reflect-metadata";
import { startServer } from "./server.js";

startServer()
  .then(({ url }) => {
    console.log(`Servidor GraphQL disponivel em ${url}`);
  })
  .catch((error: unknown) => {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
  });
