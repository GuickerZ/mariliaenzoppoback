import { ApiError } from "./ApiError";

export class BadRequestError extends ApiError {
  /**
   *
   */
  constructor(message = "Requisição problemática") {
    super(400, message);
  }
}