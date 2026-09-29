import { Field, Int, ObjectType } from "type-graphql";
import { Transaction } from "./transaction.model.js";

@ObjectType({ description: "Pagina de transacoes com os totais para a paginacao." })
export class TransactionPage {
  @Field(() => [Transaction])
  items!: Transaction[];

  @Field(() => Int, { description: "Total de transacoes que atendem aos filtros." })
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  perPage!: number;

  @Field(() => Int)
  totalPages!: number;
}
