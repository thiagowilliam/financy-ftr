import { existsSync } from "node:fs";

// Leitura de .env com o recurso nativo do Node, sem dotenv.
const ENV_FILE = ".env";
if (existsSync(ENV_FILE) && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(ENV_FILE);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `Variavel de ambiente obrigatoria ausente: ${name}. ` +
        "Copie .env.example para .env e preencha o valor.",
    );
  }
  return value.trim();
}

function optionalEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : fallback;
}

function parsePort(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(
      `A variavel PORT deve ser um numero inteiro positivo. Valor recebido: ${value}`,
    );
  }
  return parsed;
}

export const env = {
  JWT_SECRET: requireEnv("JWT_SECRET"),
  DATABASE_URL: requireEnv("DATABASE_URL"),
  PORT: parsePort(optionalEnv("PORT", "4000")),
  CORS_ORIGIN: optionalEnv("CORS_ORIGIN", "*"),
} as const;
