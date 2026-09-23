import { Field, ID, InputType, Int } from "type-graphql";
import { TransactionType } from "../../../shared/enums/transaction-type.enum.js";

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  description!: string;

  @Field(() => Int, { description: "Valor em CENTAVOS, sempre inteiro positivo maior que zero." })
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => Date)
  date!: Date;

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;
}
