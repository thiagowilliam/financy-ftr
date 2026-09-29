import { useAuthStore } from "@/stores/auth";
import { GraphQLRequestError } from "./errors";

export { GraphQLRequestError, getErrorMessage } from "./errors";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/graphql";

type GraphQLErrorPayload = {
  message: string;
  extensions?: { code?: string; field?: string };
};

type GraphQLResponse<TData> = {
  data?: TData | null;
  errors?: GraphQLErrorPayload[];
};

/**
 * Executa uma operação GraphQL enviando o token do usuário autenticado.
 * Usada como `queryFn`/`mutationFn` do React Query.
 */
export async function graphqlRequest<TData, TVariables = Record<string, never>>(
  query: string,
  variables?: TVariables,
  signal?: AbortSignal,
): Promise<TData> {
  const token = useAuthStore.getState().token;

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ query, variables }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new GraphQLRequestError("Não foi possível conectar ao servidor.", "NETWORK_ERROR");
  }

  const body = (await response.json().catch(() => null)) as GraphQLResponse<TData> | null;
  const [firstError] = body?.errors ?? [];

  if (firstError) {
    if (firstError.extensions?.code === "UNAUTHENTICATED") {
      useAuthStore.getState().logout();
    }
    throw new GraphQLRequestError(
      firstError.message,
      firstError.extensions?.code,
      firstError.extensions?.field,
    );
  }

  if (!response.ok || !body?.data) {
    throw new GraphQLRequestError("Resposta inválida do servidor.", "BAD_RESPONSE");
  }

  return body.data;
}
