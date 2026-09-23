import { Arg, Authorized, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import type { Context } from "../../graphql/context.js";
import { requireUserId } from "../../utils/require-user-id.js";
import { CreateTransactionInput } from "./dtos/create-transaction.input.js";
import { ListTransactionsInput } from "./dtos/list-transactions.input.js";
import { UpdateTransactionInput } from "./dtos/update-transaction.input.js";
import { Transaction } from "./transaction.model.js";
import { transactionService } from "./transaction.service.js";

@Authorized()
@Resolver(() => Transaction)
export class TransactionResolver {
  @Query(() => [Transaction], {
    description: "Lista as transacoes do usuario com filtros opcionais.",
  })
  async transactions(
    @Ctx() ctx: Context,
    @Arg("filters", () => ListTransactionsInput, { nullable: true })
    filters?: ListTransactionsInput | null,
  ): Promise<Transaction[]> {
    return transactionService.list(requireUserId(ctx), filters);
  }

  @Query(() => Transaction, { description: "Busca uma transacao do usuario pelo id." })
  async transaction(@Arg("id", () => ID) id: string, @Ctx() ctx: Context): Promise<Transaction> {
    return transactionService.findById(requireUserId(ctx), id);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Arg("data", () => CreateTransactionInput) data: CreateTransactionInput,
    @Ctx() ctx: Context,
  ): Promise<Transaction> {
    return transactionService.create(requireUserId(ctx), data);
  }

  @Mutation(() => Transaction)
  async updateTransaction(
    @Arg("id", () => ID) id: string,
    @Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
    @Ctx() ctx: Context,
  ): Promise<Transaction> {
    return transactionService.update(requireUserId(ctx), id, data);
  }

  @Mutation(() => Boolean)
  async deleteTransaction(@Arg("id", () => ID) id: string, @Ctx() ctx: Context): Promise<boolean> {
    return transactionService.delete(requireUserId(ctx), id);
  }
}
