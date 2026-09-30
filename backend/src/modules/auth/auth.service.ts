import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ConflictError } from "../../shared/errors/conflict.error.js";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error.js";
import { signToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { RateLimiter } from "../../utils/rate-limiter.js";
import { assertEmail, assertMinLength, assertRequiredString } from "../../utils/validators.js";
import { DEFAULT_CATEGORIES } from "../category/default-categories.js";
import { mapUser } from "../user/user.service.js";
import type { AuthPayload } from "./dtos/auth.payload.js";
import type { SignInInput } from "./dtos/sign-in.input.js";
import type { SignUpInput } from "./dtos/sign-up.input.js";

/** Mesmo minimo exigido pela tela de cadastro do frontend. */
const PASSWORD_MIN_LENGTH = 8;

/** 5 falhas de login por IP + e-mail a cada 15 minutos. */
const loginRateLimiter = new RateLimiter({ maxAttempts: 5, windowMs: 15 * 60_000 });

export const authService = {
  async signUp(input: SignUpInput): Promise<AuthPayload> {
    const name = assertMinLength(input.name, 2, "name");
    const email = assertEmail(input.email);
    const password = assertMinLength(input.password, PASSWORD_MIN_LENGTH, "password");

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: await hashPassword(password),
          // Todo usuario novo ja comeca com as categorias padrao.
          categories: { create: [...DEFAULT_CATEGORIES] },
        },
      });

      return { token: signToken(user.id), user: mapUser(user) };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("Ja existe uma conta cadastrada com este e-mail.");
      }
      throw error;
    }
  },

  async signIn(input: SignInInput, ip: string | null = null): Promise<AuthPayload> {
    const email = assertEmail(input.email);
    // No login so exige a senha: validar o tamanho aqui revelaria a regra de cadastro.
    const password = assertRequiredString(input.password, "password");

    const limiterKey = `${ip ?? "unknown"}:${email}`;
    loginRateLimiter.assertAllowed(limiterKey);

    const user = await prisma.user.findUnique({ where: { email } });
    const passwordMatches = user ? await comparePassword(password, user.password) : false;
    if (!user || !passwordMatches) {
      loginRateLimiter.registerFailure(limiterKey);
      throw new UnauthorizedError("Credenciais invalidas.");
    }

    loginRateLimiter.reset(limiterKey);
    return { token: signToken(user.id), user: mapUser(user) };
  },
};
