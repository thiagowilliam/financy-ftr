import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CREATE_TRANSACTION,
  DELETE_TRANSACTION,
  TRANSACTIONS_PAGE,
  UPDATE_TRANSACTION,
} from "@/lib/graphql/queries/Transactions";
import type { Transaction, TransactionFilters, TransactionInput, TransactionPage } from "@/types";

export const TRANSACTIONS_PER_PAGE = 10;

/** Fábrica de query keys: filtros e página fazem parte da chave. */
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (filters: TransactionFilters, page: number, perPage: number) =>
    [...transactionKeys.lists(), { ...filters, page, perPage }] as const,
};

export const transactionsPageQueryOptions = (
  filters: TransactionFilters,
  page: number,
  perPage = TRANSACTIONS_PER_PAGE,
) =>
  queryOptions({
    queryKey: transactionKeys.list(filters, page, perPage),
    queryFn: async ({ signal }) => {
      const data = await graphqlRequest<
        { transactionsPage: TransactionPage },
        { filters: TransactionFilters; pagination: { page: number; perPage: number } }
      >(TRANSACTIONS_PAGE, { filters, pagination: { page, perPage } }, signal);
      return data.transactionsPage;
    },
    // Mantém a página anterior na tela enquanto a próxima carrega (sem "piscar" a tabela).
    placeholderData: keepPreviousData,
  });

export async function createTransaction(input: TransactionInput): Promise<Transaction> {
  const data = await graphqlRequest<{ createTransaction: Transaction }, { data: TransactionInput }>(
    CREATE_TRANSACTION,
    { data: input },
  );
  return data.createTransaction;
}

export async function updateTransaction({
  id,
  input,
}: {
  id: string;
  input: TransactionInput;
}): Promise<Transaction> {
  const data = await graphqlRequest<
    { updateTransaction: Transaction },
    { id: string; data: TransactionInput }
  >(UPDATE_TRANSACTION, { id, data: input });
  return data.updateTransaction;
}

export async function deleteTransaction(id: string): Promise<string> {
  await graphqlRequest<{ deleteTransaction: boolean }, { id: string }>(DELETE_TRANSACTION, { id });
  return id;
}
