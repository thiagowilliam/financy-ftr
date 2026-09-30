import { AppError } from "./app-error.js";

export class TooManyRequestsError extends AppError {
  constructor(message = "Muitas tentativas. Tente novamente mais tarde.") {
    super(message, "TOO_MANY_REQUESTS");
    this.name = "TooManyRequestsError";
  }
}
