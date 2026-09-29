import { Field, InputType, Int } from "type-graphql";

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, description: "Pagina atual, comecando em 1. Padrao: 1." })
  page?: number | null;

  @Field(() => Int, { nullable: true, description: "Itens por pagina (1 a 100). Padrao: 10." })
  perPage?: number | null;
}
