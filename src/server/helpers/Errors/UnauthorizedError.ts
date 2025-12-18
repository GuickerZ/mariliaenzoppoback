import { ApiError } from "./ApiError";

export class UnauthorizedError extends ApiError {
  /**
   *
   */
  constructor(message = "Acesso não autorizado") {
    super(401, message);
  }
}