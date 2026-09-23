import { AppError } from "./app-error.js";

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, "BAD_USER_INPUT", field ? { field } : {});
    this.name = "ValidationError";
  }
}
