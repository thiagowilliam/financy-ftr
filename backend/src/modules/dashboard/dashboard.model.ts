import { Field, Int, ObjectType } from "type-graphql";
import { Category } from "../category/category.model.js";

@ObjectType({ description: "Total de despesas de uma categoria no periodo." })
export class CategorySpending {
  @Field(() => Category)
  category!: Category;

  @Field(() => Int, { description: "Quantidade de despesas da categoria no periodo." })
  transactionCount!: number;

  @Field(() => Int, { description: "Soma das despesas em CENTAVOS." })
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

  @Field(() => [CategorySpending], {
    description: "Categorias com mais despesas no periodo, da maior para a menor.",
  })
  topExpenseCategories!: CategorySpending[];
}
