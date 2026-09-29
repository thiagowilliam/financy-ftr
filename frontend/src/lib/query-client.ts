import { QueryClient } from "@tanstack/react-query";
import { GraphQLRequestError } from "@/lib/graphql/errors";

// Erros de negócio (validação, conflito, não encontrado, sem sessão) não mudam ao repetir.
const NON_RETRYABLE_CODES = new Set([
  "BAD_USER_INPUT",
  "CONFLICT",
  "NOT_FOUND",
  "UNAUTHENTICATED",
  "FORBIDDEN",
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (
          error instanceof GraphQLRequestError &&
          error.code &&
          NON_RETRYABLE_CODES.has(error.code)
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
