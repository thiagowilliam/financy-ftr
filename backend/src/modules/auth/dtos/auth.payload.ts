import { Field, ObjectType } from "type-graphql";
import { User } from "../../user/user.model.js";

@ObjectType({ description: "Token JWT e usuario autenticado." })
export class AuthPayload {
  @Field(() => String, { description: "JWT valido por 7 dias." })
  token!: string;

  @Field(() => User)
  user!: User;
}
