import { Field, InputType, Int } from "type-graphql";

@InputType()
export class DashboardSummaryInput {
  @Field(() => Date, {
    nullable: true,
    description: "Inicio do periodo, inclusive. Padrao: primeiro dia do mes atual (UTC).",
  })
  startDate?: Date | null;

  @Field(() => Date, {
    nullable: true,
    description: "Fim do periodo, inclusive. Padrao: ultimo instante do mes atual (UTC).",
  })
  endDate?: Date | null;

  @Field(() => Int, {
    nullable: true,
    description: "Quantidade de categorias no resumo (1 a 20). Padrao: 5.",
  })
  categoriesLimit?: number | null;
}
