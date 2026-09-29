/** Erro de uma operação GraphQL, com o `code` enviado pelo backend (ex.: CONFLICT). */
export class GraphQLRequestError extends Error {
  readonly code?: string;
  readonly field?: string;

  constructor(message: string, code?: string, field?: string) {
    super(message);
    this.name = "GraphQLRequestError";
    this.code = code;
    this.field = field;
  }
}

/** Mensagem amigável para exibir ao usuário a partir de qualquer erro. */
export function getErrorMessage(error: unknown, fallback = "Algo deu errado. Tente novamente.") {
  return error instanceof GraphQLRequestError ? error.message : fallback;
}
