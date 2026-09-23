import { Arg, Mutation, Resolver } from "type-graphql";
import { authService } from "./auth.service.js";
import { AuthPayload } from "./dtos/auth.payload.js";
import { SignInInput } from "./dtos/sign-in.input.js";
import { SignUpInput } from "./dtos/sign-up.input.js";

@Resolver(() => AuthPayload)
export class AuthResolver {
  @Mutation(() => AuthPayload, { description: "Cria uma conta e devolve o token." })
  async signUp(@Arg("data", () => SignUpInput) data: SignUpInput): Promise<AuthPayload> {
    return authService.signUp(data);
  }

  @Mutation(() => AuthPayload, { description: "Autentica e devolve o token." })
  async signIn(@Arg("data", () => SignInInput) data: SignInInput): Promise<AuthPayload> {
    return authService.signIn(data);
  }
}
