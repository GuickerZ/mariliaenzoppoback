import { ApiError } from "./ApiError";

export class ConflictError extends ApiError {
  /**
   *
   */
  constructor(message = "Conflito") {
    super(409, message);

  }
}