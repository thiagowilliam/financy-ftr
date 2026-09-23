import { Field, ID, InputType, Int } from "type-graphql";
import { TransactionType } from "../../../shared/enums/transaction-type.enum.js";

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Int, { nullable: true, description: "Valor em CENTAVOS." })
  amount?: number | null;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType | null;

  @Field(() => Date, { nullable: true })
  date?: Date | null;

  @Field(() => ID, { nullable: true, description: "Envie null para remover a categoria." })
  categoryId?: string | null;
}
