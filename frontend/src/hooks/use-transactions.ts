import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryKeys } from "@/api/categories";
import {
  createTransaction,
  deleteTransaction,
  transactionKeys,
  transactionsPageQueryOptions,
  updateTransaction,
} from "@/api/transactions";
import type { TransactionFilters } from "@/types";

export function useTransactionsPage(filters: TransactionFilters, page: number) {
  return useQuery(transactionsPageQueryOptions(filters, page));
}

/**
 * Toda alteração em transações muda a paginação/filtros e a contagem de
 * transações exibida nas categorias, então invalidamos os dois grupos.
 */
function useInvalidateTransactions() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: transactionKeys.all }),
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
    ]);
}

export function useCreateTransaction() {
  const invalidate = useInvalidateTransactions();
  return useMutation({ mutationFn: createTransaction, onSuccess: invalidate });
}

export function useUpdateTransaction() {
  const invalidate = useInvalidateTransactions();
  return useMutation({ mutationFn: updateTransaction, onSuccess: invalidate });
}

export function useDeleteTransaction() {
  const invalidate = useInvalidateTransactions();
  return useMutation({ mutationFn: deleteTransaction, onSuccess: invalidate });
}
