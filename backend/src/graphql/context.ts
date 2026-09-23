import type { PrismaClient } from "@prisma/client";
import type { Request } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyToken } from "../utils/jwt.js";

export interface Context {
  userId: string | null;
  prisma: PrismaClient;
}

const BEARER_PREFIX = "Bearer ";

export function createContext({ req }: { req: Request }): Context {
  const header = req.headers.authorization;
  let userId: string | null = null;

  if (typeof header === "string" && header.startsWith(BEARER_PREFIX)) {
    const token = header.slice(BEARER_PREFIX.length).trim();
    if (token !== "") {
      userId = verifyToken(token);
    }
  }

  return { userId, prisma };
}
