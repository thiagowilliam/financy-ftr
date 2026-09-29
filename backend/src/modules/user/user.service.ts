import { prisma } from "../../lib/prisma.js";
import { NotFoundError } from "../../shared/errors/not-found.error.js";
import { assertMinLength } from "../../utils/validators.js";
import type { UpdateProfileInput } from "./dtos/update-profile.input.js";
import type { User } from "./user.model.js";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

function mapUser(record: UserRecord): User {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const userService = {
  async findById(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("Usuario nao encontrado.");
    }
    return mapUser(user);
  },

  /** Atualiza os dados do perfil. O e-mail nao pode ser alterado. */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    const name = assertMinLength(input.name, 2, "name");
    const existing = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!existing) {
      throw new NotFoundError("Usuario nao encontrado.");
    }
    const user = await prisma.user.update({ where: { id: userId }, data: { name } });
    return mapUser(user);
  },
};

export { mapUser };
