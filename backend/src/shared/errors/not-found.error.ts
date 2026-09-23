import { AppError } from "./app-error.js";

export class NotFoundError extends AppError {
  constructor(message = "Registro nao encontrado.") {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}
