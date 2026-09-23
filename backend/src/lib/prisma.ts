import { PrismaClient } from "@prisma/client";

// Instancia unica compartilhada por toda a aplicacao.
export const prisma = new PrismaClient();
