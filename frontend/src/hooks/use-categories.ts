import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoriesQueryOptions,
  categoryKeys,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/api/categories";
import { dashboardKeys } from "@/api/dashboard";
import { transactionKeys } from "@/api/transactions";
import type { Category } from "@/types";

/**
 * Editar ou excluir uma categoria muda o que as transações e o dashboard exibem
 * (nome, cor, ícone ou "Sem categoria"), então esses caches também são invalidados.
 */
function invalidateCategoryDependents(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
    queryClient.invalidateQueries({ queryKey: transactionKeys.all }),
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  ]);
}

const byName = (a: Category, b: Category) => a.name.localeCompare(b.name, "pt-BR");

export function useCategories() {
  return useQuery({
    ...categoriesQueryOptions(),
    select: (categories) => [...categories].sort(byName),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (created) => {
      // Atualiza o cache na hora e revalida em segundo plano.
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old) =>
        old ? [...old, created] : old,
      );
      return queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (updated) => {
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old) =>
        old?.map((category) => (category.id === updated.id ? updated : category)),
      );
      return invalidateCategoryDependents(queryClient);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old) =>
        old?.filter((category) => category.id !== deletedId),
      );
      return invalidateCategoryDependents(queryClient);
    },
  });
}
