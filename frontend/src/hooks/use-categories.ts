import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoriesQueryOptions,
  categoryKeys,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/api/categories";
import type { Category } from "@/types";

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
      return queryClient.invalidateQueries({ queryKey: categoryKeys.all });
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
      return queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
