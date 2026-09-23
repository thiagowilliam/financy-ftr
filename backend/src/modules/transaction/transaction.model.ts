import { Field, ID, Int, ObjectType } from "type-graphql";
import { TransactionType } from "../../shared/enums/transaction-type.enum.js";
import { Category } from "../category/category.model.js";

@ObjectType({ description: "Movimentacao financeira do usuario." })
export class Transaction {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  description!: string;

  /** Valor em CENTAVOS: 1500 equivale a R$ 15,00. */
  @Field(() => Int, { description: "Valor em CENTAVOS, sempre inteiro positivo maior que zero." })
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => Date)
  date!: Date;

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;

  @Field(() => Category, { nullable: true })
  category?: Category | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
