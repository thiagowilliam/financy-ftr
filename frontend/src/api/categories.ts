import { queryOptions } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  CATEGORIES,
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "@/lib/graphql/queries/Categories";
import type { Category, CategoryInput } from "@/types";

/** Fábrica de query keys: centraliza as chaves usadas em cache e invalidação. */
export const categoryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryKeys.all, "list"] as const,
};

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: categoryKeys.list(),
    queryFn: async ({ signal }) => {
      const data = await graphqlRequest<{ categories: Category[] }>(CATEGORIES, undefined, signal);
      return data.categories;
    },
  });

export async function createCategory(input: CategoryInput): Promise<Category> {
  const data = await graphqlRequest<{ createCategory: Category }, { data: CategoryInput }>(
    CREATE_CATEGORY,
    { data: input },
  );
  return data.createCategory;
}

export async function updateCategory({
  id,
  input,
}: {
  id: string;
  input: CategoryInput;
}): Promise<Category> {
  const data = await graphqlRequest<
    { updateCategory: Category },
    { id: string; data: CategoryInput }
  >(UPDATE_CATEGORY, { id, data: input });
  return data.updateCategory;
}

export async function deleteCategory(id: string): Promise<string> {
  await graphqlRequest<{ deleteCategory: boolean }, { id: string }>(DELETE_CATEGORY, { id });
  return id;
}
