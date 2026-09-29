import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import type { Context } from "../../graphql/context.js";
import { requireUserId } from "../../utils/require-user-id.js";
import { UpdateProfileInput } from "./dtos/update-profile.input.js";
import { User } from "./user.model.js";
import { userService } from "./user.service.js";

@Resolver(() => User)
export class UserResolver {
  @Authorized()
  @Query(() => User, { description: "Retorna o usuario autenticado." })
  async me(@Ctx() ctx: Context): Promise<User> {
    return userService.findById(requireUserId(ctx));
  }

  @Authorized()
  @Mutation(() => User, { description: "Atualiza o nome do usuario autenticado." })
  async updateProfile(
    @Arg("data", () => UpdateProfileInput) data: UpdateProfileInput,
    @Ctx() ctx: Context,
  ): Promise<User> {
    return userService.updateProfile(requireUserId(ctx), data);
  }
}
