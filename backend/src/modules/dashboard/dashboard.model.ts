import { Field, Int, ObjectType } from "type-graphql";
import { Category } from "../category/category.model.js";

@ObjectType({ description: "Movimentacao de uma categoria no periodo. Valores em CENTAVOS." })
export class CategorySummary {
  @Field(() => Category)
  category!: Category;

  @Field(() => Int, { description: "Quantidade de transacoes (receitas e despesas) no periodo." })
  transactionCount!: number;

  @Field(() => Int, { description: "Soma das receitas." })
  income!: number;

  @Field(() => Int, { description: "Soma das despesas." })
  expense!: number;

  @Field(() => Int, { description: "Receitas menos despesas: negativo quando gastou mais." })
  total!: number;
}

@ObjectType({ description: "Resumo financeiro exibido no dashboard. Valores em CENTAVOS." })
export class DashboardSummary {
  @Field(() => Int, { description: "Receitas menos despesas de todo o historico." })
  balance!: number;

  @Field(() => Int, { description: "Receitas no periodo." })
  periodIncome!: number;

  @Field(() => Int, { description: "Despesas no periodo." })
  periodExpense!: number;

  @Field(() => [CategorySummary], {
    description: "Categorias com maior movimentacao no periodo, pelo valor absoluto do total.",
  })
  topCategories!: CategorySummary[];
}
