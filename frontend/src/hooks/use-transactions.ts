import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryKeys } from "@/api/categories";
import { dashboardKeys } from "@/api/dashboard";
import {
  createTransaction,
  deleteTransaction,
  transactionKeys,
  transactionsPageQueryOptions,
  updateTransaction,
} from "@/api/transactions";
import type { TransactionFilters } from "@/types";

export function useTransactionsPage(filters: TransactionFilters, page: number, perPage?: number) {
  return useQuery(transactionsPageQueryOptions(filters, page, perPage));
}

/**
 * Toda alteração em transações muda a paginação/filtros, a contagem de
 * transações das categorias e os totais do dashboard.
 */
function useInvalidateTransactions() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: transactionKeys.all }),
      queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
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
