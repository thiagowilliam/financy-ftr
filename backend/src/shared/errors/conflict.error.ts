import { AppError } from "./app-error.js";

export class ConflictError extends AppError {
  constructor(message = "Ja existe um registro com esses dados.") {
    super(message, "CONFLICT");
    this.name = "ConflictError";
  }
}
