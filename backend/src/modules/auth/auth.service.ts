import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { ConflictError } from "../../shared/errors/conflict.error.js";
import { UnauthorizedError } from "../../shared/errors/unauthorized.error.js";
import { signToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { assertEmail, assertMinLength } from "../../utils/validators.js";
import { mapUser } from "../user/user.service.js";
import type { AuthPayload } from "./dtos/auth.payload.js";
import type { SignInInput } from "./dtos/sign-in.input.js";
import type { SignUpInput } from "./dtos/sign-up.input.js";

export const authService = {
  async signUp(input: SignUpInput): Promise<AuthPayload> {
    const name = assertMinLength(input.name, 2, "name");
    const email = assertEmail(input.email);
    const password = assertMinLength(input.password, 6, "password");

    try {
      const user = await prisma.user.create({
        data: { name, email, password: await hashPassword(password) },
      });

      return { token: signToken(user.id), user: mapUser(user) };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictError("Ja existe uma conta cadastrada com este e-mail.");
      }
      throw error;
    }
  },

  async signIn(input: SignInInput): Promise<AuthPayload> {
    const email = assertEmail(input.email);
    const password = assertMinLength(input.password, 6, "password");

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("Credenciais invalidas.");
    }

    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedError("Credenciais invalidas.");
    }

    return { token: signToken(user.id), user: mapUser(user) };
  },
};
