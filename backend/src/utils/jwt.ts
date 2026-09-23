import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const EXPIRES_IN = "7d";

/** O payload carrega apenas o "sub" com o id do usuario. */
export function signToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, { subject: userId, expiresIn: EXPIRES_IN });
}

/** Retorna o id do usuario ou null quando o token e ausente, invalido ou expirado. */
export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === "string") {
      return null;
    }
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
