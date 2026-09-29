import { Field, ID, InputType } from "type-graphql";
import { TransactionType } from "../../../shared/enums/transaction-type.enum.js";

@InputType()
export class ListTransactionsInput {
  @Field(() => String, {
    nullable: true,
    description: "Busca parcial na descricao da transacao.",
  })
  search?: string | null;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType | null;

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;

  @Field(() => Date, { nullable: true, description: "Data inicial do intervalo, inclusive." })
  startDate?: Date | null;

  @Field(() => Date, { nullable: true, description: "Data final do intervalo, inclusive." })
  endDate?: Date | null;
}
