import { queryOptions } from "@tanstack/react-query";
import { graphqlRequest } from "@/lib/graphql/client";
import { ME, UPDATE_PROFILE } from "@/lib/graphql/queries/User";
import type { User } from "@/types";

/** Fábrica de query keys do usuário logado. */
export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export const meQueryOptions = () =>
  queryOptions({
    queryKey: userKeys.me(),
    queryFn: async ({ signal }) => {
      const data = await graphqlRequest<{ me: User }>(ME, undefined, signal);
      return data.me;
    },
  });

export async function updateProfile(input: { name: string }): Promise<User> {
  const data = await graphqlRequest<{ updateProfile: User }, { data: { name: string } }>(
    UPDATE_PROFILE,
    { data: input },
  );
  return data.updateProfile;
}
