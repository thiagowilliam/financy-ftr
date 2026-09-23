import { AppError } from "./app-error.js";

export class UnauthorizedError extends AppError {
  constructor(message = "Voce precisa estar autenticado para executar esta operacao.") {
    super(message, "UNAUTHENTICATED");
    this.name = "UnauthorizedError";
  }
}
