import { ApiError } from "./ApiError";

export class NotFoundError extends ApiError {
  /**
   *
   */
  constructor(message = "Registro não encontrado") {
    super(404, message);
  }
}