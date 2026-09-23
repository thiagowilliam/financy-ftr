import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import type { Context } from "../../graphql/context.js";
import { requireUserId } from "../../utils/require-user-id.js";
import { User } from "./user.model.js";
import { userService } from "./user.service.js";

@Resolver(() => User)
export class UserResolver {
  @Authorized()
  @Query(() => User, { description: "Retorna o usuario autenticado." })
  async me(@Ctx() ctx: Context): Promise<User> {
    return userService.findById(requireUserId(ctx));
  }
}
